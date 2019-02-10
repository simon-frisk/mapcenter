import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import BackArrow from '@material-ui/icons/ArrowBack'
import Play from '@material-ui/icons/PlayCircleFilled'
import Pause from '@material-ui/icons/PauseCircleFilled'
import Context from '../super/Context'
import Loading from '../view/Loading'
import Mapdesk from './mapdesk/Mapdesk'
import UserTable from './view/usertable'
import { TopInfo } from '../layout/TopInfo'

const QUERY = gql`
    query GetCourse($event: ID! $course: ID!) {
        event(id: $event) {
            _id
            name
            courses(id: $course) {
                name
                mapPath
                userRecordings {
                    user {
                        _id
                        name
                    }
                    gps {
                        x
                        y
                        time
                    }
                    startTime
                }
                event {
                    name
                }
            }
        }
    }
`

const MUTATION = gql`
    mutation RemoveGps($courseId: ID!) {
        removeGps(courseId: $courseId)
    }
`

export default props => {
    const context = useContext(Context)

    return (
        <Query 
            query={QUERY}
            variables={{
                event: props.match.params.eventId,
                course: props.match.params.courseId
            }}
        >
            {({loading, error, data}) => {
                if(loading)
                    return <Loading/>
                if(error)
                    return error.message
                const { event } = data
                const course = event.courses[0]
                return (
                    <>
                        <TopInfo>
                            <Button
                                component={Link} to={`/event/${event._id}`}
                            >
                                <BackArrow/>Back to event
                            </Button>
                            <Typography variant='h3'>{course.event.name} - {course.name}</Typography>
                            {
                                event.courses[0].userRecordings.map(userRec => userRec.user._id)
                                    .includes(context.user)
                                    ? <RemoveGpsButton courseId={props.match.params.courseId} />
                                    : (
                                        <Button
                                            color='secondary'
                                            variant='contained'
                                            component={Link}
                                            to={`/map/${props.match.params.eventId}/${props.match.params.courseId}/add`}
                                        >
                                            Add GPS
                                        </Button>
                                    )
                            }
                        </TopInfo>
                        <UserTable userRecordings={course.userRecordings} />
                        <Mapdesk
                            mapFile={course.mapPath}
                            gpsGroup={course.userRecordings.map(user => user.gps)}
                        >
                            {/*<IconButton color='secondary' ><Play /></IconButton>
                            <IconButton color='secondary' ><Pause /></IconButton>*/}
                        </Mapdesk>
                    </>
                )
            }}
        </Query>
    )
}

const RemoveGpsButton = ({ courseId }) => 
    <Mutation mutation={MUTATION}>
        {(mutate, { called, loading, client }) => {
            if(loading) return <Loading />
            if(called && !loading) {
                client.resetStore()
            }
            return (
                <Button variant='contained' onClick={() => mutate({variables: {courseId}})}>
                    Remove gps
                </Button>
            )
        }}
    </Mutation>