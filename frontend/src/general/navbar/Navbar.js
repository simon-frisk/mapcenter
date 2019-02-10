import React from 'react'
import { Link } from 'react-router-dom'
import Context from '../../super/Context'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Hidden from '@material-ui/core/Hidden'
import ToolbarButtons from './ToolbarButtons'
import Menu from './Menu'

export default () => {
    const context = React.useContext(Context)
    const [menuAnchor, setMenuAnchor] = React.useState(null)

    return (
        <AppBar color='primary' position='static'>
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
                    <ToolbarButtons user={context.user} />
                </Hidden>
                <Hidden smUp>
                    <IconButton color='inherit' onClick={e => setMenuAnchor(e.currentTarget)}>
                        <MenuIcon />
                    </IconButton>
                </Hidden>

                <Menu user={context.user} menuAnchor={menuAnchor} setMenuAnchor={setMenuAnchor} />
            </ToolBar>
        </AppBar>
    )
}
