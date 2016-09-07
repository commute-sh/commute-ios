import { combineReducers } from 'redux';
import stations from './stations';
import toast from './toast';

export default combineReducers({
    stations,
    toast
});
