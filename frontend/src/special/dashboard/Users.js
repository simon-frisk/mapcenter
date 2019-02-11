import React from 'react'
import { Link } from 'react-router-dom'
import MuiCard from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

export default ({ data }) => 
    <div style={{ marginTop: '20px' }}>
        <Typography variant='h4'>Users</Typography>
        <Grid container spacing={16}>
            {data && data.topUsers.map(user => {
                return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={user._id}>
                        <MuiCard>
                            <CardActionArea component={Link} to={'/user/' + user._id}>
                                <CardContent>
                                    <Typography variant='h6'>
                                        { user.name }
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </MuiCard>
                    </Grid>
                )
            })}
        </Grid>
    </div>