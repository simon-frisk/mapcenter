import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Context from '../../super/Context'
import Links from './Links'
import Menu from './Menu'

export default () => {
    const context = React.useContext(Context)
    const [menu, setMenu] = React.useState(false)

    React.useEffect(() => {
        function onResize() {
            setMenu(false)
        }
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    })

    return (
        <Appbar>
            <Navbar>
                <Header to='/'>{ process.env.REACT_APP_APP_NAME }</Header>
                <Links context={context} toggleMenu={() => setMenu(!menu)} />
            </Navbar>
            <Menu menu={menu} context={context} toggleMenu={() => setMenu(!menu)} />
        </Appbar>
    )
}

const Appbar = styled.div`
    background-color: ${ props => props.theme.primary }
    color: white;
    box-shadow: 0 5px 20px 0 grey;
`

const Navbar = styled.div`
    display: flex;
    justify-content: space-between;
    height: 60px;
`

const Header = styled(Link)`
    text-decoration: none;
    color: white;
    font-size: 30px;
    padding: 0 30px;
    height: 60px;
    line-height: 60px;
`