import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '@material-ui/core/Button'
import Loading from '../../general/Loading'
import { Redirect } from 'react-router-dom'

const DELETEMUTATION = gql`
    mutation DeleteEvent($id: ID!) {
        deleteEvent(id: $id)
    }
`

export default ({ event, user }) =>
    <>
        {event.adminUser._id === user &&
            <Mutation mutation={DELETEMUTATION}>
                {(mutate, {called, client, loading}) => {
                    if(loading)
                        return <Loading />
                    if(!loading && called) {
                        client.resetStore()
                        return <Redirect to='/' />
                    }
                    return (
                        <Button
                            variant='contained'
                            onClick={() => {
                                mutate({variables: {id: event._id}})
                            }}
                        >Delete event</Button>
                    )
                }}
            </Mutation>
        }
    </>