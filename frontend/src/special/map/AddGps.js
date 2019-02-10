import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import queryString from 'query-string'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import BackArrow from '@material-ui/icons/ArrowBack'
import Loading from '../../general/Loading'
import Level from '../../general/Level'
import { TopInfo } from '../../general/TopInfo'
import StravaConnect from './api/Stravaconnect'
import Mapdesk from './mapdesk/Mapdesk'
import AddGpsApi from './api/Addgpsapi'
import { convertRawGps, readGpx, filterGps } from './mapdesk/Premaputil'

export default props =>
        <AddGpsApi
            eventId={props.match.params.eventId}
            courseId={props.match.params.courseId}
        >
            <AddGps 
                eventId={props.match.params.eventId} 
                courseId={props.match.params.courseId} 
                search={props.location.search}
            />
        </AddGpsApi>

function AddGps({ queryError, mutationError, event, mutationLoading, mutate, courseId, eventId, search }) {
    const [deskMode, setDeskMode] = useState()
    const [gps, setGps] = useState()
    const [firstCoord, setFirstCoord] = useState()
    const [startTime, setStartTime] = useState()
    const [error, setError] = useState()

    function useRawGps(rawGps) {
        setFirstCoord({ lat: Number(rawGps[0].lat), lon: Number(rawGps[0].lon) })
        setStartTime(rawGps[0].time)
        setGps(convertRawGps(rawGps))
        setDeskMode('editing')
    }

    async function onGpsFileChange(e) {
        if(!e.target.files[0].name.endsWith('.gpx')) {
            setError('wrong file type')
            return
        }
        setError(null)
        const rawGps = await readGpx(e.target.files[0])
        useRawGps(rawGps)
    }

    async function onStravaGps(blob, activity) {
        const reader = new FileReader()
        reader.addEventListener('loadend', () => {
            const data = JSON.parse(reader.result)
            const rawGps = data.latlng.data.map((point, index) => ({
                lat: point[0],
                lon: point[1],
                time: new Date(new Date(activity.start_date_local).getTime() + data.time.data[index] * 1000).toISOString()
            }))
            useRawGps(rawGps)
        })
        reader.readAsText(blob)
    }

    function submitToEvent() {
        setDeskMode('loading')
        if(!gps) {
            setDeskMode(undefined)
            return
        }
        const uploadGps = filterGps(gps)
        mutate(uploadGps, firstCoord, startTime)
    }

    return (
        <>
            <TopInfo>
                <Button
                    component={Link}
                    to={`/map/${eventId}/${courseId}`}
                ><BackArrow/>Back to map</Button>
                <Typography variant='h3'>
                    Add gps to {event.name}
                </Typography>
                <Level style={{ alignItems: 'flex-start' }}>
                    <StravaConnect params={queryString.parse(search)} onGps={onStravaGps} />
                    <input
                        type='file'
                        onChange={onGpsFileChange}
                        style={{display: 'none'}}
                        id='fileinput'
                    />
                    <Button
                        size='medium'
                        variant='contained'
                        onClick={() => document.getElementById('fileinput').click()}
                    >Select gpx file</Button>
                </Level>
                {(error || mutationError || queryError) &&
                    <Typography
                        color='error'
                        variant='subtitle2'
                    >
                        {error || mutationError.message || queryError.message}
                    </Typography>}
            </TopInfo>
            {deskMode === 'editing' &&
                <Mapdesk
                    mapFile={event.courses[0].mapPath}
                    gpsGroup={[gps]}
                    setGpsGroup={gpsGroup => {
                        setGps(gpsGroup[0])
                    }}
                >
                    <Button
                        color='secondary'
                        variant='contained'
                        onClick={submitToEvent}
                    >Add GPS</Button>
                </Mapdesk>
            }
            {mutationLoading &&
                <Loading />
            }
        </>
    )
}