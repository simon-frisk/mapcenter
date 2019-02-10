import React, { useContext } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Context from '../../super/Context'
import Loading from '../../view/Loading'

const QUERY = gql`
    query GetEvent($id: ID! $course: ID!) {
        event(id: $id) {
            name
            courses(id: $course) {
                userRecordings {
                    user {
                        _id
                    }
                }
                mapPath
            }
        }
    }
`

const MUTATION = gql`
    mutation AddGps($userRecordingInput: UserRecordingInput! $courseId: ID!) {
        addGps(courseId: $courseId userRecordingInput: $userRecordingInput)
    }
`

export default withRouter(function({ eventId, courseId, children }) {
    const context = useContext(Context)

    return (
        <Mutation mutation={MUTATION}>
            {(apolloMutate, { client, called, loading: mutationLoading, error: mutationError }) => {
                if(called && !mutationLoading && !mutationError) {
                    client.resetStore()
                    return (
                        <Redirect
                            to={`/map/${eventId}/${courseId}`}
                        />
                    )
                }

                function mutate(gps, firstCoord, startTime) {
                    apolloMutate({variables: {
                        courseId: courseId,
                        userRecordingInput: {
                            user: context.user,
                            gps,
                            ...firstCoord,
                            startTime
                        }
                    }})
                }

                return (
                    <Query query={QUERY}variables={{id: eventId, course: courseId}}>
                        {({loading, error: queryError, data}) => {
                            if(loading)
                                return <Loading />
                            const { event } = data
                            const userRecordings = event.courses[0].userRecordings
                            const eventUsers = userRecordings.map(userRec => userRec.user._id)
                            if(eventUsers.includes(context.user)) return (
                                <Redirect
                                    to={`/map/${eventId}/${courseId}`}
                                />
                            )
                            return React.cloneElement(children, {
                                queryError, mutationError, event, mutationLoading, mutate
                            })
                        }}
                    </Query>
                )
            }}
        </Mutation>
    )
})