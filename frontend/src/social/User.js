import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import DirectionsRun from '@material-ui/icons/DirectionsRun'
import SupervisorAccount from '@material-ui/icons/SupervisorAccount'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import styled from 'styled-components'
import Card from '../view/Card'
import Loading from '../view/Loading'
import Float from '../view/Float'
import Level from '../view/Level'
import Layout from '../layout/Layout'
import Context from '../super/Context'

const GETUSERQUERY = gql`
    query GetUserQuery($id: ID!) {
        user(id: $id) {
            name
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
                _id
            }
            following {
                _id
            }
        }
    }
`

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

export default withRouter(props => {
    const context = useContext(Context)
    
    return (
        <Layout>
            <Query
                query={GETUSERQUERY}
                variables={{id: props.match.params.id}}
            >
                {({client, loading, error, data}) => {
                    if(loading)
                        return <Loading />
                    if(error)
                        return 'Could not load user'
                    const { user } = data
                    const following = user.followers.map(user => user._id).includes(context.user)
                    return (
                        <>
                            <TopPanel>
                                <Float>
                                    <Typography variant='h3'>{user.name}</Typography>
                                    {
                                        context.user === props.match.params.id ?
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
                                                    id: props.match.params.id
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
                                </Float>
                                <UserStats user={user} />
                            </TopPanel>
                            <RecentEvents user={user} />
                        </>
                    )
                }}
            </Query>
        </Layout>
    )
})

const RecentEvents = ({ user }) =>
<>
{user.courses.length > 0 && <Typography variant='h5'>Recent maps</Typography>}
        <Grid container spacing={16}>
            {
                user.courses.map(course => {
                    const thumbPath = course.mapPath.slice(0, 7) + 'thumb_' + course.mapPath.slice(7)
                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                            <Card 
                                name={`${course.event.name} - ${course.name}`}
                                image={'/api/' + thumbPath}
                                redirectTo={`/map/${course.event._id}/${course._id}`}
                                />
                        </Grid>
                    )
                })
            }
        </Grid>
    </>
    
const UserStats = ({ user }) =>
    <>
        <Typography variant='h6'>
            <Level>
                <DirectionsRun />{user.name.split(' ')[0]} has run {user.courses.length} course{!(user.courses.length === 1) ? 's' : ''}
            </Level>
        </Typography>
        <Typography variant='h6'>
            <Level>
                <SupervisorAccount /> {user.followers.length} followers
            </Level>
        </Typography>
        <Typography variant='h6'>
            <Level>
                <SupervisorAccount /> {user.following.length} following
            </Level>
        </Typography>
    </>

const TopPanel = styled.div`
    height: 40vh;
`