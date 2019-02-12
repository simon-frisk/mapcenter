const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../db/userschema')
const Event = require('../db/eventschema')
const Course = require('../db/courseschema')
const UserRecording = require('../db/userrecordingschema')
const { checkAuth } = require('../util')
const { generateOverviewMap } = require('../image')
const fs = require('fs')

module.exports = {
    async createUser(_, { userInput }) {
        if(!validateUser(userInput))
            throw new Error('Invalid user input')
        if(await User.findOne({ email: userInput.email }))
            throw new Error('User already exists')
        const hashedPassword = await bcrypt.hash(userInput.password, 12)
        const user = new User({
            ...userInput,
            password: hashedPassword
        })
        const { id } = await user.save()
        const token = await jwt.sign({userId: id}, 'kjasdlfjalashdfushdluahful')
        return token
    },

    async createEvent(_, { eventInput }, { userId }) {
        checkAuth(userId)
        if(!/[a-zA-ZÅÄÖåäö]+/.test(eventInput.name)) throw 'invalid event name'
        if(eventInput.courses.length < 1) throw 'Event must contain at least one course'
        for(let i = 0 ; i < eventInput.courses.length ; i ++) {
            if(!/[a-zA-ZÅÄÖåäö]+/.test(eventInput.courses[i].name)) throw 'Invalid course name'
            if(!eventInput.courses[i].mapPath) throw 'No map selected'
        }
        const event = new Event({
            name: eventInput.name,
            adminUser: userId
        })
        const courseIds = await Promise.all(eventInput.courses.map(async courseInput => {
            const {id} = await new Course({
                name: courseInput.name,
                mapPath: courseInput.mapPath,
                userRecordings: [],
                event: event._id
            }).save()
            return id
        }))
        event.courses = courseIds
        await event.save()
        return event
    },

    async deleteEvent(_, { id }, { userId }) {
        checkAuth(userId)
        const event = await Event.findById(id).populate({path: 'courses', populate: {path: 'userRecordings'}})
        if(event.adminUser != userId)
            throw new Error('event can only be deleted by admin user')
        await event.courses.forEach(async course => {
            await course.userRecordings.forEach(async userRecording => {
                await User.findByIdAndUpdate(userRecording.user, { $pull: { courses: course._id } })
                await UserRecording.findByIdAndDelete(userRecording._id)
            })
            await Course.findByIdAndDelete(course._id)
        })
        event.courses.forEach(course => {
            fs.unlink(course.mapPath.split('/').join('/thumb_'), err => {
                if(err) throw err
            })
            fs.unlink(course.mapPath, err => {
                if(err) throw err
            })
        })
        if(event.overviewMapPath)
            fs.unlink(event.overviewMapPath, err => {
                if(err) throw err
            })
        await Event.findByIdAndDelete(id)
        return event
    },

    async addGps(_, {courseId, userRecordingInput}, {userId}) {
        checkAuth(userId)
        const course = await Course.findById(courseId)
        const userRecording = new UserRecording({
            user: userRecordingInput.user,
            gps: userRecordingInput.gps,
            startTime: userRecordingInput.startTime
        })
        const { id: userRecordingId } = await userRecording.save()
        course.userRecordings.push(userRecordingId.toString())
        await course.save()
        await User.findByIdAndUpdate(userRecordingInput.user, {$push: {
            courses: courseId.toString()
        }})
        const event = await Event.findById(course.event)
        if(!event._doc.overviewMapPath) {
            const overviewMapPath = await generateOverviewMap(userRecordingInput.lat, userRecordingInput.lon)
            await event.set({overviewMapPath: overviewMapPath})
            await event.save()
        }
        return true
    },

    async removeGps(_, { courseId }, { userId }) {
        checkAuth(userId)
        const course = await Course.findById(courseId).populate('userRecordings')
        course.userRecordings.forEach(async (userRecording, index) => {
            if(userRecording.user == userId) {
                course.userRecordings.splice(index, 1)
                await UserRecording.findByIdAndDelete(userRecording._id)
            }
        })
        course.save()

        const user = await User.findById(userId)
        user.courses.forEach((course, index) => {
            if(course == courseId)
                user.courses.splice(index, 1)
        })
        user.save()
        return true
    },

    async uploadProfilePicture(_, { file }, { userId }) {
        checkAuth(userId)
        const { stream, mimetype } = await file
        if(!mimetype.startsWith('image/'))
            throw new Error('invalid file type')
        const filePath = './images/' + uniqueFilename('') + '.' + mimeTypes.extension(mimetype)
        await new Promise((resolve, reject) => {
            stream
                .on('error', error => {
                    if(stream.truncated)
                        fs.unlink(filePath)
                    reject(error)
                })
                .pipe(fs.createWriteStream(filePath))
                .on('error', reject)
                .on('finish', () => resolve())
        })
        const user = await User.findById(userId)
        if(user._doc.profilePicturePath)
            fs.unlink(user.profilePicturePath)
        user.profilePicturePath = filePath
        user.save()
        return filePath
    },

    async follow(_, { id }, { userId }) {
        checkAuth(userId)
        const user = await User.findById(userId)
        const alreadyFollows = user.following.some(following => {
            return following == id
        })
        if(alreadyFollows)
            throw 'already following'
        user.following.push(id)
        user.save()
        const follow = await User.findById(id)
        follow.followers.push(userId)
        follow.save()
        return true
    },

    async unfollow(_, { id }, { userId }) {
        checkAuth(userId)
        const user = await User.findById(userId)
        const alreadyFollows = user.following.some(following => {
            return following == id
        })
        if(!alreadyFollows)
            throw 'not following'
        user.following.forEach((following, index) => {
            if(following == id)
                user.following.splice(index, 1)
        })
        user.save()
        const follow = await User.findById(id)
        follow.followers.forEach((follower, index) => {
            if(userId == follower) 
                follow.followers.splice(index, 1)
        })
        follow.save()
        return true
    }
}


function validateUser(userInput) {
    const fieldsAreValid = []
    fieldsAreValid.push(emailRegex.test(userInput.email))
    fieldsAreValid.push(nameRegex.test(userInput.name))
    fieldsAreValid.push(passwordRegex.test(userInput.password))
    for(isValid of fieldsAreValid)
        if(!isValid) return false
    return true
}

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const nameRegex = /^[A-ZÅÄÖ][a-zaåä]+ [A-ZÅÄÖ][a-zåäö]+$/
const passwordRegex = /^.{6,}$/