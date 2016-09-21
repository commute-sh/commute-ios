import moment from 'moment';
import axios from 'axios';


export function fetchStationsByNumbers(stationNumbers) {

    const start = moment();
    let url = `http://api.commute.sh/stations?numbers=${stationNumbers}`;

    console.log('[', start.format('HH:mm:ss.SSS'), '][StationService][FetchStationsByNumbers] Get Stations Nearby URL:', url);

    return axios.get(url, {
        timeout: 30000,
        headers: { 'Accept': 'application/json' }
    }).then(response => {

        let data = response.data;

//        let stations = response.data.filter(station => [44101, 12128, 43401].includes(station.number));
//        var stations = require('../data/stations.json');

        if (data === "The request timed out.") {
            throw new Error(data);
        }

        let stations = data;

        const end = moment();
        const duration = moment.duration(end.diff(start)).asMilliseconds();

        console.log('[', end.format('HH:mm:ss.SSS'), '][StationService][FetchStationsByNumbers] Status: ', response.status, ' - Stations loaded in', duration, "ms");
//        console.log("*** Stations", stations);

        return stations;
    });
}

export function fetchStationsNearby(position, distance = 1000, contractName = 'Paris') {

    const start = moment();
    let url = `http://api.commute.sh/stations/nearby?lat=${position.latitude}&lng=${position.longitude}&distance=${distance}&city=${contractName}`;

    console.log('[', start.format('HH:mm:ss.SSS'), '][StationService][FetchStationsNearby] Get Stations Nearby URL:', url);

    return axios.get(url, {
        timeout: 30000,
        headers: { 'Accept': 'application/json' }
    }).then(response => {

        let data = response.data;

//        let stations = response.data.filter(station => [44101, 12128, 43401].includes(station.number));
//        var stations = require('../data/stations.json');

        if (data === "The request timed out.") {
            throw new Error(data);
        }

        let stations = data;

        const end = moment();
        const duration = moment.duration(end.diff(start)).asMilliseconds();

        console.log('[', end.format('HH:mm:ss.SSS'), '][StationService][FetchStationsNearby] Status: ', response.status, ' - Stations loaded in', duration, "ms");
//        console.log("*** Stations", stations);

        return stations;
    });
}


export function fetchDataByDateAndStationNumber(contractName, date, stationNumber) {

    const start = moment();
    const targetDate = date.subtract(1, 'days');
    let url = `http://api.commute.sh/stations/${contractName}/${stationNumber}/${targetDate.format('YYYYMMDD-HHmm')}/data`;

    console.log('[', start.format('HH:mm:ss.SSS'), '][StationService][FetchDataByDateAndStationNumber] Get Data for station:', stationNumber, ', contract name:', contractName, ', Nearby URL:', url);

    return axios.get(url, {
        timeout: 30000,
        headers: {
            'Accept': 'application/json'
        },
        validateStatus: function (status) {
            return status >= 200 && status < 300; // default
        }
    }).then(response => {

        let data = response.data;

        if (data === "The request timed out.") {
            throw new Error(data);
        }

        const end = moment();
        const duration = moment.duration(end.diff(start)).asMilliseconds();

        console.log('[', end.format('HH:mm:ss.SSS'), '][StationService][FetchDataByDateAndStationNumber] Status: ', response.status, ' - Data loaded in', duration, "ms");
        console.log("*** Data:", data);

        return data;
    });
}
