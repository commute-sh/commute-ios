import moment from 'moment';
import axios from 'axios';

export function fetchDataByDateAndStationNumber(contractName, date, stationNumber) {

    const start = moment();
    const targetDate = date.subtract(1, 'days');
    let url = `http://api.commute.sh/stations/${contractName}/${stationNumber}/${targetDate.format('YYYYMMDD-HHmm')}/data`;

    console.log('[', start.format('HH:mm:ss.SSS'), '][StationService] Get Data for station:', stationNumber, ', contract name:', contractName, ', Nearby URL:', url);

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
