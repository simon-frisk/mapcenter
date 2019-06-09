import React from 'react'
import Usercard from '../../general/Usercard'
import { Slide, SlideItem } from '../../general/Slide'

export default ({ data }) =>
    <div style={{ marginTop: '20px' }}>
        <h2 style={{fontSize: '35px', margin: '10px'}}>Users</h2>
        <Slide>
            {data && data.topUsers.map(user => 
                <SlideItem>
                    <Usercard user={user}/>
                </SlideItem>    
            )}
        </Slide>
    </div>