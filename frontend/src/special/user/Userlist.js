import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import SupervisorAccount from '@material-ui/icons/SupervisorAccount'
import Modal from '@material-ui/core/Modal'
import styled from 'styled-components'
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
                <ModalBody>
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
                </ModalBody>
            </Modal>
        </Level>
    )
}

const ModalBody = styled.div`
    background-color: white;
    border-radius: 8px;
    width: 80%;
    outline: none;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    padding: 20px;
    max-width: 600px;
    margin: 30px auto;
    min-height: 200px;
`