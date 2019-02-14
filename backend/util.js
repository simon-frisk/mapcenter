const fs = require('fs')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const uniqueFilename = require('unique-filename')
const axios = require('axios')

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

exports.generateOverviewMap = async function(lat, lon) {
    const url = `https://open.mapquestapi.com/staticmap/v5/map?key=qabAXGPxCyZzOOQz0cIBJpxAgU53XGwM&center=${lat}, ${lon}&size=300, 200@2x&zoom=9&type=map&locations=${lat}, ${lon}&defaultMarker=marker-FFC107-sm`
    
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })

    const fileName = 'overview_' + uniqueFilename('') + '.jpg'
    
    const writeStream = fs.createWriteStream('./images/' + fileName)

    response.data.pipe(writeStream)

    return new Promise((resolve, reject) => {
        writeStream.on('finish', resolve)
        writeStream.on('error', reject)
    })
        .then(() => {
            return 'images/' + fileName
        })
}