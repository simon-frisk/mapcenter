const mimeTypes = require('mime-types')
const uniqueFilename = require('unique-filename')
const sharp = require('sharp')
const axios = require('axios')
const multer = require('multer')
const express = require('express')
const image = express.Router()

const multerSetup = multer({
    storage: multer.memoryStorage(),
    fileFilter(_, file, cb) {
        if(file.mimetype.startsWith('image/'))
            cb(null, true)
        else
            cb(null, false)
    }
}).single('image')

function generateThumbnail(buffer) {
    const image = sharp(buffer)
    return image.metadata()
        .then(metadata => {
            const thumbWidth = metadata.width > 400 ? 400 : metadata.width
            const thumbHeight = metadata.height > 250 ? 250 : metadata.height
            const thumbX = Math.floor((metadata.width - thumbWidth) / 2)
            const thumbY = Math.floor((metadata.height - thumbHeight) / 2)

            return image
                .extract({left: thumbX, top: thumbY, width: thumbWidth, height: thumbHeight})
                .toBuffer()
        })
}

exports.generateOverviewMap = async function(lat, lon) {
    const url = `https://open.mapquestapi.com/staticmap/v5/map?key=qabAXGPxCyZzOOQz0cIBJpxAgU53XGwM&center=${lat}, ${lon}&size=300, 200@2x&zoom=9&type=map&locations=${lat}, ${lon}&defaultMarker=marker-FFC107-sm`

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
    })

    const fileName = 'overview_' + uniqueFilename('') + '.jpg'
    return s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: response.data
    }).promise()
        .then(() => {
            return fileName
        })
}

image.get('/images/:id', (req, res) => {
    s3.getObject({
        Bucket: process.env.S3_BUCKET,
        Key: req.params.id,
    }).promise()
        .then(data => {
            res.write(data.Body, 'binary')
            res.end()
        })
        .catch(err => {
            res.end('error')
        })
})

image.put('/map', (req, res, next) => {
    if(!req.userId)
    return res.send('user not authorized')
    next()
})

image.use(multerSetup)

image.put('/map', (req, res) => {
    if(!req.file)
        return res.send('no file provided or provided file of wrong type')

    const fileName = uniqueFilename('') + '.' + mimeTypes.extension(req.file.mimetype)

    const mapPromise = s3.putObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: req.file.buffer
    }).promise()
    const thumbPromise = generateThumbnail(req.file.buffer)
        .then(buffer => {
            return s3.putObject({
                Bucket: process.env.S3_BUCKET,
                Key: 'thumb_' + fileName,
                Body: buffer
            }).promise()
        })

    Promise.all([mapPromise, thumbPromise])
        .then(() => {
            res.json({'image': 'images/' + fileName})
        })
})

exports.imageRouter = image