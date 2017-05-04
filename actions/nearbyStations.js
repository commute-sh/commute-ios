import constants from '../constants/nearbyStations'
import * as StationService from '../services/StationService'
import { notifyError } from './toast'
import _ from 'lodash'

import { computeRegionRadiusInMeters } from '../utils/Region'

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

export function fetchNearbyStationsFromCurrentRegion() {
    return (dispatch, state) => {
        const currentState = state();
        if (currentState.location.position) {
            console.log('[Actions][NearbyStations][fetchNearbyStationsFromCurrentRegion] currentState.location.position:', currentState.location.position);
            const position = currentState.location.position.coords;
            const distance = computeRegionRadiusInMeters(currentState.map.region);
            dispatch(fetchNearbyStations(position, 1000, 'Paris', 100, true));
        } else {
            console.log('[Actions][NearbyStations][fetchNearbyStationsFromCurrentRegion] No currentState.location.position');
            dispatch(fetchNearbyStations({ latitude: currentState.map.region.latitude, longitude: currentState.map.region.longitude }, 1000, 'Paris', 100, true));
        }
    };
}

export function fetchNearbyStations(position, distance = 1000, contractName = 'Paris', limit = -1, forceRefresh = false) {

    const search = { position, distance, contractName };

    return (dispatch, state) => {

        const currentState = state();

//        console.log('state:', currentState);

        const currentPosition = {
            latitude: position.latitude.toFixed(3),
            longitude: position.longitude.toFixed(3)
        };

        if (!forceRefresh && _.isEqual(currentPosition, currentState.location.lastPosition) && (distance / 100).toFixed(0) === (currentState.location.lastDistance / 100).toFixed(0)) {
            console.info('Current position did not changed:', currentPosition, 'with distance:', distance, '~=', currentState.location.lastDistance);
            return;
        }

        if (state().nearbyStations.isFetching) {
            console.log("Nearby Stations are already fetching - Avoid new call ...");
            return;
        }

        dispatch(fetchNearbyStationsRequest(search));
        StationService.fetchStationsNearby(position, distance, contractName, limit).then((stations) => {
            dispatch(fetchNearbyStationsSucceed(search, stations));
        }).catch((err) => {
            console.debug('Error:', err, 'Stack:', err.stack);

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
