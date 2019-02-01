const mongoose = require('mongoose')

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    courses: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Course'
    }],
    overviewMapPath: String,
    adminUser: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Event', EventSchema)