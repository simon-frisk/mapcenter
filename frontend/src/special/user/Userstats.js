import React from 'react'
import DirectionsRun from '@material-ui/icons/DirectionsRun'
import SupervisorAccount from '@material-ui/icons/SupervisorAccount'
import Typography from '@material-ui/core/Typography'
import Level from '../../general/Level'

export default ({ user }) =>
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