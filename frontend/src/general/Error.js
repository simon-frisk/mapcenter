import React from 'react'
import Error from '@material-ui/icons/Error'

export default () =>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <Error
            style={{ width: '60px', height: '60px'}}
            color='secondary'
        />
        <h6 style={{ fontSize: '20px', margin: '10px' }}>
            An error occured
        </h6>
    </div>