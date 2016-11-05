import { createReducer } from '../utils/Reducers';
import constants from '../constants/contractStations';
import GeoPoint from 'geopoint';
import moment from 'moment';

const initialState = {};

export default createReducer(initialState, {
    [constants.FETCH_CONTRACT_STATIONS_SUCCEED]: (state, { contractName, stations }) => {

        console.log("Found", stations.length, "matching contract name", contractName);

        stations.forEach(station => {
            if (!station.geoLocation) {
                station.geoLocation = new GeoPoint(station.position.lat, station.position.lng);
            }

            const paddedStationNumber = ("00000" + station.number).slice(-5);

            if (station.name.indexOf(paddedStationNumber + ' - ') === 0) {
                station.name = station.name.substring((paddedStationNumber + ' - ').length);
            }

        });

        const contracts = Object.assign({}, state);

        contracts[contractName] = Object.assign({}, contracts[contractName], {
            data: stations,
            isFetching: false,
            lastUpdate: moment(),
            err: undefined
        });

        return contracts;
    },
    [constants.FETCH_CONTRACT_STATIONS_REQUEST]: (state, { contractName }) => {

        const contracts = Object.assign({}, state);

        if (contracts[contractName]) {
            contracts[contractName] = Object.assign({}, contracts[contractName], {
                isFetching: true,
                err: undefined,
                search: undefined
            })
        } else {
            contracts[contractName] = {
                data: [],
                isFetching: true,
                err: undefined,
                lastUpdate: moment(0),
                search: undefined
            };
        }

        return contracts;
    },
    [constants.FETCH_CONTRACT_STATIONS_FAILED]: (state, { contractName, err }) => {

        const contracts = Object.assign({}, state);

        contracts[contractName] = Object.assign({}, contracts[contractName], {
            isFetching: false,
            err: err
        });

        return contracts;
    }
})
