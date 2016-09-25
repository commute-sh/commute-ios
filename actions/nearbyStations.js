import constants from '../constants/nearbyStations'
import * as StationService from '../services/StationService'
import { notifyError } from './toast'

export function fetchNearbyStationsSucceed(search, stations) {
    return {
        type: constants.FETCH_NEARBY_STATIONS_SUCCEED,
        payload: { search, stations }
    };
}

export function fetchNearbyStationsRequest(search) {
    return {
        type: constants.FETCH_NEARBY_STATIONS_REQUEST,
        payload: { search }
    }
}

export function fetchNearbyStationsFailed(search, err) {
    return {
        type: constants.FETCH_NEARBY_STATIONS_FAILED,
        payload: { search, err }
    }
}

export function fetchNearbyStations(position, distance = 1000, contractName = 'Paris') {

    const search = { position, distance, contractName };

    return (dispatch, state) => {
        dispatch(fetchNearbyStationsRequest(search));
        StationService.fetchStationsNearby(position, distance, contractName).then((stations) => {
            dispatch(fetchNearbyStationsSucceed(search, stations));
        }).catch((err) => {
            console.error('Error:', err, 'Stack:', err.stack);

            let errorMessage = err.message;

            if (err.name === 'TypeError' && err.message === "Network request failed") {
                errorMessage = 'Pas de connectivité réseau.';
            } else if (err.message === "The request timed out.") {
                errorMessage = 'La requête a expiré';
            }

            dispatch(fetchNearbyStationsFailed(search, err));
            dispatch(notifyError('Impossible de charger la liste des stations', errorMessage));
        });
    }
}
