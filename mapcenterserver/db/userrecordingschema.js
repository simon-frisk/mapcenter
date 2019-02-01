const mongoose = require('mongoose')
const {GpsPoint} = require('./gpspointschema')

const UserRecordingSchema = mongoose.Schema({
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    gps: [GpsPoint],
    startTime: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('UserRecording', UserRecordingSchema)