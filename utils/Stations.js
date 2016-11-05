export function filterStationsInRegion(stations, region) {

    const latMin = region.latitude - region.latitudeDelta / 2;
    const latMax = region.latitude + region.latitudeDelta / 2;
    const lngMin = region.longitude - region.longitudeDelta / 2;
    const lngMax = region.longitude + region.longitudeDelta / 2;

    return stations.filter(station =>
        latMin <= station.position.lat && station.position.lat <= latMax &&
        lngMin <= station.position.lng && station.position.lng <= lngMax
    );
}

export function stationPinColor(station, annotationType) {

    const showStands = annotationType === 'STANDS';
    const showBikes = !showStands;

    let pinColor; // GREEN

    if (station.status === 'CLOSED') {
        pinColor = '#000000';
    } else if (showStands && station.available_bike_stands === 0 || showBikes && station.available_bikes === 0) {
        pinColor = '#e74c3c'; // RED
    } else if (showStands && station.available_bike_stands <= 3 || showBikes && station.available_bikes <= 3) {
        pinColor = '#d35400'; // ORANGE
    } else if (showStands && station.available_bike_stands <= 5 || showBikes && station.available_bikes <= 5) {
        pinColor = '#f39c12'; // YELLOW
    } else {
        pinColor = '#2ecc71'
    }

    return pinColor;
}
