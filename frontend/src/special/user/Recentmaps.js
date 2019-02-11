import React from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '../../general/Card'
import Typography from '@material-ui/core/Typography'

export default ({ user }) =>
    <>
        {user.courses.length > 0 && <Typography variant='h5'>Recent maps</Typography>}
        <Grid container spacing={16}>
            {user.courses.map(course => {
                const thumbPath = course.mapPath.slice(0, 7) + 'thumb_' + course.mapPath.slice(7)
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                        <Card 
                            name={`${course.event.name} - ${course.name}`}
                            image={'/api/' + thumbPath}
                            redirectTo={`/map/${course.event._id}/${course._id}`}
                            />
                    </Grid>
                )
            })}
        </Grid>
    </>