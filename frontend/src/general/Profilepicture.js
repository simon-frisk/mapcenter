import React from 'react'
import styled from 'styled-components'

export default ({ user, size, onClick }) => {
    return user.profilePicturePath 
        ? <ImageAvatar src={`/api/${user.profilePicturePath}`} onClick={onClick} size={size} />
        : <TextAvatar size={size}>
            {user.name.split(' ').map(name => name.charAt(0)).join('')}
        </TextAvatar>
}

const ImageAvatar = styled.img`
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    border-radius: 50%;
`

const TextAvatar = styled.span`
    display: inline-block;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    border-radius: 50%;
    background-color: lightgrey;
    text-align: center;
    line-height: ${({ size }) => size}px;
    color: white;
`