import GeoPoint from 'geopoint';

export function computeRegionRadiusInMeters(region) {

    const centerPoint = new GeoPoint(region.latitude, region.longitude);

    const latitudeDelta = Math.min(0.5, Math.abs(region.latitudeDelta));

    const longitudeDelta = Math.min(0.5, Math.abs(region.longitudeDelta));
    const topLeftPoint = new GeoPoint(region.latitude + latitudeDelta, region.longitude + longitudeDelta);

    const distance = centerPoint.distanceTo(topLeftPoint, true) * 1000;

    return  distance;
}

export function regionEquals(r1, r2) {
    return (
        r1.latitude === r2.latitude && 
        r1.longitude === r2.longitude && 
        r1.latitudeDelta === r2.latitudeDelta && 
        r1.longitudeDelta === r2.longitudeDelta
    );
}
