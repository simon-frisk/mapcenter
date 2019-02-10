import React from 'react'
import Context from '../super/Context'
import gql from 'graphql-tag'
import { ApolloConsumer } from 'react-apollo'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Hero from '../view/Hero'
import background from './bg.png'

const SIGNIN_QUERY = gql`
    query Login($email: String! $password: String!) {
        login(email: $email password: $password)
    }
`

export default function() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const context = React.useContext(Context)

    function onSubmit(apolloClient) {
        return async event => {
            setLoading(true)
            event.preventDefault()
            try {
                const { data } = await apolloClient.query({
                    query: SIGNIN_QUERY,
                    variables: { email, password }
                })
                context.setAuthUser(data.login)
            } catch(error) {
                setLoading(false)
                setError('Failed to log in')
            }
        }
    }

    return (
        <Hero background={background}>
            <ApolloConsumer>
                {client => 
                    <form onSubmit={onSubmit(client)}>
                        <Card>
                            <CardContent>
                                <Typography variant='h5'>Sign in</Typography>
                                <TextField label='email' fullWidth value={email} onChange={e => setEmail(e.target.value)} />
                                <TextField label='password' type='password' fullWidth value={password} onChange={e => setPassword(e.target.value)} />
                                {error && 
                                    <Typography color='error' variant='subtitle2'>
                                        {error}
                                    </Typography>
                                }
                            </CardContent>
                            <CardActions>
                                <Button color='secondary' variant='contained' type='submit' disabled={loading}>Sign in</Button>
                            </CardActions>
                        </Card>
                    </form>
                }
            </ApolloConsumer>
        </Hero>
    )
}