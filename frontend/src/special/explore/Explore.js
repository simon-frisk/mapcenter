import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Card from '../../general/Card'
import Loading from '../../general/Loading'
import Layout from '../../general/Layout'
import Error from '../../general/Error'

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
                        <Typography variant='h4'>Recent events</Typography>
                        <Grid container spacing={16}>
                            {data && data.recentEvents.map(event => {
                                const path = event.courses[0].mapPath
                                const thumbPath = path.slice(0, 7) + 'thumb_' + path.slice(7)
                                return (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={event._id}>
                                        <Card
                                            redirectTo={`/event/${event._id}`}
                                            image={'/api/' + thumbPath}
                                            name={event.name}
                                        />
                                    </Grid>
                                )
                            })}
                        </Grid>
                        <Typography variant='h4'>Top users</Typography>
                        <Grid container spacing={16}>
                            {data && data.topUsers.map(user => {
                                return (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                                        <Typography variant='h6' component={Link} to={'/user/' + user._id}>{user.name}</Typography>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </>
                )
            }}
        </Query>
    </Layout>
