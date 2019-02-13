import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Loading from '../../general/Loading'
import Layout from '../../general/Layout'
import Error from '../../general/Error'
import Users from './Users'
import Events from './Events'

const QUERY = gql`
    query explore {
        recentEvents {
            name
            _id
            courses(onlyFirst: true) {
                mapPath
            }
        }
        topUsers {
            _id
            name
            profilePicturePath
        }
    }
`

export default () => 
    <Layout>
        <Query query={QUERY}>
            {({loading, error, data}) => {
                if(loading)
                    return <Loading />
                if(error)
                    return <Error />
                return (
                    <>
                        <Events data={data} />
                        <Users data={data} />
                    </>
                )
            }}
        </Query>
    </Layout>
