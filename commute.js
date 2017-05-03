import React, {Component, PropTypes} from 'react';

import {
    Animated,
    Text,
    View,
    Image,
    Dimensions,
    NetInfo
} from 'react-native';

import Root from './components/Root';

import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

import * as toastActionCreators from './actions/toast'
import * as nearbyStationActionCreators from './actions/nearbyStations'

import {initGeoLocation, disposeGeoLocation} from './actions/location';
import {initFavoriteStations} from './actions/favoriteStations';
import {initContractStations} from './actions/contractStations';
import {fetchNearbyStations} from './actions/nearbyStations';

import OneSignal from 'react-native-onesignal';

import moment from 'moment';

import { getToastBackgroundColor } from './utils/Toast';

let windowHeight = Dimensions.get('window').height;

class Commute extends Component {


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Instances variables
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    animatedValue = new Animated.Value(0);


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    constructor(props) {
        super(props);

        this.lastUpdateTooOld = this.lastUpdateTooOld.bind(this);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Lifecycle
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    componentWillMount() {

        const { dispatch } = this.props;

        initFavoriteStations(dispatch);
        initContractStations(dispatch, 'Paris');

        this.watchID = initGeoLocation(dispatch);

        NetInfo.addEventListener('change', this.onReachabilityChanged.bind(this));

        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);
    }

    componentWillUnmount() {
        OneSignal.addEventListener('received', this.onReceived);
        OneSignal.addEventListener('opened', this.onOpened);
        OneSignal.addEventListener('registered', this.onRegistered);
        OneSignal.addEventListener('ids', this.onIds);

        disposeGeoLocation(this.watchID);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.nearbyStations && nextProps.nearbyStations.modalShown !== this.props.modalShown) {
            if (this.props.modalShown) {
                Animated.timing(this.animatedValue, {toValue: 1, duration: 350}).start(/*() => {
                 setTimeout(this.props.toast.hideToast, 2000);
                 }*/);

            } else {
                Animated.timing(this.animatedValue, {toValue: 0, duration: 350}).start();
            }
        }
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Events
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    onReachabilityChanged(reach) {
        console.log(`[Commute] Net state change: ${reach}`);

        if (this.props.nearbyStations.isFetching) {
            console.log("[Commute] Does not attempt to load stations as app is already fetching stations");
            return ;
        }

        if (reach === 'none') {
            console.log("[Commute] Does not attempt to load stations as device is offline");
            return ;
        }

        if (!this.props.location.position || !this.props.location.position.coords) {
            console.log("[Commute] Does not attempt to load stations as position is not currently known");
            return ;
        }

        const lastUpdateFormatted = this.props.nearbyStations.lastUpdate.format('YYYY-MM-dd HH:mm:ss');

        if (!this.lastUpdateTooOld()) {
            console.log(`[Commute] Does not attempt to load stations as last update (${lastUpdateFormatted}) is not at least 5 minutes before now`);
            return ;
        }

        console.log(`[Commute] Loading stations as last update (${lastUpdateFormatted}) was at least 5 minutes before now and server is reachable`);
        this.props.dispatch(fetchNearbyStations(this.props.location.position.coords));
    }

    onReceived(notification) {
        console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
    }

    onRegistered(notifData) {
        console.log("Device had been registered for push notifications!", notifData);
    }

    onIds(device) {
        console.log('Device info: ', device);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Render
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    render() {
        return (
            <View style={{flex: 1}}>
                <Root />
                {this.props.toast.modalShown && this.renderToast()}
            </View>
        );
    }

    renderToast() {

        let animation = this.animatedValue.interpolate({
            inputRange: [0, .3, 1],
            outputRange: [70, 10, 0]
        });

        let messagePrefix = 'Info';

        if (this.props.toast.type === 'ERROR') {
            messagePrefix = 'Erreur';
        }

        return (
            <Animated.View style={{
                zIndex: 2,
                transform: [{translateY: animation}],
                height: 70,
                backgroundColor: getToastBackgroundColor(this.props.toast.type),
                position: 'absolute',
                left: 0,
                top: windowHeight - 70,
                right: 0,
                justifyContent: 'center'
            }}>
                <Text style={{marginLeft: 10, color: 'white', fontSize: 16, fontWeight: '500', fontFamily: 'System'}}>
                    { this.props.toast.title }
                </Text>
                <Text style={{marginLeft: 10, color: 'white', fontSize: 12, fontWeight: '300', fontFamily: 'System'}}>
                    { messagePrefix }: { this.props.toast.message }
                </Text>
            </Animated.View>
        );
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Utils
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    lastUpdateTooOld() {
        return moment(this.props.nearbyStations.lastUpdate).add(5, 'minutes').isBefore(moment());
    }

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Redux
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = (state) => Object.assign({}, {
    toast: state.toast,
    location: state.location,
    nearbyStations: state.nearbyStations
});

const mapDispatchToProps = (dispatch) => ({
    dispatch,
    actions: bindActionCreators(
        Object.assign({}, toastActionCreators, nearbyStationActionCreators),
        dispatch
    )
});

export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(Commute);
