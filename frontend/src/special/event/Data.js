import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Loading from '../../general/Loading'
import Error from '../../general/Error'

const QUERY = gql`
    query GetEvent($id: ID!){
        event(id: $id) {
            _id
            name
            overviewMapPath
            courses {
                _id
                name
                mapPath
                userRecordings {
                    user {
                        name
                        _id
                    }
                }
            }
            adminUser {
                _id
                name
            }
        }
    }
`

export default ({ children, id }) =>
    <Query query={QUERY} variables={{ id }}>
        {({ loading, error, data }) => {
            if(loading)
                return <Loading />
            if(error)
                return <Error />
            return children(data.event)
        }}
    </Query>