import GeoPoint from 'geopoint';
const { abs } = Math;


export function computeRegionRadiusInMeters(region) {

    console.log('[Utils][Region][computeRegionRadiusInMeters] region:', region);
    const centerPoint = new GeoPoint(region.latitude, region.longitude);

    const latitudeDelta = Math.min(0.5, Math.abs(region.latitudeDelta));

    const longitudeDelta = Math.min(0.5, Math.abs(region.longitudeDelta));
    const topLeftPoint = new GeoPoint(region.latitude + latitudeDelta, region.longitude + longitudeDelta);

    const distance = centerPoint.distanceTo(topLeftPoint, true) * 1000;

    return  distance;
}

export function regionEquals(r1, r2) {
    if (!r1 && !r2) {
        return true;
    }

    if (!r1 || !r2) {
        return false;
    }

    return (
        r1.latitude === r2.latitude && 
        r1.longitude === r2.longitude && 
        r1.latitudeDelta === r2.latitudeDelta && 
        r1.longitudeDelta === r2.longitudeDelta
    );
}

export function computeRegionFromLocation(location, delta = 0.5) {
    let currentLocationBoundingCoordinates = location.boundingCoordinates(delta, undefined, true);

    let latitudeDelta = abs(abs(location.latitude()) - abs(currentLocationBoundingCoordinates[0].latitude())) * 2;
    let longitudeDelta = abs(abs(location.longitude()) - abs(currentLocationBoundingCoordinates[0].longitude())) * 2;

    return {
        latitude: location.latitude(),
        longitude: location.longitude(),
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta
    };
}
