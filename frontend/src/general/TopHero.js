import React from 'react'
import styled from 'styled-components'

export default ({ background, children, height }) =>
    <Flex background={background} height={height}>
        <div>
            {children}
        </div>
    </Flex>

const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: calc(${({ height }) => height} - 60px);
    background-image: url(${({ background }) => background});
    background-size: cover;
    div {
        max-width: 750px;
        width: 90%;
    }
`