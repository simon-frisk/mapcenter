import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid'

export default function() {
    return (
        <Grid
            container
            justify='center'
            alignItems='center'
            width='100%'
            height='100%'
        >
            <Grid item>
                <CircularProgress style={{marginTop: '20px'}} />
            </Grid>
        </Grid>
    )
}