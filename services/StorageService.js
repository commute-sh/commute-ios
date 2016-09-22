import moment from 'moment';
import { AsyncStorage } from 'react-native'

const FAVORITE_STATIONS = 'FAVORITE_STATIONS';

export function fetchFavoriteStationNumbers() {

    const start = moment();

    return AsyncStorage.getItem(FAVORITE_STATIONS).then(favoriteStationNumbersStr => {
        console.log("favoriteStationNumbersStr:", favoriteStationNumbersStr);
        const favoriteStationNumbers = JSON.parse(favoriteStationNumbersStr || '[]');

        console.log('[', moment().format('HH:mm:ss.SSS'), '][StorageService][FetchFavoriteStations] Favorite stations:', favoriteStationNumbers);

        const end = moment();
        const duration = moment.duration(end.diff(start)).asMilliseconds();

        console.log('[', moment().format('HH:mm:ss.SSS'), '][StorageService][FetchFavoriteStations] Favorite stations loaded in', duration, "ms");
//        console.log("*** Stations", stations);

        return favoriteStationNumbers.filter(fsn => fsn);
    })
}

export function addFavoriteStation(station) {

    const start = moment();

    console.log('[', moment().format('HH:mm:ss.SSS'), '][StorageService][AddFavoriteStation] Get Favorite Station Numbers');

    return AsyncStorage.getItem(FAVORITE_STATIONS).then(favoriteStationNumbersStr => {

        const favoriteStationNumbers = JSON.parse(favoriteStationNumbersStr || '[]');

        favoriteStationNumbers.push(station.number);

        return AsyncStorage.setItem(FAVORITE_STATIONS, JSON.stringify(favoriteStationNumbers)).then(() => {

            const end = moment();
            const duration = moment.duration(end.diff(start)).asMilliseconds();

            console.log('[', moment().format('HH:mm:ss.SSS'), '][StorageService][AddFavoriteStation] Favorite station added in', duration, "ms");
            // console.log("*** Stations", stations);
        });
    });
}

export function removeFavoriteStation(station) {

    const start = moment();

    console.log('[', moment().format('HH:mm:ss.SSS'), '][StorageService][RemoveFavoriteStation] Get Favorite Station Numbers');

    return AsyncStorage.getItem(FAVORITE_STATIONS).then(favoriteStationNumbersStr => {

        const favoriteStationNumbers = JSON.parse(favoriteStationNumbersStr || '[]');

        const offset = favoriteStationNumbers.indexOf(station.number);
        if (offset >= 0) {
            favoriteStationNumbers.splice(offset, 1);
        }

        return AsyncStorage.setItem(FAVORITE_STATIONS, JSON.stringify(favoriteStationNumbers)).then(() => {

            const end = moment();
            const duration = moment.duration(end.diff(start)).asMilliseconds();

            console.log('[', moment().format('HH:mm:ss.SSS'), '][StorageService][RemoveFavoriteStation] Favorite stations removed in', duration, "ms");
            // console.log("*** Stations", stations);
        });
    });
}
