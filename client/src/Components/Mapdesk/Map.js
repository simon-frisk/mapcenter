import { useState, useEffect } from 'react'

export function useViewportSizeAndPreventCanvasScrolling(canvasRef) {
    function getWindowState() {
        return {w: document.body.clientWidth, h: window.innerHeight}
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

export function zoomInHandler(mapGeometry, canvas, windowSize, map, gpsDrawData, setGpsDrawData) {
    if(mapGeometry.w / canvas.width > 10 || mapGeometry.h / canvas.height > 10) return

    mapGeometry.w *= 1.1
    mapGeometry.h *= 1.1
    
    const VPCenterX = (windowSize.w / 2 * mapGeometry.w / map.width - mapGeometry.x) / 2
    const VPCenterY = (windowSize.h / 2 * mapGeometry.h / map.height - mapGeometry.y) / 2
    console.log(VPCenterX)
    mapGeometry.x -= VPCenterX * 0.05
    mapGeometry.y -= VPCenterY * 0.05

    setGpsDrawData(gpsDrawData.map(gps => {
        return gps.map(point => {
            const xDistFromMapOrigin = point.x - mapGeometry.x
            const yDistFromMapOrigin = point.y - mapGeometry.y
            return {
                ...point,
                x: xDistFromMapOrigin * 1.1 + mapGeometry.x,
                y: yDistFromMapOrigin * 1.1 + mapGeometry.y
            }
        })
    }))
}

export function zoomOutHandler(mapGeometry, canvas, windowSize, map, gpsDrawData, setGpsDrawData) {
    if(mapGeometry.w / 1.1 < canvas.width) return
    if(mapGeometry.h / 1.1 < canvas.height) return

    mapGeometry.w /= 1.1
    mapGeometry.h /= 1.1

    setGpsDrawData(gpsDrawData.map(gps => {
        return gps.map(point => {
            const xDistFromMapOrigin = point.x - mapGeometry.x
            const yDistFromMapOrigin = point.y - mapGeometry.y
            return {
                ...point,
                x: xDistFromMapOrigin / 1.1 + mapGeometry.x,
                y: yDistFromMapOrigin / 1.1 + mapGeometry.y
            }
        })
    }))
}