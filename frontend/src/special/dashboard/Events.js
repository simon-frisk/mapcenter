import React from 'react'
import Card from '../../general/Mapcard'
import { Slide, SlideItem } from '../../general/Slide'

export default ({ data }) =>
    <>
        <h2 style={{fontSize: '35px', margin: '10px'}}>Recent events</h2>
        <Slide>
            {data && data.recentEvents.map(event => {
                const path = event.courses[0].mapPath
                const thumbPath = path.slice(0, 7) + 'thumb_' + path.slice(7)
                return (
                    <SlideItem>
                        <Card
                            redirectTo={`/event/${event._id}`}
                            image={'/api/' + thumbPath}
                            name={event.name}
                        />
                    </SlideItem>
                )
            })}
        </Slide>
    </>