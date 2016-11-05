import GeoPoint from 'geopoint';

export function computeRegionRadiusInMeters(region) {

    const centerPoint = new GeoPoint(region.latitude, region.longitude);

    const latitudeDelta = Math.min(0.5, Math.abs(region.latitudeDelta));

    const longitudeDelta = Math.min(0.5, Math.abs(region.longitudeDelta));
    const topLeftPoint = new GeoPoint(region.latitude + latitudeDelta, region.longitude + longitudeDelta);

    const distance = centerPoint.distanceTo(topLeftPoint, true) * 1000;

    return  distance;
}
