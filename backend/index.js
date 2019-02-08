const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
require('dotenv').config()

const {imageRouter} = require('./image')

const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const { 
    readAllGqlFiles, 
    getAllFileNames, 
    connectToDb, 
    checkToken
} = require('./util')
let resolvers = {}
for(fileName of getAllFileNames('/resolvers')) {
    const resolverModule = require(`./resolvers/${fileName}`)
    for(resolver in resolverModule) {
        resolvers[resolver] = resolverModule[resolver]
    }
}
const gql = readAllGqlFiles('/gql')

connectToDb()

const app = express()
app.use(helmet())
app.use(compression())
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(checkToken)
app.use(imageRouter)

app.use('/graphql', graphqlHttp({
    schema: buildSchema(gql.join('\n')),
    rootValue: resolvers,
    graphiql: true
}))

app.listen(4000, () => {
    console.log('server running')
})