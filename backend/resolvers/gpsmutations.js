const User = require('../db/userschema')
const Event = require('../db/eventschema')
const Course = require('../db/courseschema')
const UserRecording = require('../db/userrecordingschema')
const { checkAuth } = require('../util')
const { generateOverviewMap } = require('../util')

module.exports = {
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
    }
}