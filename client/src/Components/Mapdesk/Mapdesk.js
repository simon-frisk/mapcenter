import React, { createRef, useState, useEffect } from 'react'
import { genColor, Desk, DeskButtons, Canvas } from './Util'
import IconButton from '@material-ui/core/IconButton'
import ZoomIn from '@material-ui/icons/ZoomIn'
import ZoomOut from '@material-ui/icons/ZoomOut'
import Loading from '../Presentation/Loading'
import { 
    useViewportSizeAndPreventCanvasScrolling,
    getUserinputPosition, 
    moveMap, 
    zoomInHandler, 
    zoomOutHandler 
} from './Map'
import {
    calculateGpsMapCoords,
    calculateDrawCoords,
    closestGpsPoint,
    drawGpsGroup
} from './Gps'
import { rotateArountPoint, moveGps } from './move'

export default props => {
    const canvasRef = createRef()
    const windowSize = useViewportSizeAndPreventCanvasScrolling(canvasRef)
    const [ mapGeometry, setMapGeometry ] = useState()
    const [ map, setMap ] = useState()
    const [ gpsDrawData, setGpsDrawData ] = useState()
    const [ userInput, setUserInput ] = useState({
        x: null,
        y: null,
        down: false,
        target: null
    })

    const [fixPoints, setFixPoints] = useState([])
    const [editingFixPoint, setEditingFixPoint] = useState()

    useEffect(() => {
        const img = new Image()
        img.src = process.env.REACT_APP_API_URL + props.mapFile
        img.onload = () => {
            const heightRatio = img.height / windowSize.h
            const widthRatio = img.width / windowSize.w
            let w = widthRatio < heightRatio ? windowSize.w : img.width / heightRatio
            const h = widthRatio > heightRatio ? windowSize.h : img.height / widthRatio
            const x = -(w - windowSize.w) / 2
            const y = -(h - windowSize.h) / 2
            setMapGeometry({x, y, w, h})
            setMap(img)
        }
    }, [props.mapFile])

    useEffect(() => {
        if(map)
            setGpsDrawData(calculateDrawCoords(props.gpsGroup, mapGeometry, map))
    }, [props.gpsGroup, map])

    useEffect(() => {
        if(map && canvasRef.current) render()
    })

    function render() {
        const colorGenerator = genColor()
        const ctx = canvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        const { x, y, w, h } = mapGeometry
        ctx.drawImage(map, x, y, w, h)
        drawGpsGroup(gpsDrawData, ctx, userInput, colorGenerator)
    }

    function onDown(e) {
        const userCoord = getUserinputPosition(canvasRef.current, e)
        const target = closestGpsPoint(gpsDrawData, userCoord)
        if(target) {
            if(fixPoints.length > 1)
                fixPoints.length = 0
            if(fixPoints[0] && fixPoints[0].gpsIndex === target.gpsIndex && Math.abs(target.index - fixPoints[0].index) < 20)
                setEditingFixPoint(fixPoints.pop())
            else setEditingFixPoint({ gpsIndex: target.gpsIndex, index: target.index })
        }
        setUserInput({
            ...userInput,
            ...userCoord,
            down: true,
            target
        })
    }

    function onUp() {
        if(editingFixPoint) {
            setFixPoints([...fixPoints, editingFixPoint])
            setEditingFixPoint(null)
        }
        setUserInput({
            ...userInput,
            down: false,
            target: null
        })
    }
    
    function onMove(event) {
        if(event.nativeEvent.type === 'touchmove' && event.touches.length === 0) return
        const userCoord = getUserinputPosition(canvasRef.current, event)
        const move = {
            x: userCoord.x - userInput.x,
            y: userCoord.y - userInput.y
        }
        setUserInput({
            ...userInput,
            ...userCoord,
            target: userInput.down ? userInput.target : closestGpsPoint(gpsDrawData, userCoord)
        })

        if(!editingFixPoint && userInput.down)
            moveMap(mapGeometry, move, gpsDrawData, canvasRef)

        else if(props.setGpsGroup && editingFixPoint) {
            let newGpsData = gpsDrawData
            if(fixPoints.length === 0)
                newGpsData = moveGps(gpsDrawData, move)
            else if(fixPoints.length === 1)
                newGpsData = rotateArountPoint(gpsDrawData, editingFixPoint, fixPoints, userInput, move)

            props.setGpsGroup(calculateGpsMapCoords(newGpsData, mapGeometry, map))
        }
    }

    function zoomIn() {
        zoomInHandler(mapGeometry, setMapGeometry, canvasRef.current, windowSize, gpsDrawData, setGpsDrawData)
    }

    function zoomOut() {
        zoomOutHandler(mapGeometry, setMapGeometry, canvasRef.current, windowSize, gpsDrawData,setGpsDrawData)
    }

    if(!map || !gpsDrawData)
        return <Loading />

    return (
        <Desk>
            <DeskButtons>
                <div style={{display: 'flex', alignContent: 'center'}}>
                    {props.children}
                </div>
                <div>
                    <IconButton color='secondary' onClick={zoomIn}><ZoomIn /></IconButton>
                    <IconButton color='secondary' onClick={zoomOut}><ZoomOut /></IconButton>
                </div>
            </DeskButtons>
            <Canvas
                style={{width: '100%', height: '100vh'}}
                width={windowSize.w}
                height={windowSize.h}
                onMouseDown={onDown}
                onMouseMove={onMove}
                onMouseLeave={onUp}
                onMouseUp={onUp}
                onTouchStart={onDown}
                onTouchMove={onMove}
                onTouchEnd={onUp}
                ref={canvasRef}
            />
        </Desk>
    )
}