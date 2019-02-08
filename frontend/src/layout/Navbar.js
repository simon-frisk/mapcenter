import React from 'react'
import {Link} from 'react-router-dom'
import Context from '../super/Context'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'

export default () => {
    const context = React.useContext(Context)
    const [menuAnchor, setMenuAnchor] = React.useState(null)

    return (
        <AppBar color='primary' position='static' >
            <ToolBar>
                <Typography
                    variant='h5'
                    color='inherit'
                    component={Link}
                    to='/'
                    style={{textDecoration: 'none', flexGrow: 1}}
                >
                    {process.env.REACT_APP_APP_NAME}
                </Typography>
                <Hidden xsDown>
                    {context.user ?
                        <>
                            <Button color='inherit' component={Link} to='/explore'>
                                Explore
                            </Button>
                            <Button color='inherit' component={Link} to='/createevent'>
                                Create event
                            </Button>
                            <Button color='inherit' component={Link} to={`/user/${context.user}`}>
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
                </Hidden>
                <Hidden smUp>
                    <IconButton color='inherit' onClick={e => setMenuAnchor(e.currentTarget)}>
                        <MenuIcon />
                    </IconButton>
                </Hidden>

                {context.user ?
                    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={setMenuAnchor.bind(null, null)}>
                        <MenuItem
                            onClick={setMenuAnchor.bind(null, null)} component={Link} to={`/user/${context.user}`}>
                            My profile
                        </MenuItem>
                        <MenuItem
                            onClick={setMenuAnchor.bind(null, null)} component={Link} to='/explore'>
                            Explore
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
            </ToolBar>
        </AppBar>
    )
}
