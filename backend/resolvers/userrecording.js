const User = require('../db/userschema')

module.exports = {
    user({ user }) {
        return User.findById(user)
    }
}