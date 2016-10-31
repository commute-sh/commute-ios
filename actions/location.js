import constants from '../constants/location';

function locationChanged(position) {
    console.log(`[LOCATION_CHANGED] ------------------------------------- position: ${JSON.stringify(position)}`);
    return {
        type: constants.LOCATION_CHANGED,
        payload: { position }
    };
}

export function initGeoLocation(dispatch) {
    console.log('$$$ Initializing GeoLocation ...');
    navigator.geolocation.getCurrentPosition((position) => {
            console.log('$$$ navigator.geolocation.getCurrentPosition - position:', position);
            dispatch(locationChanged(position));
        }, (error) => {
            console.debug(`[Location][getCurrentPosition] Failed to get current position: ${error.message}`);
        }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    console.log('$$$ Watching Geolocation ...');
    return navigator.geolocation.watchPosition((position) => {
        console.log('[watchPosition][locationChanged] position:', position);
        dispatch(locationChanged(position));
    });
}

export function disposeGeoLocation(watchID) {
    if (watchID) {
        navigator.geolocation.clearWatch(watchID);
    }
}
