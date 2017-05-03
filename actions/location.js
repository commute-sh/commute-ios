import constants from '../constants/location';

function locationChanged(position) {
    console.log(`[Actions][Location][locationChanged] Position: ${JSON.stringify(position)}`);
    return {
        type: constants.LOCATION_CHANGED,
        payload: { position }
    };
}

export function initGeoLocation(dispatch) {
    console.log('[Actions][Location][initGeoLocation] Initializing GeoLocation ...');
    navigator.geolocation.getCurrentPosition((position) => {
            console.log('[Actions][Location][initGeoLocation][getCurrentPosition] Position:', position);
            dispatch(locationChanged(position));
        }, (error) => {
            console.debug(`[Actions][Location][initGeoLocation][getCurrentPosition] Failed to get current position: ${error.message}`);
        }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    console.log('[Actions][Location][initGeoLocation] Watching Geolocation ...');
    return navigator.geolocation.watchPosition((position) => {
        console.log('[Actions][Location][initGeoLocation][watchPosition] Position:', position);
        dispatch(locationChanged(position));
    });
}

export function disposeGeoLocation(watchID) {
    if (watchID) {
        navigator.geolocation.clearWatch(watchID);
    }
}
