import React, { useContext } from 'react'
import { Link, Redirect } from 'react-router-dom'
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Context from '../super/Context'
import Loading from '../view/Loading'
import Layout from '../layout/Layout'
import MyCard from '../view/Card'

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

const DELETEMUTATION = gql`
    mutation DeleteEvent($id: ID!) {
        deleteEvent(id: $id)
    }
`

export default props => {
    const context = useContext(Context)

    return (
        <Layout>
            <Query 
                query={QUERY} 
                variables={{id: props.match.params.id}}
            >
                {({loading, error, data}) => {
                    if(loading)
                        return <Loading />
                    if(error)
                        return '...error' + error.message
                    const { event } = data
                    const users = event.courses.reduce((users, course) => {
                        const courseUsers = course.userRecordings.map(userRecording => ({
                            name: userRecording.user.name,
                            _id: userRecording.user._id
                        }))
                        courseUsers.forEach(user => {
                            if(users.map(user => user.name).indexOf(user.name) < 0)
                                users.push(user)
                        })
                        return users
                    }, [])
                    return (
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <div>
                                            <Typography variant='h3'>{event.name}</Typography>
                                            <Typography variant='h6'>
                                                <Level>
                                                    <SupervisedUserCircle />
                                                        {`${users.length} user${users.length === 1 ? '' : 's'} participated in this event`}
                                                </Level>
                                                <Level>
                                                    <AccountCircle />Created by&#160;
                                                    <Link
                                                        to={`/user/${event.adminUser._id}`}
                                                        style={{color: 'black'}}
                                                    >{event.adminUser.name}</Link>
                                                </Level>
                                                {event.adminUser._id === context.user &&
                                                    <Mutation mutation={DELETEMUTATION}>
                                                        {(mutate, {called, client, loading}) => {
                                                            if(loading) return <Loading />
                                                            if(!loading && called) {
                                                                client.resetStore()
                                                                return <Redirect to='/' />
                                                            }
                                                            return (
                                                                <Button
                                                                    variant='contained'
                                                                    onClick={() => {
                                                                        mutate({variables: {id: props.match.params.id}})
                                                                    }}
                                                                >Delete event</Button>
                                                            )
                                                        }}
                                                    </Mutation>
                                                }
                                            </Typography>
                                        </div>
                                    </Grid>
                                    { event.overviewMapPath &&
                                        <Grid item xs={12} md={6}>
                                            <OverviewImage src={'/api/' + event.overviewMapPath} alt='overview' />
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                            {event.courses.map((course, index) => {
                                const path = course.mapPath
                                const thumbPath = path.slice(0, 7) + 'thumb_' + path.slice(7)
                                return <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <MyCard
                                        redirectTo={`/map/${props.match.params.id}/${course._id}`}
                                        image={'/api/' + thumbPath}
                                        name={course.name}
                                    />
                                </Grid>
                            })}
                        </Grid>
                    )
                }}
            </Query>
        </Layout>
    )
}

const OverviewImage = styled.img`
    width: 100%;
    max-height: 50vh;
    object-fit: contain;
`

const Level = styled.div`
    display: flex;
    align-items: center;
`