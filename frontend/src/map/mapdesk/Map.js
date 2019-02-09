import { useState, useEffect } from 'react'

export function useViewportSizeAndPreventCanvasScrolling(canvasRef) {
    function getWindowState() {
        const dpr = window.devicePixelRatio || 1
        return {
            w: document.body.clientWidth * dpr,
            h: window.innerHeight * dpr
        }
    }

    const [windowSize, setWindowSize] = useState(getWindowState())

    useEffect(() => {
        function resize() {
            setWindowSize(getWindowState())
        }
        function prevent(e) {
            if(e.target === canvasRef.current)
                e.preventDefault()
        }

        window.addEventListener('resize', resize)

        document.body.addEventListener('touchstart', prevent, {passive: false})
        document.body.addEventListener('touchmove', prevent, {passive: false})
        document.body.addEventListener('touchend', prevent, {passive: false})

        return () => {
            window.removeEventListener('resize', resize)
            document.body.removeEventListener('touchstart', prevent, {passive: false})
            document.body.removeEventListener('touchmove', prevent, {passive: false})
            document.body.removeEventListener('touchend', prevent, {passive: false})
        }
    })

    return windowSize
}

export function getUserinputPosition(canvas, event) {
    let isTouch = false
    const type = event.nativeEvent.type
    if(type === 'touchstart' || type === 'touchmove' || type === 'touchend')
        isTouch = true
    const positionObject = isTouch ? event.touches[0] : event
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
        x: (positionObject.clientX - rect.left) * scaleX,
        y: (positionObject.clientY - rect.top) * scaleY
    }
}

export function moveMap(mapGeometry, move, gpsDrawData, canvasRef) {
    mapGeometry.x += move.x
    if(mapGeometry.x > 0)
        mapGeometry.x -= move.x
    else if(mapGeometry.x + mapGeometry.w < canvasRef.current.width)
        mapGeometry.x -= move.x
    else {
        gpsDrawData.forEach(gps => {
            gps.forEach(point => {
                point.x += move.x
            })
        })
    }
    mapGeometry.y += move.y
    if(mapGeometry.y > 0)
        mapGeometry.y -= move.y
    else if(mapGeometry.y + mapGeometry.h < canvasRef.current.height)
        mapGeometry.y -= move.y
    else {
        gpsDrawData.forEach(gps => {
            gps.forEach(point => {
                point.y += move.y
            })
        })
    }
}

export function zoomInHandler(mapGeometry, setMapGeometry, canvas, windowSize, gpsDrawData, setGpsDrawData) {
    if(mapGeometry.w / canvas.width > 10 || mapGeometry.h / canvas.height > 10) return
    zoomHandler(windowSize, mapGeometry, setMapGeometry, gpsDrawData, setGpsDrawData, 1.15)
}

export function zoomOutHandler(mapGeometry, setMapGeometry, canvas, windowSize, gpsDrawData, setGpsDrawData) {
    if(mapGeometry.w * 0.85 < canvas.width) return
    if(mapGeometry.h * 0.85 < canvas.height) return
    zoomHandler(windowSize, mapGeometry, setMapGeometry, gpsDrawData, setGpsDrawData, 0.85)
}

function zoomHandler(windowSize, mapGeometry, setMapGeometry, gpsDrawData, setGpsDrawData, zoom) {
    const moveX = (windowSize.w / 2 - mapGeometry.x) * (zoom - 1)
    const moveY = (windowSize.h / 2 - mapGeometry.y) * (zoom - 1)

    setGpsDrawData(gpsDrawData.map(gps => {
        return gps.map(point => {
            const xDistFromMapOrigin = point.x - mapGeometry.x
            const yDistFromMapOrigin = point.y - mapGeometry.y
            return {
                ...point,
                x: xDistFromMapOrigin * zoom + mapGeometry.x - moveX,
                y: yDistFromMapOrigin * zoom + mapGeometry.y - moveY
            }
        })
    }))
    setMapGeometry({
        ...mapGeometry,
        x: mapGeometry.x - moveX,
        y: mapGeometry.y - moveY,
        w: mapGeometry.w * zoom,
        h: mapGeometry.h * zoom
    })
}