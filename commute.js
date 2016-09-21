import React, { Component, PropTypes } from 'react';

import {
    Animated,
    AppRegistry,
    StyleSheet,
    NavigatorIOS,
    Navigator,
    TabBarIOS,
    ScrollView,
    MapView,
    TouchableHighlight,
    TouchableOpacity,
    Text,
    View,
    Image,
    Dimensions,
    NetInfo
} from 'react-native';

import MapTab from './components/MapTab';
import FavoriteTab from './components/FavoritesTab';
import SearchTab from './components/SearchTab';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as toastActionCreators from './actions/toast'
import * as stationActionCreators from './actions/stations'

import { initGeoLocation, disposeGeoLocation } from './actions/location';
import { initFavoriteStations } from './actions/favoriteStations';
import { fetchStations } from './actions/stations';

import moment from 'moment';

let windowHeight = Dimensions.get('window').height;

class Commute extends Component {

    constructor(props) {
        super(props);

        this.animatedValue = new Animated.Value(0);

        this.state = {
            selectedTab: 'map'
        };
    }

    componentWillMount() {

        const { dispatch } = this.props;
        initFavoriteStations(dispatch);
        this.watchID = initGeoLocation(dispatch);

        const self = this;

        NetInfo.addEventListener('change', (reach) => {
            console.log('[Commute] Net state change: ' + reach);

            if (!self.props.stations.isFetching && reach !== 'none' && self.props.location.position && moment(self.props.stations.lastUpdate).add(5, 'minutes').isBefore(moment())) {
                console.log("[Commute] Loading stations as last update (", self.props.stations.lastUpdate.format('YYYY-MM-dd HH:mm:ss'), ") was at least 5 minutes before now and server is reachable");
                dispatch(fetchStations(self.props.location.position));
            } else {
                if (self.props.stations.isFetching) {
                    console.log("[Commute] Does not attempt to load stations as app is already fetching stations");
                } else if (reach === 'none') {
                    console.log("[Commute] Does not attempt to load stations as device is offline");
                } else if (!self.props.location.position) {
                    console.log("[Commute] Does not attempt to load stations as position is not currently known");
                } else {
                    console.log("[Commute] Does not attempt to load stations as last update (", self.props.stations.lastUpdate.format('YYYY-MM-dd HH:mm:ss'), ") is not at least 5 minutes before now");
                }
            }
        });
    }

    componentWillUnmount() {
        disposeGeoLocation(this.watchID);
    }

    onTabIconPress(selectedTab) {
        this.setState({ selectedTab: selectedTab });
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.stations && nextProps.stations.modalShown !== this.props.modalShown) {
            if (this.props.modalShown) {
                Animated.timing(this.animatedValue, { toValue: 1, duration: 350 }).start(/*() => {
                    setTimeout(this.props.toast.hideToast, 2000);
                }*/);

            } else {
                Animated.timing(this.animatedValue, { toValue: 0, duration: 350 }).start();
            }
        }
    }

    static getToastBackgroundColor(type) {
        // INFO
        let color = '#2980b9';

        if (type == 'ERROR') {
            color = '#e74c3c';
        } else if (type == 'WARNING') {
            color = '#f39c12';
        }

        return color;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderTabs()}
                {this.props.toast.modalShown && this.renderToast()}
            </View>
        );
    }

    renderTabs() {
        return (
            <TabBarIOS style={{ zIndex: 1 }}>
                <MapTab selectedTab={this.state.selectedTab} onPress={this.onTabIconPress.bind(this, 'map')} />
                <FavoriteTab selectedTab={this.state.selectedTab} onPress={this.onTabIconPress.bind(this, 'favorites')} />
                <SearchTab selectedTab={this.state.selectedTab} onPress={this.onTabIconPress.bind(this, 'search')} />
            </TabBarIOS>
        );
    }

    renderToast() {

        let animation = this.animatedValue.interpolate({
            inputRange: [0, .3, 1],
            outputRange: [70, 10, 0]
        });

        let messagePrefix = 'Info';

        if (this.state.toast.type == 'ERROR') {
            messagePrefix = 'Erreur';
        }

        return (
            <Animated.View  style={{
                zIndex: 2,
                transform: [{ translateY: animation }],
                height: 70,
                backgroundColor: Commute.getToastBackgroundColor(this.props.toast.type),
                position: 'absolute',
                left: 0,
                top: windowHeight - 70,
                right: 0,
                justifyContent:  'center'
            }}>
                <Text style={{ marginLeft: 10,  color: 'white',  fontSize: 16, fontWeight: '500', fontFamily: 'System'  }}>
                    { this.state.toast.title }
                </Text>
                <Text style={{ marginLeft: 10,  color: 'white',  fontSize: 12, fontWeight: '300', fontFamily: 'System' }}>
                    { messagePrefix }: { this.state.toast.message }
                </Text>
            </Animated.View>
        );
    }

}

const mapStateToProps = (state) => Object.assign({}, {
    toast: state.toast,
    location: state.location,
    stations: state.stations
});

const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch,
    actions: bindActionCreators(
        Object.assign({}, toastActionCreators, stationActionCreators),
        dispatch
    )
});

export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(Commute);
