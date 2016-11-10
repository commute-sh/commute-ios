import moment from 'moment';
import axios from 'axios';
import Promise from 'bluebird';

//const apiBaseUrl = `http://192.168.4.10:3001`;
// const apiBaseUrl = `http://172.20.10.2:3001`;
 const apiBaseUrl = `http://api.commute.sh`;

export function fetchStationsByContractName(contractName) {

    const start = moment();
    let url = `${apiBaseUrl}/stations?contract-name=${contractName}`;

    console.log('[', start.format('HH:mm:ss.SSS'), '][StationService][FetchStationsByContractName] Get Stations Nearby URL:', url);

    return axios.get(url, {
        timeout: 30000,
        headers: { 'Accept': 'application/json' }
    }).then(response => {

        let data = response.data;

        if (data === "The request timed out.") {
            throw new Error(data);
        }

        let stations = data;

        const end = moment();
        const duration = moment.duration(end.diff(start)).asMilliseconds();

        console.log('[', end.format('HH:mm:ss.SSS'), '][StationService][FetchStationsByContractName] Status: ', response.status, ' - Stations loaded in', duration, "ms");

        return stations;
    });
}

export function fetchStationsByNumbers(stationNumbers) {

    if (stationNumbers.length === 0) {
        return Promise.resolve([]);
    }

    const start = moment();
    let url = `${apiBaseUrl}/stations?numbers=${stationNumbers.join(',')}`;

    console.log('[', start.format('HH:mm:ss.SSS'), '][StationService][FetchStationsByNumbers] Get Stations Nearby URL:', url);

    return axios.get(url, {
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    }).then(response => {

        let data = response.data;

        if (data === "The request timed out.") {
            throw new Error(data);
        }

        let stations = data;

        const end = moment();
        const duration = moment.duration(end.diff(start)).asMilliseconds();

        console.log('[', end.format('HH:mm:ss.SSS'), '][StationService][FetchStationsByNumbers] Status: ', response.status, ' - Stations loaded in', duration, "ms");

        return stations;
    });
}

export function fetchStationsNearby(position, distance = 1000, contractName = 'Paris') {

    const start = moment();
    let url = `${apiBaseUrl}/stations/nearby?lat=${position.latitude}&lng=${position.longitude}&distance=${distance}&city=${contractName}`;

    console.log('[', start.format('HH:mm:ss.SSS'), '][StationService][FetchStationsNearby] Get Stations Nearby URL:', url);

    return axios.get(url, {
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
        }
    }).then(response => {

        let data = response.data;

        if (data === "The request timed out.") {
            throw new Error(data);
        }

        let stations = data;

        const end = moment();
        const duration = moment.duration(end.diff(start)).asMilliseconds();

        console.log('[', end.format('HH:mm:ss.SSS'), '][StationService][FetchStationsNearby] Status: ', response.status, ' - Stations loaded in', duration, "ms");

        return stations;
    });
}


export function fetchDataByDateAndStationNumber(contractName, date, stationNumber) {

    const start = moment();
    const targetDate = date.subtract(1, 'days');
    let url = `${apiBaseUrl}/stations/${contractName}/${stationNumber}/availability/${targetDate.format('YYYYMMDD-HHmm')}`;

    console.log('[', start.format('HH:mm:ss.SSS'), '][StationService][FetchDataByDateAndStationNumber] Get Data for station:', stationNumber, ', contract name:', contractName, ', Nearby URL:', url);

    return axios.get(url, {
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
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
//        console.log("*** Data:", data);

        return data;
    });
}
