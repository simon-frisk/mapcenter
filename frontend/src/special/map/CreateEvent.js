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
    const mapPaths = []
    
    async function onCreateEvent(name, courses, mutate) {
        setEventCreated(true)
        const validationErrors = validateEvent({name, courses})
        if(validationErrors) {
            setEventCreated(false)
            return setError(validationErrors)
        }

        Promise.all(courses.map(async course => {
            const formData = new FormData()
            formData.append('image', course.mapFile)
            return await fetch('/api/map', {
                method: 'PUT',
                body: formData,
                headers: new Headers({
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                })
            })
        }))
            .then(responses => Promise.all(responses.map(response => response.json())))
            .then(responses => {
                responses.forEach(response => {
                    mapPaths.push(response.image)
                })
            })
            .then(() => {
                mutate({variables: {
                    eventInput: {
                        name,
                        courses: courses.map((course, index) => ({
                            name: course.name,
                            mapPath: mapPaths[index]
                        }))
                    }
                }})
            })
            .catch(error => {
                setEventCreated(false)
                setError(error.message)
            })
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