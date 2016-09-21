import _ from 'lodash'

export function createReducer (initialState, reducerMap) {

    return (state = initialState, action) => {

        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(_.isFunction(state) ? state() : state, action.payload)
            : (_.isFunction(state) ? state() : state);
    }
}

export function  getColor (items) {

    let pinColor = '#2ecc71';

    if (items === 0) {
        pinColor = '#e74c3c';
    } else if (items <= 3) {
        pinColor = '#d35400';
    } else if (items <= 5) {
        pinColor = '#f39c12';
    }

    return pinColor;
}

