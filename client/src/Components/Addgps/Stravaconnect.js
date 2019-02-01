import React, { useState, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActionArea from '@material-ui/core/CardActionArea'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import BackArraw from '@material-ui/icons/ArrowBackIos'
import ForwardArrow from '@material-ui/icons/ArrowForwardIos'
import Float from '../Presentation/Float'
import Loading from '../Presentation/Loading'
import StravaPowered from '../../assets/stravapowered.png'
import stravaconnect from '../../assets/stravaconnect.png'

const listActivitiesUrl = page => `https://www.strava.com/api/v3/athlete/activities?page=${page}`

const getTokenUrl = code => `https://www.strava.com/oauth/token?client_id=${process.env.REACT_APP_STRAVA_CLIENTID}&client_secret=${process.env.REACT_APP_STRAVA_CLIENTSECRET}&code=${code}&grant_type=authorization_code`

const getStravaAuthUrl = () => `https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_STRAVA_CLIENTID}&redirect_uri=${window.location.href}&response_type=code&scope=activity:read_all`

const getStreamUrl = id => `https://www.strava.com/api/v3/activities/${id}/streams?keys=latlng,time&key_by_type=true`

export default function({ params, onGps }) {
    const [ auth, setAuth ] = useState()
    const [ activities, setActivities ] = useState()
    const [ page, setPage ] = useState(1)
    const [ loading, setLoading ] = useState(false)

    function downloadStravaGps(activityIndex) {
        setLoading(true)
        fetch(getStreamUrl(activities[activityIndex].id), {
            headers: {
                'Authorization': `Bearer ${auth.access_token}`
            }
        })
            .then(res => res.blob())
            .then(blob => onGps(blob, activities[activityIndex]))
            .then(() => setLoading(false))
    }

    function changePage(add) {
        if(page === 1 && add === -1)
            add = 0
        setPage(page + add)
    }

    useEffect(() => {
        if(params.code)
            fetch(getTokenUrl(params.code), {
                method: 'POST'
            })
                .then(res => res.json())
                .then(setAuth)
    }, [])

    useEffect(() => {
        if(auth) {
            setLoading(true)
            fetch(listActivitiesUrl(page), {
                headers: {
                    'Authorization': `Bearer ${auth.access_token}`
                }
            })
                .then(res => res.json())
                .then(activities => {
                    return activities.filter(activity => {
                        if(!activity.start_latlng)
                            return false
                        return true
                    })
                })
                .then(setActivities)
                .then(() => setLoading(false))
        }
    }, [auth, page])

    if(activities) {
        return (
            <ActivitiesTable
                activities={activities}
                downloadStravaGps={downloadStravaGps}
                changePage={changePage}
                page={page}
                loading={loading}
            />
        )
    }
    return (
        <a href={getStravaAuthUrl()}>
            <img src={stravaconnect} alt='connect with strava' />
        </a>
    )
}

const ActivitiesTable = ({ activities, downloadStravaGps, changePage, page, loading }) =>
    <Card>
        <CardContent>
            <Typography variant='h5'>Select activity from Strava</Typography>
            <div style={{ height: '30vh', overflowY: 'auto', border: '1px solid lightgrey' }}>
                {
                    loading ?
                        <Loading />
                    :
                    activities.map((activity, index) =>
                        <CardActionArea 
                            key={activity.id} 
                            style={{ padding:'3px' }} 
                            onClick={() => downloadStravaGps(index)}
                        >
                            { activity.name }
                        </CardActionArea>    
                    )
                }
            </div>
            <Float>
                <IconButton onClick={() => changePage(-1)}><BackArraw /></IconButton>
                <Typography variant='h6'>Page { page }</Typography>
                <IconButton onClick={() => changePage(1)}><ForwardArrow /></IconButton>
            </Float>
            <img src={StravaPowered} alt='powered by strava' style={{maxWidth: '100%'}} />
        </CardContent>
    </Card>