import { createReducer } from '../utils';
import constants from '../constants/stations';
import _ from 'lodash';
import GeoPoint from 'geopoint';

const initialState = {
    data: [],
    isFetching: false,
    err: undefined,
    search: undefined
};

export default createReducer(initialState, {
    [constants.RECEIVE_STATIONS]: (state, { stations, distance, position, contractName }) => {

        console.log("Found", stations.length, "matching position", position, ", distance", distance, "and contract name", contractName);

        const mergedStations = _.unionBy(state.data, stations, 'number');

        mergedStations.forEach(station => {
            if (!station.geoLocation) {
                station.geoLocation = new GeoPoint(station.position.lat, station.position.lng);
            }
        });

        return Object.assign({}, state, {
            data: mergedStations,
            isFetching: false,
            err: undefined
        })
    },
    [constants.FETCH_STATIONS_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isFetching: true,
            err: undefined,
            search: payload.search
        })
    },
    [constants.FETCH_STATIONS_FAILED]: (state, payload) => {
        return Object.assign({}, state, {
            isFetching: false,
            err: payload.err
        })
    }
})
