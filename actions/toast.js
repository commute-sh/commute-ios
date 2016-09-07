import constants from '../constants/toast'

export function showToast(title, message, type) {
    return {
        type: constants.SHOW_TOAST,
        payload: { title, message, type }
    }
}

export function hideToast() {
    return {
        type: constants.HIDE_TOAST,
        payload: { }
    }
}

export function notifyError(title, errMessage) {
    return notifyMessage(title, errMessage, 'ERROR');
}

export function notifyMessage(title, message, type, timeout = 2000) {

    console.log('Calling toast with message:"', message, '", title: "', title, '" and type:', type);

    return (dispatch, state) => {
        dispatch(showToast(title, message, type));
        setTimeout(() => {
            dispatch(hideToast());
        }, timeout);
    };
}
