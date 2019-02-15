import React, { useContext } from 'react'
import Grid from '@material-ui/core/Grid'
import Context from '../../super/Context'
import Layout from '../../general/Layout'
import MyCard from '../../general/Card'
import Data from './Data'
import Eventinfo from './Eventinfo'

export default props => {
    const context = useContext(Context)

    return (
        <Layout>
            <Data id={props.match.params.id}>
                {event =>
                    <Grid container spacing={16}>
                        <Grid item xs={12}>
                            <Eventinfo context={context} event={event} />
                        </Grid>
                        {event.courses.map((course, index) => {
                            const path = course.mapPath
                            const thumbPath = path.slice(0, 7) + 'thumb_' + path.slice(7)
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                    <MyCard
                                        redirectTo={`/map/${props.match.params.id}/${course._id}`}
                                        image={'/api/' + thumbPath}
                                        name={course.name}
                                    />
                                </Grid>
                            )
                        })}
                    </Grid>
                }
            </Data>
        </Layout>
    )
}