import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Error from '../../general/Error'
import Loading from '../../general/Loading'

const GETUSERQUERY = gql`
    query GetUserQuery($id: ID!) {
        user(id: $id) {
            name
            profilePicturePath
            courses {
                name
                _id
                event {
                    name
                    _id
                }
                mapPath
            }
            followers {
                name
                _id
            }
            following {
                name
                _id
            }
        }
    }
`

export default ({ id, children, user }) =>
    <Query
        query={GETUSERQUERY}
        variables={{ id }}
    >
            {({ loading, error, data, client }) => {
            if(loading)
                return <Loading />
            if(error)
                return <Error />
            const following = data.user.followers.map(user => user._id).includes(user)
            return children(data.user, following, client)
        }}
    </Query>