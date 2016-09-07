import { createReducer } from '../utils';
import constants from '../constants/toast';

const initialState = {
    modalShown: false,
    title: undefined,
    message: undefined,
    type: 'INFO'
};

export default createReducer(initialState, {
    [constants.SHOW_TOAST]: (state, { title, message, type }) => {
        return Object.assign({}, state, { modalShown: true, title, message, type });
    },
    [constants.HIDE_TOAST]: (state) => {
        return Object.assign({}, state, { modalShown: false, title: undefined, message: undefined, type: undefined });
    }
})
