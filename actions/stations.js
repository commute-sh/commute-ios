import constants from '../constants/stations'
import * as StationService from '../services/StationService'
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
        StationService.fetchStationsNearby(position, distance, contractName).then((stations) => {
            dispatch(receiveStations(stations, position, distance, contractName));
        }).catch((err) => {
            console.error('Error:', err, 'Stack:', err.stack);

            let errorMessage = err.message;

            if (err.name === 'TypeError' && err.message === "Network request failed") {
                errorMessage = 'Pas de connectivité réseau.';
            } else if (err.message === "The request timed out.") {
                errorMessage = 'La requête a expiré';
            }

            dispatch(fetchStationsFailed(err));
            dispatch(notifyError('Impossible de charger la liste des stations', errorMessage));
        });
    }
}
