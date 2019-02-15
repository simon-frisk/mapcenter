import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

export default createMuiTheme({
    palette: {
        primary: {
            main: '#424444',
        },
        secondary: {
            main: '#FFC107'
        }
    },
    typography: {
        useNextVariants: true,
    }
})

export const theme = {
    primary: '#424444',
    primaryDark: '#212222',
    secondary: '#FFC107'
}