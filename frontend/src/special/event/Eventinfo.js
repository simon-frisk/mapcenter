import React from 'react'
import { Link } from 'react-router-dom'
import SupervisedUserCircle from '@material-ui/icons/SupervisedUserCircle'
import AccountCircle from '@material-ui/icons/AccountCircle'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Delete from './Delete'
import styled from 'styled-components'

export default ({ event, context }) => {
    
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
                        <Delete event={event} context={context} />
                    </Typography>
                </div>
            </Grid>
            { event.overviewMapPath &&
                <Grid item xs={12} md={6}>
                    <OverviewImage src={'/api/' + event.overviewMapPath} alt='overview' />
                </Grid>
            }
        </Grid>
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