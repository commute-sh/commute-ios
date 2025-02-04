import { createReducer } from '../utils/Reducers';
import constants from '../constants/location';
import GeoPoint from 'geopoint';

const initialState = {
    position: undefined,
    geoLocation: undefined
};

export default createReducer(initialState, {
    [constants.LOCATION_CHANGED]: (state, { position }) => {

        console.log(`[REDUCER][LOCATION_CHANGED] latitude: ${position.coords.latitude}, longitude: ${position.coords.longitude}`);

        return Object.assign({}, state, {
            position,
            geoLocation: new GeoPoint(position.coords.latitude, position.coords.longitude)
        })
    }
})
