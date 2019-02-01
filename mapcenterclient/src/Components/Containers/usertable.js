import React from 'react'
import styled from 'styled-components'

const Table = styled.div`
    margin-top: 4px;
`
const Row = styled.div`
    padding: 20px;
    color: white;
    font-family: roboto;
    display: flex;
    justify-content: space-between;
`

export default ({ userRecordings }) =>
    <Table className='primaryBackground'>
        {
            userRecordings.map(userRecording => {
                const startTime = new Date(userRecording.startTime).getTime() / 1000
                const finishTime = startTime + userRecording.gps[userRecording.gps.length - 1].time
                const time = finishTime - startTime
                const hours = checkTime(Math.floor(time / 3600))
                const minutes = checkTime(Math.floor((time - hours * 3600) / 60))
                const seconds = checkTime(Math.floor((time - hours * 3600 - minutes * 60)))

                return (
                    <Row
                        key={userRecording.user._id}
                    >
                        <div>{userRecording.user.name}</div>
                        <div>{`${hours}:${minutes}:${seconds}`}</div>
                    </Row>
                )
            })
        }
    </Table>

function checkTime(time) {
    if(time < 10)
        return '0' + time
    return time
}