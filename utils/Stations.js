import moment from 'moment';
import _ from 'lodash';

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
        pinColor = '#2c3e50';
    } else if (showStands && station.available_bike_stands === 0 || showBikes && station.available_bikes === 0) {
        pinColor = '#e74c3c'; // RED
    } else if (showStands && station.available_bike_stands <= 3 || showBikes && station.available_bikes <= 3) {
        pinColor = '#e67e22'; // ORANGE
    } else if (showStands && station.available_bike_stands <= 5 || showBikes && station.available_bikes <= 5) {
        pinColor = '#f1c40f'; // YELLOW
    } else {
        pinColor = '#27ae60'; // GREEN
    }

    return pinColor;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Mappings
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function mapStationsToAnnotations(stations, region, options) {

    const start = moment();

    console.log('[Stations][mapStationsToAnnotations] region:', region);
    console.log('[Stations][mapStationsToAnnotations] stations is array:', _.isArray(stations));
    console.log('[Stations][mapStationsToAnnotations] stations length:', stations.length);

    if (!_.isArray(stations)) {
        console.log('[Stations][mapStationsToAnnotations] Stations (Not array: ', JSON.stringify(stations), ')');
    }

    if (!region) {
        console.log('[Stations][mapStationsToAnnotations] Not mapping stations to annotations since there is no region available');
        return ;
    }

    const stationsInRegion = filterStationsInRegion(stations, region);

    const annotations = _.map(stationsInRegion, (station) => {
        return mapStationToAnnotation.bind(this)(station, options);
    });

    const end = moment();
    const duration = moment.duration(end.diff(start)).asMilliseconds();

    console.log("[Stations][mapStationsToAnnotations] *** Annotations", annotations.length," mapped in", duration, "ms");

    return annotations;
}

export function mapStationToAnnotation(station, { onStationPress, annotationType, center, geoLocation, pinSize }) {

//        console.log(`///////////////////// annotationType: ${annotationType} - showStands: ${showStands} - value: ${showStands ? station.available_bike_stands : station.available_bikes}`);

    const showStands = annotationType === 'STANDS';

    const pinColor = stationPinColor(station, annotationType);

    const distanceToRegion = center ? station.geoLocation.distanceTo(center, true) * 1000 : -1;

    const distanceToPosition = geoLocation ? station.geoLocation.distanceTo(geoLocation, true) * 1000 : -1;

    const onStationPressBinded = onStationPress.bind(this, station)

    return {
        id: String(station.number),
        station: station,
        distance: station.distance,
        latitude: station.position.lat,
        longitude: station.position.lng,

        number: station.number,
        pinSize: pinSize,
        value: showStands ? station.available_bike_stands : station.available_bikes,
        strokeColor: pinColor,
        bgColor: pinColor,
        lineWidth: pinSize <= 16 ? 0 : (pinSize <= 24 ? 3 : 4),
        fontSize: (pinSize <= 24 ? 10 : 14),
        fontWeight: '400',
        opacity: (distanceToPosition > 1000 && distanceToRegion > 1000) ? 0.33 : 1,

        onPress: onStationPressBinded
    };
}

