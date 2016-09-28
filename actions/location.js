import constants from '../constants/location';

function locationChanged(position) {
    return {
        type: constants.LOCATION_CHANGED,
        payload: { position }
    };
}

export function initGeoLocation(dispatch) {
    console.log('$$$ Initializing GeoLocation ...');
    navigator.geolocation.getCurrentPosition((position) => {
            console.log('$$$ navigator.geolocation.getCurrentPosition - position:', position);
            locationChanged(position);
        }, (error) => {
            console.error(error.message);
        }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );

    console.log('$$$ Watching Geolocation ...');
    return navigator.geolocation.watchPosition((position) => {
        dispatch(locationChanged(position));
    });
}

export function disposeGeoLocation(watchID) {
    navigator.geolocation.clearWatch(watchID);
}
