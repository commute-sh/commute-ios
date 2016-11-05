import { createReducer } from '../utils';
import constants from '../constants/map';
import GeoPoint from 'geopoint';

const initialState = {
    region: {
        longitudeDelta: 0.00772,
        latitude: 48.85319,
        longitude: 2.34831,
        latitudeDelta: 0.00819
    },
    annotationType: 'STANDS',
    pinSize: 32,
    center: new GeoPoint(48.85319, 2.34831),
    station: undefined,
    atLeastOneStationAlreadyShown: false
};

export default createReducer(initialState, {
    [constants.MAP_REGION_CHANGE]: (state, { region }) => {
        return Object.assign({}, state, {
            region,
            center: new GeoPoint(region.latitude, region.longitude)
        })
    },
    [constants.PIN_SIZE_CHANGE]: (state, { pinSize }) => {
        return Object.assign({}, state, {
            pinSize
        })
    },
    [constants.ANNOTATION_TYPE_CHANGE]: (state, { annotationType }) => {
        return Object.assign({}, state, {
            annotationType
        })
    },
    [constants.STATION_CHANGE]: (state, { station }) => {
        return Object.assign({}, state, {
            station,
            atLeastOneStationAlreadyShown: state.atLeastOneStationAlreadyShown || station !== undefined
        })
    }
})
