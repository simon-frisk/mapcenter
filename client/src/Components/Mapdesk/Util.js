import styled from 'styled-components'

export function* genColor() {
    const initialColors = [
        'fuchsia',
        'green',
        'blue',
        'red',
    ]
    let colors = initialColors.slice()
    while(true) {
        if(colors.length === 0) 
            colors = initialColors
        const color = colors.pop()
        yield color
    }
}

export function cosineRule(closeSide1, closeSide2, adjacentSide) {
    const numerator = adjacentSide ** 2 - closeSide1 ** 2 - closeSide2 ** 2
    const denominator = -2 * closeSide1 * closeSide2
    const quotas = numerator / denominator
    return Math.acos(quotas)
}

export const DeskButtons = styled.div`
    position: absolute;
    z-index: 10;
    background: #424444;
    opacity: 0.94;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 5px;
`

export const Desk = styled.div`
    position: relative;
`

export const Canvas = styled.canvas`
    position: absolute;
`