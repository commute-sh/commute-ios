import { combineReducers } from 'redux';
import stations from './stations';
import location from './location';
import toast from './toast';

export default combineReducers({
    stations,
    location,
    toast
});
