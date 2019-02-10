const UserRecording = require('../db/userrecordingschema')
const Event = require('../db/eventschema')

module.exports = {
    userRecordings({ userRecordings }) {
        return UserRecording.find({_id: {$in: userRecordings}})
    },

    event({ event }) {
        return Event.findById(event)
    }
}