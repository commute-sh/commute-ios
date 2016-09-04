import React, { Component, PropTypes } from 'react';

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

import * as StationService from '../services/StationService';

import SearchBar from 'react-native-search-bar';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        marginTop: 64,
        height: 44,
        backgroundColor: 'green',
    },
    listView: {
        backgroundColor: 'white',
    },
});

class SearchTabScene extends Component {

    static propTypes = {
        eventEmitter: PropTypes.object,
        navigator: PropTypes.object
    };

    static defaultProps = {
        dataSource: new ListView.DataSource({rowHasChanged: (s1, s2) => s1 !== s2})
    };

    // Initialize the hardcoded data
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
            }, {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }

    loadNearbyStations(position, distance = 1000) {

        if (!position) {
            console.info('No position available');
            return ;
        }

        if (this.state.isFetching) {
            console.info('Already fetching nearest stations');
            return ;
        }

        const self = this;

        const currentPosition = { latitude: position.coords.latitude.toFixed(3), longitude: position.coords.longitude.toFixed(3) };

        if (_.isEqual(currentPosition, self.state.lastPosition) && (distance / 100).toFixed(0) === (this.state.lastDistance / 100).toFixed(0)) {
            console.info('Current position did not changed:', currentPosition, 'with distance:', distance, '~=', this.state.lastDistance);
            return ;
        }

        console.log("isFetching: true");
        this.setState({ isFetching: true });

        StationService.getStationsNearby(position.coords, distance)
            .then((stations) => {
                console.log("Found", stations.length, "matching position", position, " and distance", distance);

                const mergedStations = _.unionBy(stations, self.state.stations, 'number');

                stations.forEach(station => {
                    if (!station.geoLocation) {
                        station.geoLocation = new GeoPoint(station.position.lat, station.position.lng);
                    }
                });

                self.setState({
                    lastPosition: currentPosition,
                    lastDistance: distance,
                    stations: mergedStations,
                    isFetching: false,
                    dataSource: !self.state.searchText ?
                        self.props.dataSource.cloneWithRows(mergedStations) :
                        self.props.dataSource.cloneWithRows(mergedStations.filter(station => station.name.indexOf(self.state.searchText) >= 0))
                });

            })
            .catch(err => {
                console.log('Error:', err, 'Stack:', err.stack);

                console.log("isFetching: false");
                self.setState({ isFetching: false });


                let errorMessage = err.message;

                if (err.name === 'TypeError' && err.message === "Network request failed") {
                    errorMessage = 'Pas de connectivité réseau.';
                }

                self.props.globalEventEmitter.emit('ToastShow', { title: 'Impossible de charger la liste des stations', message: errorMessage, type: 'ERROR' });
            });
    }

    render() {
        console.log('--- [SearchTabScene] Render -------------------------------------------------------------------------------------');

        return (
            <View style={styles.container}>
                <SearchBar placeholder="Search"
                           style={styles.searchBar}
                           onChangeText={this.onSearch}
                           onSearchButtonPress={this.onSearch}
                />
                <ListView style={styles.listView}
                          dataSource={this.state.dataSource}
                          automaticallyAdjustContentInsets={false}
                          enableEmptySections={true}
                          renderRow={(station) => this.renderRow(station)}
                />
            </View>
        )
    }

    onSearch(value) {
        const self = this;

        this.setState({
            searchText: value,
            dataSource: !value ?
                self.props.dataSource.cloneWithRows(this.state.stations) :
                self.props.dataSource.cloneWithRows(this.state.stations.filter(station => station.name.indexOf(value) >= 0))
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

export default SearchTabScene;
