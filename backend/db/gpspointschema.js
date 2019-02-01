const mongoose = require('mongoose')

exports.GpsPoint = mongoose.Schema({
    x: {
        type: Number,
        required: true
    },
    y: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    }
})