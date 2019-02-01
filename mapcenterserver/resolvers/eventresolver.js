const Event = require('../db/eventschema')
const Course = require('../db/courseschema')
const User = require('../db/userschema')
const UserRecording = require('../db/userrecordingschema')
const { generateOverviewMap } = require('../image')
const graph = require('./graphFunctions')

module.exports = {

    async createEvent({eventInput}, {userId}) {
        if(!/[a-zA-ZÅÄÖåäö]+/.test(eventInput.name)) throw 'invalid event name'

        if(eventInput.courses.length < 1) throw 'Event must contain at least one course'

        for(let i = 0 ; i < eventInput.courses.length ; i ++) {
            if(!/[a-zA-ZÅÄÖåäö]+/.test(eventInput.courses[i].name)) throw 'Invalid course name'
            if(!eventInput.courses[i].mapPath) throw 'No map selected'
        }
        if(!userId)
            throw new Error('not authorized')
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
        const {id} = await event.save()
        return graph.getEvent(id)
    },

    async deleteEvent({ eventId }, { userId }) {
        if(!userId)
            throw new Error('not authorized')
        const event = await Event.findById(eventId).populate({path: 'courses', populate: {path: 'userRecordings'}})
        if(event.adminUser != userId)
            throw new Error('event can only be deleted by admin user')
        await event.courses.forEach(async course => {
            await course.userRecordings.forEach(async userRecording => {
                await User.findByIdAndUpdate(userRecording.user, { $pull: { courses: course._id } })
                await UserRecording.findByIdAndDelete(userRecording._id)
            })
            await Course.findByIdAndDelete(course._id)
        })
        await Event.findByIdAndDelete(eventId)
        return true
    },

    async recentEvents({ courses }, {userId}) {
        if(!userId)
            throw new Error('not authorized')
        return graph.getRecentEvents(courses)
    },

    async event({id, courses}, {userId}) {
        if(!userId)
            throw new Error('not authorized')
        return graph.getEvent(id, courses)
    },

    async addGps({courseId, userRecordingInput}, {userId}) {
        if(!userId)
            throw new Error('not authorized')
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
            await event.set({overviewMapPath: 'images/' + overviewMapPath})
            await event.save()
        }
        return true
    },

    async removeGps({ courseId }, { userId }) {
        if(!userId)
            throw new Error('not authorized')
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
    }
}