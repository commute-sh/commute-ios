import { createReducer } from '../utils/Reducers';
import constants from '../constants/favoriteStations';

const initialState = {
    data: [],
    isFetching: false,
    err: undefined
};

export default createReducer(initialState, {
    [constants.FETCH_FAVORITE_STATIONS_SUCCEED]: (state, payload) => {
        return Object.assign({}, state, {
            data: payload,
            isFetching: false,
            err: undefined
        })
    },
    [constants.FETCH_STATIONS_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            isFetching: true,
            err: undefined
        })
    },
    [constants.FETCH_STATIONS_FAILED]: (state, payload) => {
        return Object.assign({}, state, {
            isFetching: false,
            err: payload.err
        })
    }
})
