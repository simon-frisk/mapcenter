import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { withRouter } from 'react-router-dom'
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

export default withRouter(({ context, userId, following }) =>
    <>
    {
        context.user === userId ?
            <Button
                variant='contained'
                style={{ width: '100%' }}
                onClick={() => {
                    context.setAuthUser()
                    context.apolloClient.resetStore()
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
                onCompleted={() => {
                    context.apolloClient.resetStore()

                }}
            >
                {(mutate, { loading }) => {
                    return (
                        <Button
                            variant='contained'
                            style={{ width: '100%' }}
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
)