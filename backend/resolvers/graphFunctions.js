const User = require('../db/userschema')
const Event = require('../db/eventschema')
const Course = require('../db/courseschema')
const UserRecording = require('../db/userrecordingschema')

async function getUser(userId) {
    const user = await User.findById(userId)
    if(!user)
        throw new Error('does not exist')
    return {
        ...user._doc,
        _id: user.id,
        followers: getUsers.bind(null, user._doc.followers),
        following: getUsers.bind(null, user._doc.following),
        courses: getCourses.bind(null, user._doc.courses)
    }
}

async function getUsers(userIds) {
    const users = await User.find({_id: {$in: userIds}})
    return users.map(user => ({
        ...user._doc,
        _id: user.id,
        followers: getUsers.bind(null, user._doc.followers),
        following: getUsers.bind(null, user._doc.following),
        courses: getCourses.bind(null, user._doc.courses)
    }))
}

async function getEvent(eventId, courses) {
    const event = await Event.findById(eventId)
    const coursesList = !courses ? event._doc.courses : (courses[0] == 0 ? event.courses[0] : courses)
    if(!event)
        throw new Error('event does not exist')
    return {
        ...event._doc,
        _id: event.id,
        courses: getCourses.bind(null, coursesList),
        adminUser: getUser.bind(null, event._doc.adminUser)
    }
}

async function getRecentEvents(courses) {
    const events = await Event.find().sort('-_id').exec()
    return events.map(event => {
        const coursesList = !courses ? event._doc.courses : (courses[0] == 0 ? event.courses[0] : courses)
        return {
            ...event._doc,
            _id: event.id,
            courses: getCourses.bind(null, coursesList),
            adminUser: getUser.bind(null, event._doc.adminUser)
        }
    })
}

async function getCourses(courseIds) {
    const courses = await Course.find({_id: {$in: courseIds}}).sort('-event').exec()
    return courses.map(course => {
        return {
            ...course._doc,
            _id: course.id,
            event: getEvent.bind(null, course._doc.event),
            userRecordings: getUserRecordings.bind(null, course._doc.userRecordings)
        }
    })
}

async function getUserRecordings(userRecordingIds) {
    const userRecordings = await UserRecording.find({_id: {$in: userRecordingIds}})
    return userRecordings.map(userRecording => {
        return {
            ...userRecording._doc,
            _id: userRecording.id,
            user: getUser.bind(null, userRecording._doc.user)
        }
    })
}

module.exports = {
    getRecentEvents,
    getEvent,
    getUser
}