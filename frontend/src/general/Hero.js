import React from 'react'
import Grid from '@material-ui/core/Grid'

export default function(props) {
    return (
        <Grid
            container
            justify='center'
            alignItems='center'
            style={{height: '80vh', backgroundImage: `url(${props.background})`, backgroundSize: 'cover'}}
        >
            <Grid item xs={10} sm={8} md={5}>
                {props.children}
            </Grid>
        </Grid>
    )
}
