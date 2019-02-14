const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
const { connectToDb, checkToken } = require('./util')
const typeDefs = require('./schema')
const resolvers = require('./resolvers/main')
require('dotenv').config()

connectToDb()

const app = express()
app.use(helmet())
app.use(compression())
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(checkToken)
app.use('/images', express.static('images'))

new ApolloServer({
    typeDefs, 
    resolvers, 
    context: ({req}) => ({
        userId: req.userId
    }),
    uploads: {
        maxFileSize: 500000000,
        maxFiles: 100
    }
}).applyMiddleware({ app })

app.listen(4000, () => {
    console.log('server running')
})