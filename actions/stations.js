import constants from '../constants/stations'
import moment from 'moment';
import axios from 'axios';
import { notifyError } from './toast'

export function receiveStations(stations, position, distance, contractName) {
    return {
        type: constants.RECEIVE_STATIONS,
        payload: { stations, position, distance, contractName }
    };
}

export function fetchStationsRequest(search) {
    return {
        type: constants.FETCH_STATIONS_REQUEST,
        payload: { search }
    }
}

export function fetchStationsFailed(err) {
    return {
        type: constants.FETCH_STATIONS_FAILED,
        payload: { err }
    }
}

export function fetchStations(position, distance = 1000, contractName = 'Paris') {
    return (dispatch, state) => {
        dispatch(fetchStationsRequest({ position, distance, contractName }));

        const start = moment();
        let url = `http://api.commute.sh/stations/nearby?lat=${position.latitude}&lng=${position.longitude}&distance=${distance}&city=${contractName}`;

        console.log('[', start.format('HH:mm:ss.SSS'), '][StationService] Get Stations Nearby URL:', url);

        return axios.get(url, {
            timeout: 30000,
            headers: { 'Accept': 'application/json' }
        }).then(response => {

            let data = response.data;

//        let stations = response.data.filter(station => [44101, 12128, 43401].includes(station.number));
//        var stations = require('../data/stations.json');

            if (data === "The request timed out.") {
                dispatch(fetchStationsFailed(new Error(data)))
            }

            let stations = data;

            const end = moment();
            const duration = moment.duration(end.diff(start)).asMilliseconds();

            console.log('[', end.format('HH:mm:ss.SSS'), '][StationService][Nearby] Status: ', response.status, ' - Stations loaded in', duration, "ms");
//        console.log("*** Stations", stations);

            dispatch(receiveStations(stations, position, distance, contractName));
        }).catch((err) => {

            console.error('Error:', err, 'Stack:', err.stack);

            let errorMessage = err.message;

            if (err.name === 'TypeError' && err.message === "Network request failed") {
                errorMessage = 'Pas de connectivité réseau.';
            }


            dispatch(fetchStationsFailed(err));
            dispatch(notifyError('Impossible de charger la liste des stations', errorMessage));
        });

    }
}

