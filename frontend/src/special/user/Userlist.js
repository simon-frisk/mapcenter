import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SupervisorAccount from '@material-ui/icons/SupervisorAccount'
import Modal from '@material-ui/core/Modal'
import Modalbody from '../../general/Modalbody'
import Typography from '@material-ui/core/Typography'
import Level from '../../general/Level'

export default ({ users, mode }) => {
    const [ open, setOpen ] = useState(false)

    return (
        <Level onClick={e => {
            if(e.currentTarget === e.target)
                setOpen(true)
        }}>
            <SupervisorAccount />
            {users.length} {' ' + mode.toLowerCase()}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Modalbody>
                    <Typography variant='h3'>{mode}</Typography>
                    {users.map(user => 
                        <Typography 
                            key={user._id} 
                            variant='h5'
                            component={Link}
                            to={'/user/' + user._id}
                            onClick={() => setOpen(false)}
                        >{user.name}</Typography>
                    )}
                </Modalbody>
            </Modal>
        </Level>
    )
}