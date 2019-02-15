import React, { useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Switch, Redirect } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import CssBaseline from '@material-ui/core/CssBaseline'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import { ThemeProvider } from 'styled-components'
import { theme } from './theme'
import PrivateRoute from './PrivateRoute'
import Publicroute from './Publicroute'
import Context from './Context'
import muitheme from './theme'
import Navbar from '../general/navbar/Navbar'
import Loading from '../general/Loading'
import Errorboundary from './Errorboundary'
import Client from './Apollo'

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
            <ThemeProvider theme={theme}>
            <MuiThemeProvider theme={muitheme}>
                <CssBaseline />
                <Context.Provider value={{
                    user: decodedToken ? decodedToken.userId : null,
                    setAuthUser,
                    apolloClient: Client
                }}>
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
                                <PrivateRoute exact path='/dashboard' 
                                    component={lazy(() => import('../special/dashboard/Dashboard'))} 
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
            </ThemeProvider>
        </BrowserRouter>
    )
}