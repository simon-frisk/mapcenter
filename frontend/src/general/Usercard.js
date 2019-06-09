import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import Level from './Level'
import Profilepicture from './Profilepicture'

export default withRouter(({ history, user }) =>
    <Card onClick={() => history.push(`/user/${user._id}`)}>
        <Level>
            <Profilepicture user={user} size={50} />
            <h3>{ user.name }</h3>
        </Level>
    </Card>
)

const Card = styled.div`
    padding: 10px;
    box-shadow: 0 1px 5px 0 grey;  
    border-radius: 5px;
    overflow: hidden;  
    font-size: 20px;
    width: ${({ width }) => width ? width : '50vh'};
    max-width: 350px;
    h3 {
        padding: 15px;
        margin: 0px;
    }
    :hover {
        background-color: #DDD;
    }
`