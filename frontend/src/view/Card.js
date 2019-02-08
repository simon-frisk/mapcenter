import React from 'react'
import {withRouter} from 'react-router-dom'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'

const styles = {
    image: {
        objectFit: 'cover',
        height: 25 + 'vh'
    }
}

export default withRouter(props =>
    <Card onClick={() => props.history.push(props.redirectTo)}>
        <CardActionArea>
            <CardMedia
                component='img'
                alt='map'
                src={props.image}
                style={styles.image}
            />
            <CardContent>
                <Typography variant='h6'>
                    {props.name}
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
)