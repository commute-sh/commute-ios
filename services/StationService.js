import moment from 'moment';
import axios from 'axios';


export function getStationsNearby(position, distance = 1000, city = 'Paris') {

    const start = moment();
    let url = `http://api.commute.sh/stations/nearby?lat=${position.latitude}&lng=${position.longitude}&distance=${distance}&city=${city}`;

    console.log('[', start.format('HH:mm:ss.SSS'), '][StationService] Get Stations Nearby URL:', url);

    return axios.get(url, {
        timeout: 5000,
        headers: {
            'Accept': 'application/json'
        },
        validateStatus: function (status) {
            return status >= 200 && status < 300; // default
        }
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

        console.log('[', end.format('HH:mm:ss.SSS'), '][StationService] Status: ', response.status, ' - Stations loaded in', duration, "ms");
//        console.log("*** Stations", stations);

        return stations;
    });
}
