import React, { useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Switch, Redirect } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import CssBaseline from '@material-ui/core/CssBaseline'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import PrivateRoute from './PrivateRoute'
import Publicroute from './Publicroute'
import Context from './Context'
import theme from './theme'
import Navbar from '../general/navbar/Navbar'
import Loading from '../general/Loading'
import Errorboundary from './Errorboundary'

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
                    <Errorboundary>
                        <Suspense fallback={<Loading />}>
                            <Switch>
                                <Publicroute exact path='/' 
                                    component={lazy(() => import('../special/out/home/Home'))}
                                />
                                <Publicroute exact path='/signin' 
                                    component={lazy(() => import('../special/out/auth/Signin'))} 
                                />
                                <Publicroute exact path='/signup' 
                                    component={lazy(() => import('../special/out/auth/Signup'))} 
                                />
                                <PrivateRoute exact path='/user/:id' 
                                    component={lazy(() => import('../special/user/User'))} 
                                />
                                <PrivateRoute exact path='/explore' 
                                    component={lazy(() => import('../special/explore/Explore'))} 
                                />
                                <PrivateRoute exact path='/createevent' 
                                    component={lazy(() => import('../special/map/CreateEvent'))} 
                                />
                                <PrivateRoute exact path='/event/:id' 
                                    component={lazy(() => import('../special/event/Event'))} 
                                />
                                <PrivateRoute exact path='/map/:eventId/:courseId' 
                                    component={lazy(() => import('../special/map/Course'))} 
                                />
                                <PrivateRoute exact path='/map/:eventId/:courseId/add' 
                                    component={lazy(() => import('../special/map/AddGps'))} 
                                />
                                <Redirect to='/' />
                            </Switch>
                        </Suspense>
                    </Errorboundary>
                </Context.Provider>
            </MuiThemeProvider>
        </BrowserRouter>
    )
}