const Course = require('../db/courseschema')
const User = require('../db/userschema')

module.exports = {
    courses({ courses }) {
        return Course.find({_id: {$in: courses}}).sort('-event').exec()
    },

    following({ following }) {
        return User.find({_id: {$in: following}})
    },

    followers({ followers }) {
        return User.find({_id: {$in: followers}})
    }
}