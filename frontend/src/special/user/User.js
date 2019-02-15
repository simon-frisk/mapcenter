import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import Layout from '../../general/Layout'
import Context from '../../super/Context'
import Data from './Data'
import Recentmaps from './Recentmaps'
import Topbutton from './Topbutton'
import UserInfo from './Userinfo'

export default withRouter(props => {
    const context = useContext(Context)
    return (
        <Layout>
            <Data id={props.match.params.id} user={context.user}>
                {(user, isFollowing, client) =>
                    <Grid container spacing={16}>
                        <Grid item sm={12} md={8} lg={6}>
                            <div>
                                <Topbutton 
                                    context={context} 
                                    userId={props.match.params.id} 
                                    client={client} following={isFollowing}
                                />
                                <UserInfo user={user} context={context} />
                            </div>
                        </Grid>
                        <Recentmaps user={user} />  
                    </Grid>
                }
            </Data>
        </Layout>
    )
})
