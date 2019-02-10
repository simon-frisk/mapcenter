const fs = require('fs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

exports.readAllGqlFiles = folder => {
    const files = fs.readdirSync(__dirname + folder)
    return files.map(file => {
        return fs.readFileSync(__dirname + folder + '/' + file)
    })
}

exports.getAllFileNames = folder => {
    return fs.readdirSync(__dirname + folder)
}

exports.connectToDb = () => {
    const dbUrl = process.env.NODE_ENV === 'production' ? 'mongodb://database:27017/mapcenter' : 'mongodb://localhost:27017/mapcenter'
    mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    })
        .then(
            () => console.log('connected to database'),
            err => { throw err }
        )
}

exports.checkToken = (req, _, next) => {
    const authHeader = req.get('Authorization')
    if(!authHeader)
        return next()
    const token = authHeader.split(' ')[1]
    let decodedToken
    try {
        decodedToken = jwt.verify(token, 'kjasdlfjalashdfushdluahful')
    } catch(error) {
        return next()
    }
    if(!decodedToken)
        return next()
    req.userId = decodedToken.userId
    next()
}

exports.checkAuth = userId => {
    if(!userId)
        throw new Error('not authorized')
}