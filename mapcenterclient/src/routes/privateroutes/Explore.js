import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '../../Components/Presentation/Card'
import Layout from '../../Components/Layout/Layout'
import Loading from '../../Components/Presentation/Loading'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const RECENTEVENTSQUERY = gql`
    {
        recentEvents(courses: [0]) {
            name
            _id
            courses {
                mapPath
            }
        }
    }
`

export default () => 
    <Layout>
        <Query query={RECENTEVENTSQUERY} fetchPolicy='cache-and-network'>
            {({loading, error, data}) => {
                if(loading)
                    return <Loading />
                if(error)
                    return 'error'
                const { recentEvents } = data
                return (
                    <>
                        <Typography variant='h5'>Recent events</Typography>
                        <Grid container spacing={16}>
                            {recentEvents.map(event => {
                                const path = event.courses[0].mapPath
                                const thumbPath = path.slice(0, 7) + 'thumb_' + path.slice(7)
                                return <Grid item xs={12} sm={6} md={4} lg={3} key={event._id}>
                                    <Card
                                        redirectTo={`/event/${event._id}`}
                                        image={process.env.REACT_APP_API_URL + thumbPath}
                                        name={event.name}
                                    />
                                </Grid>
                            })}
                        </Grid>
                    </>
                )
            }}
        </Query>
    </Layout>
