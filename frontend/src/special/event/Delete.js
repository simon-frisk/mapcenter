import React from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import gql from 'graphql-tag'
import Button from '@material-ui/core/Button'
import Loading from '../../general/Loading'

const DELETEMUTATION = gql`
    mutation DeleteEvent($id: ID!) {
        deleteEvent(id: $id)
    }
`

export default withRouter(({ event, context, history }) =>
    <>
        {event.adminUser._id === context.user &&
            <Mutation mutation={DELETEMUTATION}>
                {(mutate, {loading}) => {
                    if(loading)
                        return <Loading />
                    return (
                        <Button
                            variant='contained'
                            onClick={() => {
                                mutate({variables: {id: event._id}})
                                    .then(() => {
                                        history.push('/')
                                        context.apolloClient.resetStore()
                                    })
                            }}
                        >Delete event</Button>
                    )
                }}
            </Mutation>
        }
    </>
)