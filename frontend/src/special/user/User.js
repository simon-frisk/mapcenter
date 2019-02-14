import React, { useContext } from 'react'
import { withRouter } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import styled from 'styled-components'
import Float from '../../general/Float'
import Layout from '../../general/Layout'
import Context from '../../super/Context'
import Data from './Data'
import UserStats from './Userstats'
import Recentmaps from './Recentmaps'
import Topbutton from './Topbutton'
import ChangeProfilepicure from './ChangeProfilepicure';
import Profilepicture from '../../general/Profilepicture';

export default withRouter(props => {
    const context = useContext(Context)
    return (
        <Layout>
            <Data id={props.match.params.id} user={context.user}>
                {(user, following, client) =>
                    <>
                        <TopPanel>
                            <Float>
                                <div>
                                    {context.user === user._id 
                                        ? <ChangeProfilepicure user={user} />
                                        : <Profilepicture user={user} size={90} />
                                    }
                                    <Typography variant='h3'>{user.name}</Typography>
                                </div>
                                <Topbutton 
                                    context={context} 
                                    userId={props.match.params.id} 
                                    client={client} following={following}
                                />
                            </Float>
                            <UserStats user={user} />
                        </TopPanel>
                        <Recentmaps user={user} />
                    </>
                }
            </Data>
        </Layout>
    )
})

const TopPanel = styled.div`
    height: 40vh;
`