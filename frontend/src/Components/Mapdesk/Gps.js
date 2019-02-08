export function calculateGpsMapCoords(gpsDrawData, mapGeometry, map) {
    const scale = mapGeometry.w / map.width
    return gpsDrawData.map(gps => {
        return gps.map(point => ({
                ...point,
                x: (point.x - mapGeometry.x) / scale,
                y: (point.y - mapGeometry.y) / scale
            }))
    })
}

export function calculateDrawCoords(gpsData, mapGeometry, map) {
    const scale = mapGeometry.w / map.width
    return gpsData.map(gps => {
        return gps.map(point => ({
            ...point,
            x: point.x * scale + mapGeometry.x,
            y: point.y * scale + mapGeometry.y
        }))
    })
}

export function closestGpsPoint(gpsGroup, userCoord) {
    return gpsGroup.reduce((gpsWithClosestPoint, gps, gpsIndex) => {
        
        const closestInGps = gps.reduce((closest, point, index) => {
            const distance = Math.hypot(point.x - userCoord.x, point.y - userCoord.y)
            
            if(distance < 15 && (!closest || distance < closest.distance))
                return {...point, index, distance, gpsIndex}
                
            return closest
        }, null)
        
        if((!gpsWithClosestPoint && closestInGps) || (gpsWithClosestPoint && closestInGps && closestInGps.distance < gpsWithClosestPoint.distance))
            return closestInGps
            
            return gpsWithClosestPoint
        }, null)
}

export function drawGpsGroup(gpsGroup, ctx, userInput, colorGenerator, width) {
    gpsGroup.forEach((gps, index) => {
        ctx.beginPath()
        const isSelected = userInput.target && userInput.target.gpsIndex === index
        ctx.lineWidth = isSelected ? 7 : 4
        ctx.strokeStyle = colorGenerator.next().value
        
        ctx.moveTo(gps[0].x, gps[0].y)
        for(let i = 1 ; i < gps.length ; i++) {
            ctx.lineTo(gps[i].x, gps[i].y)
        }
        ctx.closePath()
        ctx.stroke()
    })
}
