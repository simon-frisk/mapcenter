import React from 'react'
import ReactDOM from 'react-dom'
import App from './super/App'
import './super/index.css'
import * as serviceWorker from './super/serviceWorker'
import Client from './super/Apollo'
import { ApolloProvider } from 'react-apollo'

const Element = () => (
    <ApolloProvider client={Client}>
        <App />
    </ApolloProvider>
)

ReactDOM.render(<Element />, document.getElementById('root'))

serviceWorker.register()