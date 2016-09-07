import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as stationActionCreators from '../actions/stations'

import GeoPoint from 'geopoint';
import _ from 'lodash';

import {
    Animated,
    Image,
    ListView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import SearchBar from 'react-native-search-bar';

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
            dataSource: this.props.dataSource.cloneWithRows([])
        };

        this.onSearch = this.onSearch.bind(this);
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
    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.stations.data) {

            const stations = nextProps.stations;

            this.setState({
                dataSource: !this.state.searchText ?
                    nextProps.dataSource.cloneWithRows(stations.data) :
                    nextProps.dataSource.cloneWithRows(stations.data.filter(station => station.name.indexOf(this.state.searchText) >= 0))
            });
        }
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
        console.log('--- [SearchTabScene] Render -------------------------------------------------------------------------------------');

        return (
            <View style={{ flex: 1 }}>
                <SearchBar placeholder="Search"
                           style={{ marginTop: 64, height: 44, backgroundColor: 'green' }}
                           onChangeText={this.onSearch}
                           onSearchButtonPress={this.onSearch}
                />
                <ListView style={{ backgroundColor: 'white' }}
                          dataSource={this.state.dataSource}
                          automaticallyAdjustContentInsets={false}
                          enableEmptySections={true}
                          renderRow={(station) => this.renderRow(station)}
                />
            </View>
        )
    }

    onSearch(value) {

        this.setState({
            searchText: value,
            dataSource: !value ?
                this.props.dataSource.cloneWithRows(this.props.stations.data) :
                this.props.dataSource.cloneWithRows(this.props.stations.data.filter(station => station.name.indexOf(value) >= 0))
        });
    }

    renderRow(station) {
        console.log('station:', station);
        const backgroundSourceUri = `https://s3-eu-west-1.amazonaws.com/image-commute-sh/${station.contract_name}-${station.number}-1-${640}-${60}.jpg`;

        console.log("Photo URL:", backgroundSourceUri);

        return (
            <View style={{ height: 64, flexDirection: 'row' }}>
                <Image defaultSource={require('../images/map_placeholder.jpg')} source={{ uri: backgroundSourceUri }} style={{ width: 96, height: 64 }} />
                <View style={{ padding: 10, flexDirection: 'column' }}>
                    <Text style={{ fontFamily: 'System', fontSize: 14, fontWeight: '500' }}>{station.name}</Text>
                    <Text  style={{ fontFamily: 'System', fontSize: 11, fontWeight: '500', color: 'white' }}>{station.address}</Text>
                </View>
            </View>
        );
    }

}

const mapStateToProps = (state) => Object.assign({}, {
    stations: state.stations
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        Object.assign({}, stationActionCreators),
        dispatch
    )
});

export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchTabScene);
