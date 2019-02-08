import React, { useState, useContext } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Context from '../super/Context'
import Hero from '../view/Hero'
import background from './bg.png'

const MUTATION = gql`
    mutation SignUp($userInput: UserInput!) {
        createUser(userInput: $userInput)
    }
`

export default function() {
    const context = useContext(Context)
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState(null)

    function onSubmit(signUp, e) {
        e.preventDefault()

        if(!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            setError('Invalid email')
            return
        }

        if(!/^[A-ZÅÄÖ][a-zåäö]+ [A-ZÅÄÖ][a-zåäö]+$/.test(name)) {
            setError('Invalid name')
            return
        }

        if(!/^.{6,}$/.test(password)) {
            setError('Password too short')
            return
        }

        if(password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        signUp()
    }

    return (
        <Hero background={background}>
            <Card>
                <Mutation mutation={MUTATION} variables={{ userInput: {name, email, password}}}>
                    {(signUp, { called, loading, data, error: mutationError }) => {
                        if(called && !loading && !mutationError)
                            context.setAuthUser(data.createUser)
                        return (
                            <form onSubmit={e => onSubmit(signUp, e)}>
                                <CardContent>
                                    <Typography variant='h5'>Sign up</Typography>
                                    <TextField 
                                        label='email' 
                                        fullWidth 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                    <TextField label='name' fullWidth value={name} onChange={e => setName(e.target.value)} />
                                    <TextField label='password' type='password' fullWidth value={password} onChange={e => setPassword(e.target.value)} />
                                    <TextField label='confirm password' type='password' fullWidth value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                    {
                                        (error || mutationError) &&
                                        <Typography color='error' variant='subtitle2'>      
                                            {error || 'could not sign up'}
                                        </Typography>
                                    }
                                </CardContent>
                                <CardActions>
                                    <Button color='secondary' variant='contained' type='submit' disabled={loading}>Sign up</Button>
                                </CardActions>
                            </form>
                        )
                    }}
                </Mutation>
            </Card>
        </Hero>
    )
}
