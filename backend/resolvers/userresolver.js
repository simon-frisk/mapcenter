const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../db/userschema')
const { getUser } = require('./graphFunctions')

module.exports = {
    async createUser({userInput}) {
        if(!fieldsAreValid(userInput))
            throw new Error('Invalid user input')
        if(await User.findOne({email: userInput.email}))
            throw new Error('User already exists')
        const hashedPassword = await bcrypt.hash(userInput.password, 12)
        const user = new User({
            ...userInput,
            password: hashedPassword
        })
        const {id} = await user.save()
        const token = await createToken(id)
        return token
    },

    async user({id}, {userId}) {
        if(!userId)
            throw new Error('not authorized')
        return getUser(id)
    },

    async login({email, password}) {
        const user = await User.findOne({email})
        if(!user)
            throw new Error('invalid credentials')
        const loginSuccess = await bcrypt.compare(password, user.password)
        if(!loginSuccess)
            throw new Error('invalid credentials')
        const token = await createToken(user.id)
        return token
    },

    async follow({ id }, { userId }) {
        if(!userId)
            throw new Error('not authorized')
        const user = await User.findById(userId)
        const alreadyFollows = user.following.some(following => {
            return following == id
        })
        if(alreadyFollows)
            throw 'already following'
        user.following.push(id)
        user.save()
        const follow = await User.findById(id)
        follow.followers.push(userId)
        follow.save()
        return true
    },

    async unfollow({ id }, { userId }) {
        if(!userId)
            throw new Error('not authorized')
        const user = await User.findById(userId)
        const alreadyFollows = user.following.some(following => {
            return following == id
        })
        if(!alreadyFollows)
            throw 'not following'
        user.following.forEach((following, index) => {
            if(following == id)
                user.following.splice(index, 1)
        })
        user.save()
        const follow = await User.findById(id)
        follow.followers.forEach((follower, index) => {
            if(userId == follower) 
                follow.followers.splice(index, 1)
        })
        follow.save()
        return true
    }
}

function fieldsAreValid(userInput) {
    const fieldsAreValid = []
    fieldsAreValid.push(emailRegex.test(userInput.email))
    fieldsAreValid.push(nameRegex.test(userInput.name))
    fieldsAreValid.push(passwordRegex.test(userInput.password))
    for(isValid of fieldsAreValid)
        if(!isValid) return false
    return true
}

function createToken(id) {
    return jwt.sign({userId: id}, 'kjasdlfjalashdfushdluahful')
}

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const nameRegex = /^[A-ZÅÄÖ][a-zaåä]+ [A-ZÅÄÖ][a-zåäö]+$/
const passwordRegex = /^.{6,}$/