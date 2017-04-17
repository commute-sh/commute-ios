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
    ListView
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

import SearchTabScene from './SearchTabScene';
import StationDetailsScene from './stations/details/StationDetailsScene';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as favoriteStationActionCreators from '../actions/favoriteStations'

class SearchTab extends Component {

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

    render() {

        const favoriteStations = (this.props.favoriteStations || { data: []}).data;

        return (
            <Icon.TabBarItemIOS
                title="Recherche"
                iconName="ios-search-outline"
                selectedIconName="ios-search"
                selected={this.props.selectedTab === 'search'}
                onPress={this.props.onTabIconPress}
            >
                <Navigator
                    initialRoute={{ id: 'StationSearch', title: 'Recherche de stations' }}
                    renderScene={(route, navigator) => {
                        if (route.id == 'StationDetails') {
                            return (
                                <StationDetailsScene
                                    station={route.station}
                                    navigator={navigator}
                                />
                            );
                        } else if (route.id == 'StationSearch') {
                            return (
                                <SearchTabScene navigator={navigator} />
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
                                    else { return null; }
                                },
                                RightButton: (route, navigator, index, navState) => {

                                    console.log(`Right Button [route id: ${route.id}, index: ${index}`);

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
                                    } else { return null; }
                                },
                                Title: (route, navigator, index, navState) => {
                                    return (
                                        <View style={{ paddingTop: 2 }}>
                                            <Image source={require('../images/commute-navbar-icon.png')} style={{ width: 32, height: 32 }} />
                                        </View>
                                    );
                                },
                            }}
                            style={{ backgroundColor: '#49b2d8' }}
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
        Object.assign({}, favoriteStationActionCreators),
        dispatch
    )
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchTab);
