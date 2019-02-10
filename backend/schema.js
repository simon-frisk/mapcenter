const { gql } = require('apollo-server-express')

module.exports = gql`

    type Query {
        recentEvents: [Event!]!
        event(id: ID!): Event!
        user(id: ID!): User!
        login(email: String!, password: String!): String!
    }

    type Mutation {
        createUser(userInput: UserInput!): String!
        createEvent(eventInput: EventInput!): Event!
        deleteEvent(id: ID!): Boolean!
        addGps(courseId: ID! userRecordingInput: UserRecordingInput!): Boolean!
        removeGps(courseId: ID!): Boolean!
        follow(id: ID!): Boolean!
        unfollow(id: ID!): Boolean!
    }

    type Event {
        _id: ID!
        name: String!
        courses(onlyFirst: Boolean id: ID): [Course!]!
        overviewMapPath: String
        adminUser: User!
    }

    type Course {
        _id: ID!
        name: String!
        userRecordings: [UserRecording!]!
        mapPath: String!
        event: Event!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        courses: [Course!]
        following: [User!]
        followers: [User!]
    }
    
    type UserRecording {
        user: User!
        gps: [GpsPoint!]!
        startTime: String!
    }

    type GpsPoint {
        x: Float!
        y: Float!
        time: Int!
    }

    input EventInput {
        name: String!
        courses: [CourseInput!]!
    }

    input CourseInput {
        name: String!
        mapPath: String!
    }

    input UserRecordingInput {
        user: ID!
        gps: [GpsPointInput!]!
        lat: Float!
        lon: Float!
        startTime: String!
    }

    input GpsPointInput {
        x: Float!
        y: Float!
        time: Int!
    }


    input UserInput {
        name: String!
        email: String!
        password: String!
    }
    
`