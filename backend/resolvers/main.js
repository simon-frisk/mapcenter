module.exports = {
    Query: require('./query'),
    Mutation: {
        ...require('./usermutations'),
        ...require('./eventmutations'),
        ...require('./gpsmutations')
    },
    Event: require('./event'),
    Course: require('./course'),
    User: require('./user'),
    UserRecording: require('./userrecording')
}