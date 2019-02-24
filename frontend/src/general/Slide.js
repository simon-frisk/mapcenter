import styled from 'styled-components'

export const Slide = styled.div`
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    ::-webkit-scrollbar-thumb {
        background: red;
    }
    ::-webkit-scrollbar: height: 10px;
`

export const SlideItem = styled.div`
    flex: 0 0 auto;
    margin: 10px;
`