import React from 'react'
import Avatar from '@material-ui/core/Avatar'

export default ({ user, size, onClick }) => {
    return user.profilePicturePath ?
            <Avatar 
                src={'/api/' + user.profilePicturePath}
                style={{ width: size + 'px', height: size + 'px'}}
                onClick={onClick}
            />
        :
            <Avatar 
                style={{ width: size + 'px', height: size + 'px' }}
                onClick={onClick}
            >
                {user.name.split(' ').map(name => name.charAt(0)).join('')}
            </Avatar>
}