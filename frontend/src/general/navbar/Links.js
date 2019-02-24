import React from 'react'
import styled from 'styled-components'
import Menu from '@material-ui/icons/Menu'
import { Link } from 'react-router-dom'

export default ({ context, toggleMenu }) => 
    <Links>
        {context.user ?
            <>
                <LinkItem to='/dashboard'>Dashboard</LinkItem>
                <LinkItem to='/createevent'>Create Event</LinkItem>
                <LinkItem to={`/user/${context.user}`}>My profile</LinkItem>
            </>
            :
            <>
                <LinkItem to='/signin'>Sign in</LinkItem>
                <LinkItem to='/signup'>Sign up</LinkItem>
            </>
        }
        <Icon onClick={toggleMenu}>
            <Menu />
        </Icon>
    </Links>

const Links = styled.div`
    display: flex;
    margin: 0 30px;
    align-items: center;
    & > * {
        height: 60px;
        line-height: 60px;
    }
`

const LinkItem = styled(Link)`
    color: white;
    text-decoration: none;
    padding: 0 10px;
    @media (max-width: 800px) {
        display: none;
    }
    :hover {
        background-color: ${props => props.theme.primaryDark}
    }
`

const Icon = styled.span`
    @media (min-width: 801px) {
        display: none;
    }
`