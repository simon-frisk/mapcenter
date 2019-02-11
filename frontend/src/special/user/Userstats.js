import React from 'react'
import DirectionsRun from '@material-ui/icons/DirectionsRun'
import Typography from '@material-ui/core/Typography'
import Level from '../../general/Level'
import Userlist from './Userlist'

export default ({ user }) =>
    <>
        <Typography variant='h6'>
            <Level>
                <DirectionsRun />{user.name.split(' ')[0]} has run {user.courses.length} course{!(user.courses.length === 1) ? 's' : ''}
            </Level>
        </Typography>
        <Typography variant='h6'>
            <Userlist users={user.followers} mode={'Followers'} />
        </Typography>
        <Typography variant='h6'>
            <Userlist users={user.following} mode={'Following'} />
        </Typography>
    </>