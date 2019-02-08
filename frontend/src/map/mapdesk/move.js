export function rotateArountPoint(gpsDrawData, editingFixPoint, fixPoints, userInput, move) {
    const { fixPoint, oldDragPoint, newDragPoint } = getMoveGpsRelevantPoints({
        gps: gpsDrawData[userInput.target.gpsIndex],
        target: editingFixPoint,
        fixPoint: fixPoints[0],
        move
    })
    const { fixToOldDistance, fixToNewDistance, oldToNewDistance } = calculatePointsTriangleSides(fixPoint, oldDragPoint, newDragPoint)
    const scale = fixToNewDistance / fixToOldDistance
    const angleOldToNew = cosineRule(fixToOldDistance, fixToNewDistance, oldToNewDistance)
    const rotationAngle = angleOldToNew * getRotationDirection(fixPoint, oldDragPoint, newDragPoint)
    return gpsDrawData.map(gps => {
        return gps.map(point => manipulatePoint(point, fixPoint, scale, rotationAngle))
    })
}

export function moveGps(gpsDrawData, move) {
    return gpsDrawData.map(gps => {
        return gps.map(point => ({
            ...point,
            x: point.x + move.x,
            y: point.y + move.y
        }))
    })
}

function cosineRule(closeSide1, closeSide2, adjacentSide) {
    const numerator = adjacentSide ** 2 - closeSide1 ** 2 - closeSide2 ** 2
    const denominator = -2 * closeSide1 * closeSide2
    const quotas = numerator / denominator
    return Math.acos(quotas)
}

function getMoveGpsRelevantPoints({gps, target, move, fixPoint}) {
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

function getRotationDirection(fixPoint, oldDragPoint, newDragPoint) {
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

function manipulatePoint(point, fixPoint, scale, rotationAngle) {
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

function calculatePointsTriangleSides(fixPoint, oldDragPoint, newDragPoint) {
    const fixToOldDistance = Math.hypot(fixPoint.x - oldDragPoint.x, fixPoint.y - oldDragPoint.y)
    const fixToNewDistance = Math.hypot(fixPoint.x - newDragPoint.x, fixPoint.y - newDragPoint.y)
    const oldToNewDistance = Math.hypot(oldDragPoint.x - newDragPoint.x, oldDragPoint.y - newDragPoint.y)
    return {fixToNewDistance, fixToOldDistance, oldToNewDistance}
}