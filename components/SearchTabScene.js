import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as stationActionCreators from '../actions/stations'
import * as favoriteStationActionCreators from '../actions/favoriteStations'

import GeoPoint from 'geopoint';
import _ from 'lodash';

import Swipeout from 'react-native-animated-swipeout';

import { getColor } from '../utils';

import {
    Animated,
    Image,
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    RefreshControl
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import SearchBar from 'react-native-search-bar';

var LISTVIEW = 'ListView';

var DropRefreshControl = require('react-native-drop-refresh');

class SearchTabScene extends Component {

    static propTypes = {
        navigator: PropTypes.object
    };

    static defaultProps = {
        dataSource: new ListView.DataSource({ rowHasChanged: (s1, s2) => s1 !== s2 })
    };

    constructor(props) {
        super(props);

        this.state = {
            dataSource: this.props.dataSource.cloneWithRows([]),
            highlightedRow: {
                sectionID: undefined,
                rowID: undefined
            }
        };

        this.onChangeText = this.onChangeText.bind(this);
        this.onCancelButtonPress = this.onCancelButtonPress.bind(this);
        this.onSearchButtonPress = this.onSearchButtonPress.bind(this);
        this.pressRowIn = this.pressRowIn.bind(this);
        this.pressRowOut = this.pressRowOut.bind(this);
        this.pressRow = this.pressRow.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
                console.log('navigator.geolocation.getCurrentPosition - position:', position);
                this.setState({position, geoLocation: new GeoPoint(position.coords.latitude, position.coords.longitude)});


                this.loadNearbyStations(position, 60000);
            }, (error) => {
                alert(error.message);
            }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        DropRefreshControl.configure({
            node: this.refs[LISTVIEW]
        }, () => {
            setTimeout(() => {
                DropRefreshControl.endRefreshing(this.refs[LISTVIEW]);
            }, 2000);
        });
    }

    componentWillReceiveProps(nextProps) {
        const stations = nextProps.stations;

        this.setState({
            dataSource: !this.state.searchText ?
                nextProps.dataSource.cloneWithRows(stations.data) :
                nextProps.dataSource.cloneWithRows(stations.data.filter(station => station.name.search(new RegExp(this.state.searchText, "i")) >= 0))
        });
    }

    loadNearbyStations(position, distance = 1000) {

        if (!position) {
            console.info('No position available');
            return ;
        }

        if (this.props.stations.isFetching) {
            console.info('Already fetching nearest stations');
            return ;
        }

        const currentPosition = { latitude: position.coords.latitude.toFixed(3), longitude: position.coords.longitude.toFixed(3) };

        if (_.isEqual(currentPosition, this.state.lastPosition) && (distance / 100).toFixed(0) === (this.state.lastDistance / 100).toFixed(0)) {
            console.info('Current position did not changed:', currentPosition, 'with distance:', distance, '~=', this.state.lastDistance);
            return ;
        }

        this.props.actions.fetchStations(position.coords, distance);

        this.setState({
            lastPosition: currentPosition,
            lastDistance: distance
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <SearchBar placeholder="Search"
                           ref="searchBar"

                           tintColor="#edeef2"
                           barTintColor="#edeef2"

                           style={{ marginTop: 64, height: 44, backgroundColor: '#edeef2' }}
                           onChangeText={this.onChangeText}
                           enablesReturnKeyAutomatically={true}
                           onSearchButtonPress={this.onSearchButtonPress}
                           onCancelButtonPress={this.onCancelButtonPress}
                />
                <ListView style={{ backgroundColor: 'white' }}
                          dataSource={this.state.dataSource}
                          automaticallyAdjustContentInsets={false}
                          enableEmptySections={true}
                          renderRow={this.renderRow}
                          keyboardDismissMode="on-drag"
                          renderSeparator={this.renderSeparator}
                          ref={LISTVIEW}
                />
            </View>
        )

        console.log('--- [SearchTabScene] Render -------------------------------------------------------------------------------------');
    }

    onChangeText(value) {
        this.updateSearch(value);
    }

    onCancelButtonPress() {
        this.refs.searchBar.blur();
    }

    onSearchButtonPress(value) {
        this.refs.searchBar.blur();
        this.updateSearch(value);
    }

    updateSearch(value) {
        this.setState({
            searchText: value,
            dataSource: !value ?
                this.props.dataSource.cloneWithRows(this.props.stations.data) :
                this.props.dataSource.cloneWithRows(this.props.stations.data.filter(station => station.name.search(new RegExp(this.state.searchText, "i")) >= 0))
        });
    }

    onFavoriteStarPress(station) {
        const favoriteStations = this.props.favoriteStations.data;

        if (favoriteStations.map(fs => fs.number).indexOf(station.number) >= 0) {
            this.props.actions.removeFavoriteStation(station);
        } else {
            this.props.actions.addFavoriteStation(station);
        }
    }

    renderRow(station, sectionID, rowID, highlightRow) {
        const backgroundSourceUri = `https://s3-eu-west-1.amazonaws.com/image-commute-sh/${station.contract_name}-${station.number}-1-${640}-${60}.jpg`;

        const rowPress = sectionID === this.state.highlightedRow.sectionID && rowID === this.state.highlightedRow.rowID;

        console.log("--- Row[sectionID: ", sectionID, "/", this.state.highlightedRow.sectionID , ", rowID:", rowID, "/", this.state.highlightedRow.rowID , "] is Pressed:", rowPress);

        const favoriteStations = this.props.favoriteStations.data;

        let swipeBtns = [
            {
                component:
                    <View style={{ flex: 1, backgroundColor: 'transparent', zIndex: 100, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={ favoriteStations.map(fs => fs.number).indexOf(station.number) >= 0 ? 'ios-star' : 'ios-star-outline' } color="#fff" size={44} />
                    </View>,
                backgroundColor: 'red',
                underlayColor: 'rgba(0, 0, 0, 0.6)',
                onPress: () => { this.onFavoriteStarPress(station) }
            }
        ];

        return (
            <Swipeout right={swipeBtns}
                      autoClose={true}
                      backgroundColor= 'transparent'>
                <TouchableHighlight underlayColor='#EBECF0' onPressIn={() => {
                    this.pressRowIn(sectionID, rowID);
                    highlightRow(sectionID, rowID);
                }} onPressOut={() => {
                    this.pressRowOut(sectionID, rowID);
                }} onPress={() => {
                    this.pressRow(sectionID, rowID);
                    highlightRow(null);
                }}>
                    <View style={{ flexDirection: 'row', height: 96 }}>
                        <Image defaultSource={require('../images/map_placeholder.jpg')} source={{ uri: backgroundSourceUri }} resizeMode='cover' style={{ width: 96, height: 96 }} />
                        <View style={{ flexDirection: 'column', flex: 1, padding: 20, paddingRight: 10 }}>
                            <Text style={{ fontFamily: 'System', fontSize: 14, fontWeight: '500', color: rowPress ? '#325d7a' : '#325d7a' }}>{station.number} - {station.name}</Text>
                            <Text  style={{ fontFamily: 'System', fontSize: 12, fontWeight: '500', color: rowPress ? '#9d9d9d' : '#9d9d9d' }}>{station.address}</Text>
                        </View>

                        <View style={{ width: 80, padding: 20, paddingTop: 20, paddingBottom: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Text style={{ fontFamily: 'System', fontSize: 18, fontWeight: '500', color: rowPress ? getColor(station.available_bikes) : getColor(station.available_bikes) }}>{station.available_bikes}</Text>
                            <Text style={{ fontFamily: 'System', fontSize: 12, fontWeight: '500', color: rowPress ? '#c2c2c2' : '#c2c2c2' }}>{(station.distance / 1000).toFixed(1)} km</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </Swipeout>
        );
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: adjacentRowHighlighted ? 1 : 1,
                    backgroundColor: adjacentRowHighlighted ? '#E9E8ED' : '#E9E8ED',
                }}
            />
        );
    }

    onRefresh() {
        const search = this.props.stations.search;
        if (search) {
            this.props.actions.fetchStations(search.position, search.distance, search.contractName);
        }
    }

    pressRowIn(sectionID, rowID) {
        console.log("--- On Row pressed In [sectionID: ", sectionID, ", rowID:", rowID, "]");
        this.setState({ highlightedRow: { sectionID: sectionID, rowID: rowID } });
    }

    pressRowOut(sectionID, rowID) {
        console.log("--- On Row pressed Out [sectionID: ", sectionID, ", rowID:", rowID, "]");
        this.setState({ highlightedRow: { sectionID: undefined, rowID: undefined } });
    }

    pressRow(sectionID, rowID) {
        console.log("--- On Row pressed [sectionID: ", sectionID, ", rowID:", rowID, "]");
        this.props.navigator.push({ id: 'StationDetails', station: this.props.stations.data[rowID] });
    }

}

const mapStateToProps = (state) => Object.assign({}, {
    stations: state.stations,
    favoriteStations: state.favoriteStations
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        Object.assign({}, stationActionCreators, favoriteStationActionCreators),
        dispatch
    )
});

export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchTabScene);
