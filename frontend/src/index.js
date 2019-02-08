import React from 'react'
import ReactDOM from 'react-dom'
import App from './super/App'
import './super/index.css'
import * as serviceWorker from './super/serviceWorker'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

const client = new ApolloClient({
    uri: '/api/graphql',
    async request(operation) {
        const token = localStorage.getItem('token')
        operation.setContext({
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            }
        })
    }
})

const Element = () => (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)

ReactDOM.render(<Element />, document.getElementById('root'))

serviceWorker.register()