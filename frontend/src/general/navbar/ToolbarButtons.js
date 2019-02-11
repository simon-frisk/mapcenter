import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'

export default ({ user }) => 
    <>
        {user ?
            <>
                <Button color='inherit' component={Link} to='/dashboard'>
                    Dashboard
                </Button>
                <Button color='inherit' component={Link} to='/createevent'>
                    Create event
                </Button>
                <Button color='inherit' component={Link} to={`/user/${user}`}>
                    My profile
                </Button>
            </>
        :
            <>
                <Button color='inherit' component={Link} to='/signin'>
                    Sign in
                </Button>
                <Button color='secondary' variant='outlined' component={Link} to='/signup'>
                    Sign up
                </Button>
            </>
        }
    </>