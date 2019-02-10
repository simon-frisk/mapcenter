import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
import Float from '../../../general/Float'
import { Slide, SlideItem } from '../../../general/Slide'

export default props => {
    const [name, setName] = useState('')
    const [courses, setCourses] = useState([])

    function onEventNameChange(e) {
        setName(e.target.value)
    }

    function createCourse() {
        setCourses([
            ...courses,
            {name: '', mapFile: null}
        ])
    }

    function removeCourse(index) {
        let newCourses = courses.slice()
        newCourses.splice(index, 1)
        setCourses(newCourses)
    }

    function onCourseNameChange(index, value) {
        let newCourses = courses.slice()
        newCourses[index].name = value
        setCourses(newCourses)
    }

    function onMapFileChange(index, value) {
        let newCourses = courses.slice()
        newCourses[index].mapFile = value
        setCourses(newCourses)
    }

    return (
        <>
            <Float>
                <Typography variant='h3'>Create Event</Typography>
                <Button
                    color='secondary'
                    variant='contained'
                    disabled={props.loading}
                    onClick={props.onCreateEvent.bind(null, name, courses)}
                >
                    Create Event
                </Button>
            </Float>
            <TextField label='Event name' fullWidth value={name} onChange={onEventNameChange} />
            {props.error &&
                <Typography
                    color='error'
                    variant='subtitle2'
                >
                    {props.error}
                </Typography>
            }
            <Button
                style={{marginBottom: '10px', marginTop: '20px'}}
                color='secondary'
                variant='contained'
                onClick={createCourse}
                >
                Create course
            </Button>
            <Slide>
                {courses.map((course, index) => 
                    <SlideItem key={index}>
                        <Card>
                            <CardContent>
                                <TextField
                                    style={{display: 'block'}}
                                    label='Course name'
                                    value={course.name}
                                    onChange={e => onCourseNameChange(index, e.target.value)}
                                />
                                <input
                                    type='file'
                                    id={'fileinput' + index}
                                    style={{display: 'none'}}
                                    onChange={e => onMapFileChange(index, e.target.files[0])}
                                />
                                <Button
                                    size='medium'
                                    variant='contained'
                                    onClick={() => document.getElementById('fileinput' + index).click()}
                                >
                                    Select file
                                </Button>
                                <Typography variant='subtitle2'>{course.mapFile && course.mapFile.name}</Typography>
                            </CardContent>
                            <IconButton onClick={removeCourse.bind(null, index)}>
                                <Delete />
                            </IconButton>
                        </Card>
                    </SlideItem>
                )}
            </Slide>
        </>
    )
}