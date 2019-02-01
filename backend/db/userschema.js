const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    courses: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Course'
    }],
    following: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true})

module.exports = mongoose.model('User', UserSchema)