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
    Image
} from 'react-native';

import _ from 'lodash';

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import SearchTabScene from './SearchTabScene';
import FavoriteStationsTabScene from './FavoriteStationsTabScene';
import MapTabScene from './MapTabScene';

import StationDetailsScene from './stations/details/StationDetailsScene';

import Icon from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as favoriteStationActionCreators from '../actions/favoriteStations'
import * as nearbyStationActionCreators from '../actions/nearbyStations'

class Root extends Component {

    constructor(props) {
        super(props);

        this.state = { currentPage: 0 };
    }

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

    onChangeTab(event) {
        console.log(`onChangeTab: [index: ${event.i}, ref:${event.ref}]`);
        this.setState({ currentPage: event.i });
    }

    renderTabs(route, navigator) {
        return (
            <ScrollableTabView
                style={{ marginTop: 56 }}
                initialPage={0}
                tabBarBackgroundColor="white"
                tabBarActiveTextColor="#49b2d8"
                tabBarInactiveTextColor="#49b2d8"
                onChangeTab={this.onChangeTab.bind(this)}
                renderTabBar={() => <DefaultTabBar underlineStyle={{ backgroundColor: '#49b2d8' }} tabStyle={{ height: 56 }} />}
            >
                <MapTabScene tabLabel='Plan' navigator={navigator} />
                <FavoriteStationsTabScene tabLabel='Favoris' navigator={navigator} />
                <SearchTabScene tabLabel='Recherche' navigator={navigator} />
            </ScrollableTabView>
        );
    }


    render() {

        const navigationStyles = _.cloneDeep(Navigator.NavigationBar.StylesAndroid);
        navigationStyles.Stages.Center.Title.marginLeft = 32;
        navigationStyles.Stages.Left.Title.marginLeft = 32;
        navigationStyles.Stages.Right.Title.marginLeft = 32;

        const favoriteStations = (this.props.favoriteStations || { data: []}).data;

        return (
            <Navigator
                initialRoute={{id: 'Tabs', title: 'Commute' }}
                renderScene={(route, navigator) => {
                    if (route.id == 'StationDetails') {
                        return (
                            <StationDetailsScene ref="StationDetailsScene"
                                                 station={route.station}
                                                 navigator={navigator}
                            />
                        );
                    } else if (route.id === 'Tabs') {
                        return this.renderTabs(route, navigator);
                    }
                }}
                style={{ flex: 1 }}
                navigationBar={
                    <Navigator.NavigationBar
                        routeMapper={{
                            LeftButton: (route, navigator, index, navState) => {
                                if(index > 0) {
                                    return (
                                        <View style={{ marginLeft: -8 }}>
                                            <TouchableHighlight underlayColor="transparent" onPress={() => { if (index > 0) { navigator.pop() } }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <EvilIcon name="chevron-left" size={48} color="white" style={{ width: 32, paddingTop: 10 }} />
                                                </View>
                                            </TouchableHighlight>
                                        </View>
                                    );
                                } else {
                                    return <View style={{ paddingLeft: 0, width: 0, paddingRight: 0, marginLeft: 0, marginRight: 0 }}></View>;
                                }
                            },
                            RightButton: (route, navigator, index, navState) => {

                                console.log(`Right Button [route id: ${route.id}, index: ${index}, this.state.currentPage: ${this.state.currentPage}]`);

                                if (route.id === 'StationDetails') {
                                    return (
                                        <View style={{paddingTop: 10, paddingRight: 12}}>
                                            <TouchableHighlight underlayColor="transparent" onPress={this.onFavoriteStarPress.bind(this, route.station)}>
                                                <Icon
                                                    name={ favoriteStations.map(fs => fs.number).indexOf(route.station.number) >= 0 ? 'ios-star' : 'ios-star-outline' }
                                                    size={32}
                                                    color="white" />
                                            </TouchableHighlight>
                                        </View>
                                    );
                                } else if (route.id === 'Tabs' && this.state.currentPage === 0) {
                                    return (
                                        <View style={{paddingTop: 12, paddingRight: 16}}>
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
                            Title: (route, navigator, index, navState) => {
                                return (
                                    <View style={{ height: 56, flex: 1, justifyContent: 'center' }}>
                                        <Text style={{ color: 'white', fontSize: 20 }}>Commute</Text>
                                    </View>
                                );
                            },
                        }}
                        navigationStyles={navigationStyles}
                        style={{ backgroundColor: '#49b2d8' }}
                    />
                }
            />

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
)(Root);
