import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '@material-ui/core/Button'

const FOLLOWUSERMUTATION = gql`
    mutation follow($id: ID!) {
        follow(id: $id)
    }
`

const UNFOLLOWMUTATION = gql`
    mutation unfollow($id: ID!) {
        unfollow(id: $id)
    }
`

export default ({ context, userId, client, following }) =>
    <>
    {
        context.user === userId ?
            <Button
                variant='contained'
                onClick={() => {
                    context.setAuthUser()
                    client.resetStore()
                }}
            >
                Log out
            </Button>
        :
            <Mutation 
                mutation={following ? UNFOLLOWMUTATION : FOLLOWUSERMUTATION} 
                variables={{
                    id: userId
                }}
            >
                {(mutate, { loading, called, client }) => {
                    if(!loading && called)
                        client.resetStore()
                    return (
                        <Button
                            variant='contained'
                            color={!following ? 'secondary' : 'default'}
                            disabled={loading}
                            onClick={mutate}
                        >
                            {!following ? 'follow' : 'unfollow'}
                        </Button>
                    )
                }}
            </Mutation>
        }
    </>