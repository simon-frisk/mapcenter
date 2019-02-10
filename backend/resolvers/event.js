const User = require('../db/userschema')
const Course = require('../db/courseschema')

module.exports = {
    adminUser({ adminUser }) {
        return User.findById(adminUser)
    },
    courses({ courses }, { onlyFirst, id }) {
        if(onlyFirst)
            return [Course.findById(courses[0])]
        if(id)
            return [Course.findById(id)]
        return Course.find({_id: {$in: courses}}).sort('-event').exec()
    }
}