import moment from 'moment';

export async function getStationsNearby(position, distance = 1000, city = 'Paris') {
    try {

        const start = moment();
        let url = `http://api.commute.sh/stations/nearby?lat=${position.latitude}&lng=${position.longitude}&distance=${distance}&city=${city}`;

        console.log('Get Stations Nearby URL:', url);

        let response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });
        var stations = await response.json();

//        var stations = require('../data/stations.json');

        const duration = moment.duration(moment().diff(start)).milliseconds();

        console.log("*** Stations loaded in", duration, "ms");
//        console.log("*** Stations", stations);

        return stations;
    } catch(error) {
        console.debug(error);
        throw error;
    }
}
