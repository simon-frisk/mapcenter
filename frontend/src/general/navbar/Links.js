import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import MaterialIcon from 'material-icons-react'

const Links = styled.div`
    display: flex;
    align-items: center;
    #icon {
        @media (min-width: 801px) {
            display: none;
        }
    }
    *:hover {
        background-color: ${props => props.theme.primaryDark}
    }
`

const LinkItem = styled(Link)`
    color: white;
    text-decoration: none;
    margin: 0 10px;
    height: 70px;
    padding: 0 8px;
    line-height: 70px;
    @media (max-width: 800px) {
        display: none;
    }
`

const Menu = styled.div`
    background-color: ${props => props.theme.primary}
    position: absolute;
    top: 70px;
    border-top: 1px solid ${props => props.theme.secondary};
    left: 0;
    width: 100%;
    z-index: 10;
    box-shadow: 0 5px 20px 0 grey;
`

const MenuItem = styled(Link)`
    display: block;
    color: white;
    text-decoration: none;
    padding: 15px;
    margin: 0;
    :hover {
        background-color: ${props => props.theme.primaryDark}
    }
`

export default ({ context }) => {
    const [menu, setMenu] = useState(false)

    return (
        <>
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
                <div onClick={() => setMenu(!menu)}>
                    <MaterialIcon 
                        icon='menu' size='medium' color='white' id='icon'
                    />
                </div>
            </Links>
            {menu &&
                <Menu>
                    <MenuItem to='/dashboard'>Dashboard</MenuItem>
                    <MenuItem to='/createevent'>Create Event</MenuItem>
                    <MenuItem to={`/user/${context.user}`}>My profile</MenuItem>
                </Menu>
            }
        </>
    )
}