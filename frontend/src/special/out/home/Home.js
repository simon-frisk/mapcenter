import React from 'react'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Hero from '../../../general/Hero'
import background from '../bg.png'
import stravacompatible from './stravacompatible.png'

const styles = {
    heroText: {
        color: 'white'
    },
    infogrid: {
        padding: '7%',
        paddingTop: '45px',
        maxWidth: '100%'
    },
    footer: {
        display: 'flex',
        padding: '2%',
        justifyContent: 'center',
        maxWidth: '100%',
        overflow: 'hidden'
    }
}

export default () => (
    <>
        <Hero background={background}>
            <Typography variant='h3' style={styles.heroText}>Welcome to {process.env.REACT_APP_APP_NAME}, a network connecting orienteering</Typography>
            <Button variant='outlined' color='secondary' component={Link} to='/signup'>Get started!</Button>
        </Hero>
        <Grid container style={styles.infogrid} spacing={40}>
            <Grid item xs={12} md={6}>
                <Typography variant='h4'>Network</Typography>
                <Typography variant='h6'>
                    {process.env.REACT_APP_APP_NAME} was created with one vision in mind: to connect the world's orienteers and map lovers and to help them share their orienteering adventures to enjoy them together
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography variant='h4'>Analyze</Typography>
                <Typography variant='h6'>
                    {process.env.REACT_APP_APP_NAME} helps you become a better orienteer by providing everything needed to improve technically: fully fledged anylyze tools and other people to discuss orienteering with
                </Typography>
            </Grid>
        </Grid>
        <div style={styles.footer} className='primaryBackground'>
            <img src={stravacompatible} alt='compatible with strava' />
        </div>
    </>
)