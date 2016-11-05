import { createReducer } from '../utils/Reducers';
import constants from '../constants/nearbyStations';
import _ from 'lodash';
import GeoPoint from 'geopoint';
import moment from 'moment';

const initialState = {
    data: [],
    isFetching: false,
    err: undefined,
    lastUpdate: moment(0),
    search: undefined,
    version: 0
};

export default createReducer(initialState, {
    [constants.FETCH_NEARBY_STATIONS_SUCCEED]: (state, { search, stations }) => {

        const { distance, position, contractName } = search;

        console.log("Found", stations.length, "matching position", position, ", distance", distance, "and contract name", contractName);

        const mergedStations = _.unionBy(state.data, stations, 'number');

        mergedStations.forEach(station => {
            if (!station.geoLocation) {
                station.geoLocation = new GeoPoint(station.position.lat, station.position.lng);
            }

            const paddedStationNumber = ("00000" + station.number).slice(-5);

            if (station.name.indexOf(paddedStationNumber + ' - ') === 0) {
                station.name = station.name.substring((paddedStationNumber + ' - ').length);
            }

        });

        return Object.assign({}, state, {
            data: mergedStations,
            isFetching: false,
            lastUpdate: moment(),
            err: undefined,
            version: state.version + 1
        })
    },
    [constants.FETCH_NEARBY_STATIONS_REQUEST]: (state, { search }) => {
        return Object.assign({}, state, {
            isFetching: true,
            err: undefined,
            search: search
        })
    },
    [constants.FETCH_NEARBY_STATIONS_FAILED]: (state, { search, err }) => {
        return Object.assign({}, state, {
            isFetching: false,
            err: err
        })
    }
})
