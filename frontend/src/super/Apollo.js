import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { setContext } from 'apollo-link-context'
import { ApolloLink } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'

export default new ApolloClient({
    link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
            if(graphQLErrors) {
                graphQLErrors.forEach(({ message }) => {
                    console.log('Graphql error: ' + message)
                })
            }
            if(networkError)
                console.log('Network error: ' + networkError)
        }),
        setContext((_, { headers }) => {
            const token = localStorage.getItem('token')
            return {
                headers: {
                    ...headers,
                    Authorization: token ? `Bearer ${token}` : ''
                }
            }
        }),
        new createUploadLink({
            uri: '/api/graphql'
        }),
        new HttpLink({
            uri: '/api/graphql'
        }),
    ]),
    cache: new InMemoryCache()
})