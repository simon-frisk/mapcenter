import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Modal from '@material-ui/core/Modal'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Modalbody from '../../general/Modalbody'
import Float from '../../general/Float'
import Profilepicture from '../../general/Profilepicture'

const mutation = gql`
    mutation ChangeProfilePicture($file: Upload!) {
        uploadProfilePicture(file: $file)
    }
`

export default ({ user }) => {
    const [ editModal, setEditModal ] = useState(false)
    const [ newImage, setNewImage ] = useState()

    return (
        <Mutation mutation={mutation}>
            {( mutate, { loading, called, client }) => {
                if(!loading && called) {
                    client.resetStore()
                    setEditModal(false)
                }
                return (
                    <>
                        <Profilepicture user={user} size={100} onClick={() => setEditModal(true)} />
                        <Modal open={editModal} onClose={() => setEditModal(false)}>
                            <Modalbody>
                                <Typography variant='h3'>Change profile picture</Typography>
                                <input 
                                    type='file' id='fileinput' 
                                    style={{ display: 'none' }}
                                    onChange={e => setNewImage(e.target.files[0])}
                                />
                                <Float style={{ marginTop: '60px' }}>
                                    <Button 
                                        onClick={() => document.getElementById('fileinput').click()}
                                        variant='outlined'
                                        color='secondary'
                                    >
                                        Select file
                                    </Button>
                                    <Typography variant='subtitle2'>
                                        {newImage && newImage.name}
                                    </Typography>
                                    <Button
                                        variant='outlined'
                                        color='secondary'
                                        disabled={loading}
                                        onClick={() => { mutate({ variables: { file: newImage }})}}
                                    >Change profile picture</Button>
                                </Float>
                            </Modalbody>
                        </Modal>
                    </>
                )
            }}
        </Mutation>
    )
}