import React, { useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import CssBaseline from '@material-ui/core/CssBaseline'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import PrivateRoute from './PrivateRoute'
import Publicroute from './Publicroute'
import Context from './Context'
import theme from './theme'
import Navbar from '../layout/Navbar'
import Loading from '../view/Loading'

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
                                component={lazy(() => import('../social/Home'))}
                            />
                            <Publicroute exact path='/signin' 
                                component={lazy(() => import('../social/Signin'))} 
                            />
                            <Publicroute exact path='/signup' 
                                component={lazy(() => import('../social/Signup'))} 
                            />
                            <PrivateRoute exact path='/user/:id' 
                                component={lazy(() => import('../social/User'))} 
                            />
                            <PrivateRoute exact path='/explore' 
                                component={lazy(() => import('../social/Explore'))} 
                            />
                            <PrivateRoute exact path='/createevent' 
                                component={lazy(() => import('../map/CreateEvent'))} 
                            />
                            <PrivateRoute exact path='/event/:id' 
                                component={lazy(() => import('../social/Event'))} 
                            />
                            <PrivateRoute exact path='/map/:eventId/:courseId' 
                                component={lazy(() => import('../map/Course'))} 
                            />
                            <PrivateRoute exact path='/map/:eventId/:courseId/add' 
                                component={lazy(() => import('../map/AddGps'))} 
                            />
                        </Switch>
                    </Suspense>
                </Context.Provider>
            </MuiThemeProvider>
        </BrowserRouter>
    )
}