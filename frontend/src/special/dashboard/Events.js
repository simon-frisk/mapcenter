import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Card from '../../general/Card'

export default ({ data }) =>
    <>
        <Typography variant='h4'>Recent events</Typography>
        <Grid container spacing={16}>
            {data && data.recentEvents.map(event => {
                const path = event.courses[0].mapPath
                const thumbPath = path.slice(0, 7) + 'thumb_' + path.slice(7)
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={event._id}>
                        <Card
                            redirectTo={`/event/${event._id}`}
                            image={'/api/' + thumbPath}
                            name={event.name}
                        />
                    </Grid>
                )
            })}
        </Grid>
    </>