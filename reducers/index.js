import { combineReducers } from 'redux';
import nearbyStations from './nearbyStations';
import contract from './contract';
import contractStations from './contractStations';
import favoriteStations from './favoriteStations';
import location from './location';
import toast from './toast';
import map from './map';

export default combineReducers({
    nearbyStations,
    contractStations,
    favoriteStations,
    location,
    contract,
    toast,
    map
});
