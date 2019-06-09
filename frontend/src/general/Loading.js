import React from 'react'
import styled, { keyframes } from 'styled-components'

export default () => {
    const [show, setShow] = React.useState(false)

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true)
        }, 1000)
        return () => clearTimeout(timeout)
    }, [])

    if(!show) return ''

    return (
        <Flex>
            <Spinner />
        </Flex>
    )
}

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`

const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`

const Spinner = styled.span`
    border: 5px solid lightgrey;
    border-top: 5px solid black;
    border-radius: 50%;
    width: 70px;
    height: 70px;
    display: inline-block;
    animation: ${rotate} 1.5s ease infinite alternate;
`
