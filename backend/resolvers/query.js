const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../db/userschema')
const Event = require('../db/eventschema')
const { checkAuth } = require('../util')

module.exports = {
    async login(_, { email, password }) {
        const user = await User.findOne({ email })
        if(!user)
            throw new Error('invalid credentials')
        const loginSuccess = await bcrypt.compare(password, user.password)
        if(!loginSuccess)
            throw new Error('invalid credentials')
        const token = await jwt.sign({userId: user.id}, 'kjasdlfjalashdfushdluahful')
        return token
    },

    recentEvents(_, __, { userId }) {
        checkAuth(userId)
        return Event.find().sort('-_id').exec()
    },

    event(_, { id }, { userId }) {
        checkAuth(userId)
        return Event.findById(id)
    },

    user(_, { id }, { userId }) {
        checkAuth(userId)
        return User.findById(id)
    }
}