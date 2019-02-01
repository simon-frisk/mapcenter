export function calculateGpsMapCoords(gpsDrawData, mapGeometry, map) {
    const scale = map.width / mapGeometry.w
    return gpsDrawData.map(gps => {
        return gps.map(point => ({
                ...point,
                x: (point.x - mapGeometry.x) / scale,
                y: (point.y - mapGeometry.y) / scale
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

export function getMoveGpsRelevantPoints({gps, target, move, fixPoint}) {
    const fixPointCoords = {
        x: gps[fixPoint.index].x, 
        y: gps[fixPoint.index].y
    }
    const oldDragPointCoords = {
        x: gps[target.index].x, 
        y: gps[target.index].y
    }
    const newDragPointCoords = {
        x: oldDragPointCoords.x + move.x,
        y: oldDragPointCoords.y + move.y
    }
    return {
        fixPoint: fixPointCoords,
        oldDragPoint: oldDragPointCoords, 
        newDragPoint: newDragPointCoords
    }
}

export function getRotationDirection(fixPoint, oldDragPoint, newDragPoint) {
    const oldDragOnOrigin = {
        x: oldDragPoint.x - fixPoint.x,
        y: oldDragPoint.y - fixPoint.y
    }
    const newDragOnOrigin = {
        x: newDragPoint.x - fixPoint.x,
        y: newDragPoint.y - fixPoint.y
    }
    let oldAngle = Math.atan2(oldDragOnOrigin.y, oldDragOnOrigin.x)
    let newAngle = Math.atan2(newDragOnOrigin.y, newDragOnOrigin.x)
    if(oldAngle / newAngle < 0 && Math.abs(newAngle) > Math.PI / 2) {
        if(newAngle > 0)
            return -1
        else
            return 1
    }
    return newAngle < oldAngle ? -1 : 1
}

export function manipulatePoint(point, fixPoint, scale, rotationAngle) {
    const centeredAroundOrigin = {
        x: point.x - fixPoint.x,
        y: point.y - fixPoint.y
    }
    const rotated = {
        x: centeredAroundOrigin.x * Math.cos(rotationAngle) - centeredAroundOrigin.y * Math.sin(rotationAngle),
        y: centeredAroundOrigin.y * Math.cos(rotationAngle) + centeredAroundOrigin.x * Math.sin(rotationAngle)
    }
    const scaled = {
        x: rotated.x * scale,
        y: rotated.y * scale
    }
    const centeredBack = {
        x: scaled.x + fixPoint.x,
        y: scaled.y + fixPoint.y
    }
    return {
        ...point,
        x: centeredBack.x,
        y: centeredBack.y
    }
}

export function calculatePointsTriangleSides(fixPoint, oldDragPoint, newDragPoint) {
    const fixToOldDistance = Math.hypot(fixPoint.x - oldDragPoint.x, fixPoint.y - oldDragPoint.y)
    const fixToNewDistance = Math.hypot(fixPoint.x - newDragPoint.x, fixPoint.y - newDragPoint.y)
    const oldToNewDistance = Math.hypot(oldDragPoint.x - newDragPoint.x, oldDragPoint.y - newDragPoint.y)
    return {fixToNewDistance, fixToOldDistance, oldToNewDistance}
}

export function drawGpsGroup(gpsGroup, ctx, userInput, colorGenerator, w) {
    gpsGroup.forEach((gps, index) => {
        ctx.beginPath()
        const isSelected = userInput.target && userInput.target.gpsIndex === index
        ctx.lineWidth = isSelected ? w / 400 : w / 700
        ctx.strokeStyle = colorGenerator.next().value
        
        ctx.moveTo(gps[0].x, gps[0].y)
        for(let i = 1 ; i < gps.length ; i++) {
            ctx.lineTo(gps[i].x, gps[i].y)
        }
        ctx.closePath()
        ctx.stroke()
    })
}
