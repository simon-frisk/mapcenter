import React from 'react'
import styled from 'styled-components'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ChangeProfilepicure from './ChangeProfilepicure'
import DirectionsRun from '@material-ui/icons/DirectionsRun'
import Level from '../../general/Level'
import Userlist from './Userlist'
import Profilepicture from '../../general/Profilepicture'

export default ({ user, context, children }) =>
    <Container>
        <Typography variant='h4'>{ user.name }</Typography>
        {context.user === user._id 
            ? <ChangeProfilepicure user={user} />
            : <Profilepicture user={user} size={100} />
        }
        <Row>
            <Button variant='outlined'>
                <Userlist users={user.followers} mode={'Followers'} />
            </Button>
            <Button variant='outlined'>
                <Userlist users={user.following} mode={'Following'} />
            </Button>
        </Row>
        <Row>
            { children }
        </Row>
        <Level>
            <DirectionsRun />
            <Typography variant='h6'>
                {user.name.split(' ')[0]} has run {user.courses.length} course{!(user.courses.length === 1) ? 's' : ''}
            </Typography>
        </Level>
    </Container>

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5%;
    > * {
        margin-bottom: 10px;
    }
`

const Row = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
`