import React, {useContext} from 'react'
import {Route, Redirect} from 'react-router-dom'
import Context from './Context'

export default ({component: Component, ...rest}) => {
    const context = useContext(Context)
    return (
        <Route {...rest} render={props => (
            !context.user
            ? <Component {...props} />
            : <Redirect to='/explore' />
        )} />
    )
}