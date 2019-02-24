import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Button from '../../../general/Button'
import TopHero from '../../../general/TopHero'
import background from '../bg.png'
import stravacompatible from './stravacompatible.png'

const TopHeroText = styled.h2`
    color: white;
    font-size: 50px;
    @media (max-width: 700px) {
        font-size: 35px;
    }
`

const Footer = styled.div`
    display: flex;
    padding: 2%;
    justify-content: center;
    max-width: 100%;
    overflow: hidden;
    background-color: ${({ theme }) => theme.primary}
`

const Flex = styled.div`
    display: flex;
    flex-wrap: wrap;
    div {
        padding: 40px;
        max-width: 500px;
        margin: auto;
        h3 {
            font-size: 40px;
            margin: 0 5px;
        }
        p {
            font-size: 25px;
        }
    }
`

export default () => (
    <>
        <TopHero background={background} height='80vh'>
            <TopHeroText>
                Welcome to {process.env.REACT_APP_APP_NAME}, a network connecting orienteering
            </TopHeroText>
            <Button as={Link} to='/signup'>Get started!</Button>
        </TopHero>
        <Flex>
            <div>
                <h3>Network</h3>
                <p>
                    {process.env.REACT_APP_APP_NAME} was created with one vision in mind: to connect the world's orienteers and map lovers and to help them share their orienteering adventures to enjoy them together
                </p>
            </div>
            <div>
                <h3>Analyze</h3>
                <p>
                    {process.env.REACT_APP_APP_NAME} helps you become a better orienteer by providing everything needed to improve technically; It features the best tools for orienteering analysis and other people to discuss orienteering with
                </p>
            </div>
        </Flex>
        <Footer>
            <img src={stravacompatible} alt='compatible with strava' />
        </Footer>
    </>
)