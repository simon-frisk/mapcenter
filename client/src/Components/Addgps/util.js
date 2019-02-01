export function convertRawGps(rawGps) {
    const {minLat, maxLat, minLon, maxLon} = rawGps.reduce((previous, current) => {
        if(current.lon > previous.maxLon)
            previous.maxLon = current.lon
        if(current.lon < previous.minLon)
            previous.minLon = current.lon
        if(current.lat < previous.minLat)
            previous.minLat = current.lat
        if(current.lat > previous.maxLat)
            previous.maxLat = current.lat
        return previous
    }, {minLat: 90, maxLat: -90, minLon: 180, maxLon: -180})

    const width = maxLon - minLon
    const height = maxLat - minLat
    const scale = 800 / width

    const startTime = new Date(rawGps[0].time).getTime()

    const gps = rawGps.map(point => ({
        time: Math.round((new Date(point.time).getTime() - startTime) / 1000),
        x: (point.lon - minLon) * scale + 150,
        y: (point.lat - minLat - height / 2) * -scale + height * scale / 2 + 150
    }))
    return gps
}

export async function readGpx(gpx) {
    const gpxText = await new Promise(resolve => {
        let fileReader = new FileReader()
        fileReader.readAsText(gpx)
        fileReader.onload = () => {
            resolve(fileReader.result)
        }
    })
    const gpxDoc = new DOMParser().parseFromString(gpxText, 'text/xml')
    const trkPoints = gpxDoc.getElementsByTagName('trkpt')
    return Array.from(trkPoints).map(trkPoint => {
        return {
            lon: trkPoint.getAttribute('lon'),
            lat: trkPoint.getAttribute('lat'),
            time: trkPoint.getElementsByTagName('time')[0].childNodes[0].nodeValue
        }
    })
}

export function filterGps(gps) {

    let lastKeptPoint

    const newGps = gps.filter(point => {
        if(!lastKeptPoint) {
            lastKeptPoint = point
            return true
        }
        
        const distance = Math.hypot(lastKeptPoint.x - point.x, lastKeptPoint.y - point.y)

        if(distance > 13) {
            lastKeptPoint = point
            return true
        }
        return false
    })

    return newGps
}