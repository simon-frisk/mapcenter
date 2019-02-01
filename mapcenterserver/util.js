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
    mongoose.connect(process.env.MONGODB, {
        useNewUrlParser: true,
        reconnectTries: Number.MAX_VALUE, 
        reconnectInterval: 1000
    })
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'connection error: '))
    db.once('open', () => console.log('connected to database'))
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