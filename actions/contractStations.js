import constants from '../constants/contractStations'
import * as StationService from '../services/StationService'
import { notifyError } from './toast'

export function initContractStations(dispatch, contractName) {
    dispatch(fetchContractStations(contractName));
}

export function fetchContractStationsRequest(contractName) {
    return {
        type: constants.FETCH_CONTRACT_STATIONS_REQUEST,
        payload: { contractName }
    }
}

export function fetchContractStationsFailed(contractName, err) {
    return {
        type: constants.FETCH_CONTRACT_STATIONS_FAILED,
        payload: { contractName, err }
    }
}

export function fetchContractStationsSucceed(contractName, stations) {
    return {
        type: constants.FETCH_CONTRACT_STATIONS_SUCCEED,
        payload: { contractName, stations }
    };
}

export function fetchContractStations(contractName = 'Paris') {

    const search = { contractName };

    return (dispatch, state) => {
        dispatch(fetchContractStationsRequest(contractName));
        StationService.fetchStationsByContractName(contractName).then((stations) => {
            dispatch(fetchContractStationsSucceed(contractName, stations));
        }).catch((err) => {
            console.debug('Error:', err, 'Stack:', err.stack);

            let errorMessage = err.message;

            if (err.name === 'TypeError' && err.message === "Network request failed") {
                errorMessage = 'Pas de connectivité réseau.';
            } else if (err.message === "The request timed out.") {
                errorMessage = 'La requête a expiré';
            }

            dispatch(fetchContractStationsFailed(contractName, err));
            dispatch(notifyError('Impossible de charger la liste des stations', errorMessage));
        });
    }
}
