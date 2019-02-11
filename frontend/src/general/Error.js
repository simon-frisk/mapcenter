import React from 'react'
import Error from '@material-ui/icons/Error'
import Typography from '@material-ui/core/Typography'

export default () =>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <Error
            style={{ width: '60px', height: '60px'}}
            color='secondary'
        />
        <Typography variant='h6'>
            An error occured
        </Typography>
    </div>