const User = require('../db/userschema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { checkAuth } = require('../util')

module.exports = {
    async createUser(_, { userInput }) {
        if(!validateUser(userInput))
            throw new Error('Invalid user input')
        if(await User.findOne({ email: userInput.email }))
            throw new Error('User already exists')
        const hashedPassword = await bcrypt.hash(userInput.password, 12)
        const user = new User({
            ...userInput,
            password: hashedPassword
        })
        const { id } = await user.save()
        const token = await jwt.sign({userId: id}, 'kjasdlfjalashdfushdluahful')
        return token
    },

    async uploadProfilePicture(_, { file }, { userId }) {
        checkAuth(userId)
        const { createReadStream, mimetype } = await file
        if(!mimetype.startsWith('image/'))
            throw new Error('invalid file type')
        const filePath = './images/' + uniqueFilename('') + '.' + mimeTypes.extension(mimetype)
        
        await new Promise(resolve => {
            streamToBuffer(createReadStream(), (err, buffer) => {
                if(err) throw new Error('failed to upload file')
                Jimp.read(buffer)
                        .then(image => {
                            image
                                .cover(200, 200)
                                .writeAsync(filePath)
                                .then(resolve)
                        })
                        .catch(err => { throw err })
            })
        })
        const user = await User.findById(userId)
        if(user._doc.profilePicturePath)
            fs.unlink(user.profilePicturePath, err => {
                if(err) throw err
            })
        user.profilePicturePath = filePath
        user.save()
        return filePath
    },

    async follow(_, { id }, { userId }) {
        checkAuth(userId)
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

    async unfollow(_, { id }, { userId }) {
        checkAuth(userId)
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

function validateUser(userInput) {
    const fieldsAreValid = []
    fieldsAreValid.push(emailRegex.test(userInput.email))
    fieldsAreValid.push(nameRegex.test(userInput.name))
    fieldsAreValid.push(passwordRegex.test(userInput.password))
    for(isValid of fieldsAreValid)
        if(!isValid) return false
    return true
}

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
const nameRegex = /^[A-ZÅÄÖ][a-zaåä]+ [A-ZÅÄÖ][a-zåäö]+$/
const passwordRegex = /^.{6,}$/