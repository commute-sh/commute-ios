import { combineReducers } from 'redux';
import stations from './stations';
import favoriteStations from './favoriteStations';
import location from './location';
import toast from './toast';

export default combineReducers({
    stations,
    favoriteStations,
    location,
    toast
});
