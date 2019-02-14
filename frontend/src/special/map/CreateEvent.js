import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import EventForm from './view/eventform'
import Layout from '../../general/Layout'

const MUTATION = gql`
    mutation CreateEvent($eventInput: EventInput!) {
        createEvent(eventInput: $eventInput) {
            _id
        }
    }
`

export default () => {
    const [error, setError] = useState()
    const [eventCreated, setEventCreated] = useState(false)
    
    async function onCreateEvent(name, courses, mutate) {
        setEventCreated(true)
        const validationErrors = validateEvent({name, courses})
        if(validationErrors) {
            setEventCreated(false)
            return setError(validationErrors)
        }
        
        mutate({variables: {
            eventInput: {
                name,
                courses: courses.map(course => ({
                    name: course.name,
                    mapFile: course.mapFile
                }))
            }
        }})
    }

    return (
        <Layout>
            <Mutation mutation={MUTATION}>
                {(createEvent, { client, loading, error: mutationError, data, called }) => {
                    if(called && !loading && !mutationError) {
                        client.resetStore()
                        return <Redirect to={`/event/${data.createEvent._id}`} />
                    }
                    return (
                        <EventForm
                            onCreateEvent={(name, courses) => {
                                onCreateEvent(name, courses, createEvent)
                            }}
                            error={error || (mutationError ? mutationError.message : null)}
                            loading={loading || eventCreated}
                        />
                    )
                }}
            </Mutation>
        </Layout>
    )
    
}
function validateEvent({name, courses}) {
    if(!/[a-zA-ZÅÄÖåäö]+/.test(name)) return 'Invalid event name'

    if(courses.length < 1) return 'Event must contain at least one course'

    for(let i = 0 ; i < courses.length ; i ++) {
        if(!/[a-zA-ZÅÄÖåäö]+/.test(courses[i].name)) return 'Invalid course name'
        if(!courses[i].mapFile) return 'No map selected'
        if(!/(.jpg|.jpeg|.png)$/.test(courses[i].mapFile.name)) return 'Invalid map file. Must be jpeg or png'
    }

    return null
}