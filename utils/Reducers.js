import _ from 'lodash'

export function createReducer (initialState, reducerMap) {
    return (state = initialState, action) => {

        const reducer = reducerMap[action.type];

        return reducer
            ? reducer(_.isFunction(state) ? state() : state, action.payload)
            : (_.isFunction(state) ? state() : state);
    }
}
