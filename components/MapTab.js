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
    Image
} from 'react-native';

import MapTabScene from './MapTabScene';
import StationDetailsScene from './StationDetailsScene';

import Icon from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as favoriteStationActionCreators from '../actions/favoriteStations'
import * as nearbyStationActionCreators from '../actions/nearbyStations'

class MapTab extends Component {

    static propTypes = {
        selectedTab: PropTypes.string,
        onPress: PropTypes.func
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
        const favoriteStations = (this.props.favoriteStations || { data: []}).data;

        return (
            <Icon.TabBarItemIOS
                title="Plan"
                iconName="ios-globe-outline"
                selectedIconName="ios-globe"
                selected={this.props.selectedTab === 'map'}
                onPress={this.props.onPress}
            >
                <Navigator
                    initialRoute={{id: 'Map', title: 'Plan' }}
                    renderScene={(route, navigator) => {
                        if (route.id == 'StationDetails') {
                            return (
                                <StationDetailsScene ref="StationDetailsScene"
                                    station={route.station}
                                    navigator={navigator}
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
                                    if (route.id ===  'StationDetails') {
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
                                            <View style={{paddingTop: 6, paddingRight: 16}}>
                                                <TouchableHighlight underlayColor="transparent" onPress={this.onRefresh.bind(this)}>
                                                    <Icon
                                                        name="ios-refresh-outline"
                                                        size={32}
                                                        color="white" />
                                                </TouchableHighlight>
                                            </View>
                                        );
                                    } else {
                                        return null;
                                    }
                                },
                                Title: (route, navigator, index, navState) =>
                                    <View style={{ paddingTop: 2 }}>
                                        <Image source={require('../images/commute-icon.png')} style={{ width: 32, height: 32 }}/>
                                    </View>
                                ,
                            }}
                            style={{ backgroundColor: '#325d7a' }}
                        />
                    }
                />

            </Icon.TabBarItemIOS>
        );
    }

}


const mapStateToProps = (state) => Object.assign({}, {
    favoriteStations: state.favoriteStations,
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
