import React, { Component, PropTypes } from 'react';

import {
    Animated,
    AppRegistry,
    StyleSheet,
    Navigator,
    ScrollView,
    MapView,
    TouchableHighlight,
    TouchableOpacity,
    Text,
    View,
    Image,
    StatusBar
} from 'react-native';

import MapTabScene from './MapTabScene';
import StationDetailsScene from './stations/details/StationDetailsScene';

import Icon from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Spinner from 'react-native-spinkit';

import * as favoriteStationActionCreators from '../actions/favoriteStations'
import * as nearbyStationActionCreators from '../actions/nearbyStations'

class MapTab extends Component {

    static propTypes = {
        onTabIconPress: PropTypes.func,
        selectedTab: PropTypes.string
    };

    onFavoriteStarPress(station) {
        const favoriteStations = this.props.favoriteStations.data;

        if (favoriteStations.map(fs => fs.number).indexOf(station.number) >= 0) {
            this.props.actions.removeFavoriteStation(station);
        } else {
            this.props.actions.addFavoriteStation(station);
        }
    }

    onRefresh() {
        this.props.actions.fetchNearbyStationsFromCurrentRegion();
    }

    render() {
       return (
            <Icon.TabBarItemIOS
                title="Plan"
                iconName="ios-globe-outline"
                selectedIconName="ios-globe"
                selected={this.props.selectedTab === 'map'}
                onPress={this.props.onTabIconPress}
            >
                <View style={{ flex: 1 }}>
                    <StatusBar barStyle="light-content" networkActivityIndicatorVisible={this.props.nearbyStations.isFetching} />
                    {this.renderTab()}
                </View>
            </Icon.TabBarItemIOS>
        );
    }

    renderTab() {

        const favoriteStations = (this.props.favoriteStations || { data: []}).data;

        return (
            <Navigator
                ref="navigator"
                initialRoute={{id: 'Map', title: 'Plan' }}
                renderScene={(route, navigator) => {
                    if (route.id == 'StationDetails') {
                        return (
                            <StationDetailsScene ref="StationDetailsScene"
                                                 station={route.station}
                                                 geoLocation={this.props.geoLocation}
                                                 navigator={navigator}
                                                 route={route}
                                                 {...route.passProps}
                            />
                        );
                    } else if (route.id === 'Map') {
                        return (
                            <MapTabScene
                                navigator={navigator}
                            />
                        );
                    }
                }}
                style={{ flex: 1 }}
                navigationBar={
                    <Navigator.NavigationBar
                        routeMapper={{
                            LeftButton: (route, navigator, index, navState) => {
                                if(index > 0) {
                                    return (
                                        <View style={{ marginLeft: -4 }}>
                                            <TouchableHighlight underlayColor="transparent" onPress={() => { if (index > 0) { navigator.pop() } }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <EvilIcon name="chevron-left" size={48} color="white" style={{ width: 36, paddingTop: 2 }} />
                                                    <Text style={{ color: 'white' }}>Back</Text>
                                                </View>
                                            </TouchableHighlight>
                                        </View>)
                                }
                                else {
                                    return null;
                                }
                            },
                            RightButton: (route, navigator, index, navState) => {
                                if (route.id === 'StationDetails') {
                                    return (
                                        <View style={{paddingTop: 4, paddingRight: 12}}>
                                            <TouchableHighlight underlayColor="transparent" onPress={this.onFavoriteStarPress.bind(this, route.station)}>
                                                <Icon
                                                    name={ favoriteStations.map(fs => fs.number).indexOf(route.station.number) >= 0 ? 'ios-star' : 'ios-star-outline' }
                                                    size={32}
                                                    color="white" />
                                            </TouchableHighlight>
                                        </View>
                                    );
                                } else if (route.id === 'Map') {
                                    return (
                                        <View style={{
                                            paddingTop: !this.props.nearbyStations.isFetching ? 6 : 6,
                                            paddingRight: !this.props.nearbyStations.isFetching ? 16 : 8
                                        }}>
                                            <TouchableHighlight underlayColor="transparent" onPress={this.onRefresh.bind(this)}>
                                                <View>
                                                    { !this.props.nearbyStations.isFetching ?
                                                        <Icon
                                                            name="ios-refresh-outline"
                                                            size={32}
                                                            color="white" />
                                                        :
                                                        <Spinner
                                                            size={32}
                                                            type="Pulse"
                                                            color="#FFFFFF"
                                                        />
                                                    }
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    );
                                } else {
                                    return null;
                                }
                            },
                            Title: (route, navigator, index, navState) =>
                                <View style={{ paddingTop: 2 }}>
                                    <Image source={require('../images/commute-navbar-icon.png')} style={{ width: 32, height: 32 }}/>
                                </View>
                            ,
                        }}
                        style={{ backgroundColor: '#49b2d8' }}
                    />
                }
            />
        );
    }

}


const mapStateToProps = (state) => Object.assign({}, {
    favoriteStations: state.favoriteStations,
    nearbyStations: state.nearbyStations,
    geoLocation: state.location.geoLocation,
    map: state.map
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        Object.assign({}, favoriteStationActionCreators, nearbyStationActionCreators),
        dispatch
    )
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapTab);
