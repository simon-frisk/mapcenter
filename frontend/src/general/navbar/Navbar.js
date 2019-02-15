import React from 'react'
import { Link } from 'react-router-dom'
import Context from '../../super/Context'
import styled from 'styled-components'
import Links from './Links'

const Navbar = styled.div`
    background-color: ${ props => props.theme.primary }
    color: white;
    display: flex;
    justify-content: space-between;
    box-shadow: 0 5px 20px 0 grey;
    padding: 0 30px;
    height: 70px;
`

const Header = styled(Link)`
    text-decoration: none;
    color: white;
    font-size: 30px;
    height: 70px;
    line-height: 70px;
`

export default () => {
    const context = React.useContext(Context)

    return (
        <Navbar>
            <Header to='/'>{ process.env.REACT_APP_APP_NAME }</Header>
            <Links context={context} />
        </Navbar>
    )
}
