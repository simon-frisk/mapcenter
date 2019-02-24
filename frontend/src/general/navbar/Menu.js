import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

export default ({ menu, context, toggleMenu }) =>
    <Menu menu={menu}>
        {context.user ?
            <>
                <LinkItem onClick={toggleMenu} to='/dashboard'>Dashboard</LinkItem>
                <LinkItem onClick={toggleMenu} to='/createevent'>Create Event</LinkItem>
                <LinkItem onClick={toggleMenu} to={`/user/${context.user}`}>My profile</LinkItem>
            </>
            :
            <>
                <LinkItem onClick={toggleMenu} to='/signin'>Sign in</LinkItem>
                <LinkItem onClick={toggleMenu} to='/signup'>Sign up</LinkItem>
            </>
        }
    </Menu>

const Menu = styled.div`
    height: ${({ menu }) => menu ? '' : 0};
    overflow: hidden;
    transition: height .5s;
`

const LinkItem = styled(Link)`
    display: block;
    color: white;
    text-decoration: none;
    padding: 15px;
    :hover {
        background-color: ${props => props.theme.primaryDark}
    }
`