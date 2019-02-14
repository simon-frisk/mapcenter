const User = require('../db/userschema')
const Event = require('../db/eventschema')
const Course = require('../db/courseschema')
const fs = require('fs')
const Jimp = require('jimp')
const streamToBuffer = require('stream-to-buffer')
const uniqueFilename = require('unique-filename')
const mimeTypes = require('mime-types')
const { checkAuth } = require('../util')

module.exports = {
    async createEvent(_, { eventInput }, { userId }) {
        checkAuth(userId)
        if(!/[a-zA-ZÅÄÖåäö]+/.test(eventInput.name)) throw 'invalid event name'
        if(eventInput.courses.length < 1) throw 'Event must contain at least one course'
        for(let i = 0 ; i < eventInput.courses.length ; i ++) {
            if(!/[a-zA-ZÅÄÖåäö]+/.test(eventInput.courses[i].name))
                throw 'Invalid course name'
        }

        const event = new Event({
            name: eventInput.name,
            adminUser: userId
        })

        const courseIds = await Promise.all(eventInput.courses.map(async courseInput => {
            const { createReadStream, mimetype } = await courseInput.mapFile
            if(!mimetype.startsWith('image/'))
                throw new Error('invalid file type')
            const fileName = uniqueFilename('') + '.' + mimeTypes.extension(mimetype)

            await new Promise(resolve => {
                streamToBuffer(createReadStream(), (err, buffer) => {
                    if(err) throw new Error('failed to upload file')
                    Jimp.read(buffer)
                            .then(image => {
                                const thumb = image.clone()
                                const mapPromise = image.writeAsync('./images/' + fileName)

                                const width = thumb.bitmap.width
                                const height = thumb.bitmap.height
                                const thumbWidth = width > 400 ? 400 : width
                                const thumbHeight = height > 250 ? 250 : height
                                const thumbX = Math.floor((width - thumbWidth) / 2)
                                const thumbY = Math.floor((height - thumbHeight) / 2)
                    
                                const thumbPromise = thumb
                                    .crop(thumbX, thumbY, thumbWidth, thumbHeight)
                                    .writeAsync('./images/thumb_' + fileName)

                                Promise.all([ mapPromise, thumbPromise ]).then(resolve)
                            })
                            .catch(err => { throw err })
                })
            })
            
            const {id} = await new Course({
                name: courseInput.name,
                mapPath: 'images/' + fileName,
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
    }
}