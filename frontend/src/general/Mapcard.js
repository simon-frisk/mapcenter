import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

export default withRouter(({ history, redirectTo, image, name, width }) =>
    <Card onClick={() => history.push(redirectTo)} width={width}>
        <img src={image} alt='map' />
        <h3>{ name }</h3>
    </Card>
)

const Card = styled.div`
    box-shadow: 0 1px 5px 0 grey;  
    border-radius: 5px;
    overflow: hidden;  
    font-size: 20px;
    width: ${({ width }) => width ? width : '50vh'};
    max-width: 350px;
    img {
        object-fit: cover;
        height: 25vh;
        width: 100%;
    }
    h3 {
        padding: 15px;
        margin: 0px;
    }
    :hover {
        background-color: #DDD;
    }
`