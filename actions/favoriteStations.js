import constants from '../constants/favoriteStations'
import moment from 'moment';
import { notifyError } from './toast'
import * as StationService from '../services/StationService'
import * as StorageService from '../services/StorageService'


export function initFavoriteStations(dispatch) {
    dispatch(fetchFavoriteStations());
}

export function fetchFavoriteStationsSucceed(favoriteStations) {
    return {
        type: constants.FETCH_FAVORITE_STATIONS_SUCCEED,
        payload: favoriteStations
    };
}

export function fetchFavoriteStationsRequest() {
    return {
        type: constants.FETCH_FAVORITE_STATIONS_REQUEST
    }
}

export function fetchFavoriteStationsFailed(err) {
    return {
        type: constants.FETCH_FAVORITE_STATIONS_FAILED,
        payload: { err }
    }
}

export function addFavoriteStationSucceed(station) {
    return {
        type: constants.ADD_FAVORITE_STATION_SUCCEED,
        payload: station
    };
}

export function addFavoriteStationRequest(station) {
    return {
        type: constants.ADD_FAVORITE_STATION_REQUEST,
        payload: station
    }
}

export function addFavoriteStationFailed(err) {
    return {
        type: constants.ADD_FAVORITE_STATION_FAILED,
        payload: { err }
    }
}

export function removeFavoriteStationSucceed(station) {
    return {
        type: constants.REMOVE_FAVORITE_STATION_SUCCEED,
        payload: station
    };
}

export function removeFavoriteStationRequest(station) {
    return {
        type: constants.REMOVE_FAVORITE_STATION_REQUEST,
        payload: station
    };
}

export function removeFavoriteStationFailed(err, station) {
    return {
        type: constants.REMOVE_FAVORITE_STATION_FAILED,
        payload: { err, station }
    };
}

export function fetchFavoriteStations() {
    return (dispatch, state) => {
        dispatch(fetchFavoriteStationsRequest());

        return StorageService.fetchFavoriteStationNumbers().then((favoriteStationNumbers) => {
            console.log("favoriteStationNumbers:", favoriteStationNumbers);
            return StationService.fetchStationsByNumbers(favoriteStationNumbers);
        }).then((favoriteStations) => {
            console.log("favoriteStations:", favoriteStations);
            dispatch(fetchFavoriteStationsSucceed(favoriteStations));
        }).catch((err) => {

            console.error('[', moment().format('HH:mm:ss.SSS'), '][FavoriteStations][FetchFavoriteStations] Error:', err, 'Stack:', err.stack);

            dispatch(fetchFavoriteStationsFailed(err));
            dispatch(notifyError('Impossible de charger la liste des identifiants des stations favories', err.message));
        });
    }
}


export function addFavoriteStation(station) {
    return (dispatch, state) => {
        dispatch(addFavoriteStationRequest(station));

        return StorageService.addFavoriteStation(station).then(() => {
                dispatch(addFavoriteStationSucceed(station));
                dispatch(fetchFavoriteStations());
            }).catch((err) => {

            console.error('[', moment().format('HH:mm:ss.SSS'), '][FavoriteStations][AddFavoriteStation] Error:', err, 'Stack:', err.stack);

            dispatch(addFavoriteStationFailed(err, station));
            dispatch(notifyError('Impossible de charger la liste des identifiants des stations favories', err.message));
        });

    }
}


export function removeFavoriteStation(station) {
    return (dispatch, state) => {
        dispatch(removeFavoriteStationRequest(station));

        return StorageService.removeFavoriteStation(station).then(() => {
            dispatch(addFavoriteStationSucceed(station));
            dispatch(fetchFavoriteStations());
        }).catch((err) => {

            console.error('[', moment().format('HH:mm:ss.SSS'), '][FavoriteStations][RemoveFavoriteStation] Error:', err, 'Stack:', err.stack);

            dispatch(removeFavoriteStationFailed(err, station));
            dispatch(notifyError('Impossible de charger la liste des identifiants des stations favories', err.message));
        });

    }
}

