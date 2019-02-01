import React, { useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import PrivateRoute from './Components/Util/PrivateRoute'
import Publicroute from './Components/Util/Publicroute'
import jwtDecode from 'jwt-decode'
import CssBaseline from '@material-ui/core/CssBaseline'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import Context from './Context'
import theme from './theme'
import Navbar from './Components/Layout/Navbar'
import Loading from './Components/Presentation/Loading'

export default () => {
    const [decodedToken, setDecodedToken] = useState()

    function setAuthUser(token) {
        localStorage.setItem('token', token)
        try {
            setDecodedToken(jwtDecode(token))
        } catch(error) {
            setDecodedToken(null)
        }
    }
    useEffect(() => {
        const token = localStorage.getItem('token')
        setAuthUser(token)
    }, [])

    if(decodedToken === undefined) return ''

    return (
        <BrowserRouter>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Context.Provider value={{user: decodedToken ? decodedToken.userId : null, setAuthUser}}>
                    <Navbar />
                    <Suspense fallback={<Loading />}>
                        <Switch>
                            <Publicroute exact path='/' 
                                component={lazy(() => import('./routes/publicroutes/Home'))}
                            />
                            <Publicroute exact path='/signin' 
                                component={lazy(() => import('./routes/publicroutes/Signin'))} 
                            />
                            <Publicroute exact path='/signup' 
                                component={lazy(() => import('./routes/publicroutes/Signup'))} 
                            />
                            <PrivateRoute exact path='/user/:id' 
                                component={lazy(() => import('./routes/privateroutes/User'))} 
                            />
                            <PrivateRoute exact path='/explore' 
                                component={lazy(() => import('./routes/privateroutes/Explore'))} 
                            />
                            <PrivateRoute exact path='/createevent' 
                                component={lazy(() => import('./routes/privateroutes/CreateEvent'))} 
                            />
                            <PrivateRoute exact path='/event/:id' 
                                component={lazy(() => import('./routes/privateroutes/Event'))} 
                            />
                            <PrivateRoute exact path='/map/:eventId/:courseId' 
                                component={lazy(() => import('./routes/privateroutes/Course'))} 
                            />
                            <PrivateRoute exact path='/map/:eventId/:courseId/add' 
                                component={lazy(() => import('./routes/privateroutes/AddGps'))} 
                            />
                        </Switch>
                    </Suspense>
                </Context.Provider>
            </MuiThemeProvider>
        </BrowserRouter>
    )
}