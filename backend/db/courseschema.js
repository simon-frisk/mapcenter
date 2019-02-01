const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userRecordings: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'UserRecording'
    }],
    mapPath: {
        type: String,
        required: true
    },
    event: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Event'
    }
})

module.exports = mongoose.model('Course', CourseSchema)