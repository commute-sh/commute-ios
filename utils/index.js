import _ from 'lodash'
import GeoPoint from 'geopoint';

export function createReducer (initialState, reducerMap) {
    return (state = initialState, action) => {

        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(_.isFunction(state) ? state() : state, action.payload)
            : (_.isFunction(state) ? state() : state);
    }
}

export function  getColor (items) {
    let pinColor = '#2ecc71';

    if (items === 0) {
        pinColor = '#e74c3c';
    } else if (items <= 3) {
        pinColor = '#d35400';
    } else if (items <= 5) {
        pinColor = '#f39c12';
    }

    return pinColor;
}

export function computeRegionRadiusInMeters(region) {

    const centerPoint = new GeoPoint(region.latitude, region.longitude);

    const latitudeDelta = Math.min(0.5, Math.abs(region.latitudeDelta));

    const longitudeDelta = Math.min(0.5, Math.abs(region.longitudeDelta));
    const topLeftPoint = new GeoPoint(region.latitude + latitudeDelta, region.longitude + longitudeDelta);

    const distance = centerPoint.distanceTo(topLeftPoint, true) * 1000;

    return  distance;
}

export function isPositionEqual(p1, p2, precision = 3) {
    if (!p1 && !p2) {
        return true;
    } else if (p1 && p2) {
        return (
            p1.coords.latitude.toFixed(precision) === p2.coords.latitude.toFixed(precision) &&
            p1.coords.longitude.toFixed(precision) === p2.coords.longitude.toFixed(precision)
        );
    } else {
        return false;
    }
}
