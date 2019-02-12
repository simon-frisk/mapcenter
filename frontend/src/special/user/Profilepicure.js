import React, { useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Modalbody from '../../general/Modalbody'
import Float from '../../general/Float'

export default ({ path, text }) => {
    const [ editModal, setEditModal ] = useState(false)

    return (
        <>
            <Avatar 
                src={path} 
                style={{ width: '70px', height: '70px' }} 
                onClick={() => setEditModal(true)}
            >
                {!path && text}
            </Avatar>
            <Modal open={editModal} onClose={() => setEditModal(false)}>
                <Modalbody>
                    <Typography variant='h3'>Change profile picture</Typography>
                    <input type='file' id='fileinput' style={{ display: 'none' }} />
                    <Float style={{ marginTop: '60px' }}>
                        <Button 
                            onClick={() => document.getElementById('fileinput').click()}
                            variant='outlined'
                            color='secondary'
                        >
                            Select file
                        </Button>
                        <Button
                            variant='outlined'
                            color='secondary'
                        >Change profile picture</Button>
                    </Float>
                </Modalbody>
            </Modal>
        </>
    )
}