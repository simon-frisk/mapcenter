import styled from 'styled-components'

export default styled.button`
    padding: 10px 15px;
    border: 2px solid ${({ theme }) => theme.secondary};
    color: ${({ theme }) => theme.secondary};
    font-size: 25px;
    border-radius: 7px;
    text-decoration: none;
    :hover {
        background-color: ${({ theme }) => theme.secondary};
        color: black;
    }
`