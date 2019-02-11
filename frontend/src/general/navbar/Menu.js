import React from 'react'
import { Link } from 'react-router-dom'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

export default ({ user, menuAnchor, setMenuAnchor }) =>
    <>
        {user ?
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={setMenuAnchor.bind(null, null)}>
                <MenuItem
                    onClick={setMenuAnchor.bind(null, null)} component={Link} to={`/user/${user}`}>
                    My profile
                </MenuItem>
                <MenuItem
                    onClick={setMenuAnchor.bind(null, null)} component={Link} to='/dashboard'>
                    Dashboard
                </MenuItem>
                <MenuItem
                    onClick={setMenuAnchor.bind(null, null)} component={Link} to='/createevent'>
                    Create event
                </MenuItem>
            </Menu>
        :
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={setMenuAnchor.bind(null, null)}>
                <MenuItem component={Link} to='/signin'>
                    Sign in
                </MenuItem>
                <MenuItem component={Link} to='/signup'>
                    Sign up
                </MenuItem>
            </Menu>
        }
    </>