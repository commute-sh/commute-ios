import React, { Component, PropTypes } from 'react';
import {
    View,
    Button,
    SegmentedControlIOS,
    TouchableOpacity,
    Platform
} from 'react-native';

import MapView from 'react-native-maps';

import IconButton from './IconButton';

import StationMarkerView from './StationMarkerView';

class Map extends Component {

    static propTypes = {
        annotations: PropTypes.array,
        version: PropTypes.number,
        center: PropTypes.object,
        geoLocation: PropTypes.object,
        onRegionChange: PropTypes.func,
        onRegionChangeComplete: PropTypes.func,
        onChange: PropTypes.func,
        onPress: PropTypes.func
    };

    static defaultProps = {
        annotations: []
    }

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0
        };

        this.onCenterOnLocation = this.onCenterOnLocation.bind(this);
        this.onRegionChange = this.onRegionChange.bind(this);
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    onPanDrap(event) {
        console.log('[Map] onPanDrag');
    }

    onLongPress(event) {
        console.log('[Map] onLongPress');
    }

    onChange(event) {
        this.setState({selectedIndex: Platform.OS === 'ios' ? event.nativeEvent.selectedSegmentIndex : event.selected });
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    }

    onPress(event) {
        if (this.props.onPress) {
            this.props.onPress(event);
        }
    }

    onRegionChange(region) {
        this.props.onRegionChange(region);
    }

    onRegionChangeComplete(region) {
        this.props.onRegionChangeComplete(region);
    }

    onCenterOnLocation() {
        if (this.state.region) {
            let region = Object.assign({}, this.state.region);

            region.latitude = this.props.geoLocation.latitude();
            region.longitude = this.props.geoLocation.longitude();
            region.latitudeDelta = region.latitudeDelta + (Math.random() + 0.0001) * 0.0001;
            region.longitudeDelta = region.longitudeDelta +  (Math.random() + 0.0001) * 0.0001;

            this.setState({ region: region, centerOnLocation: true });
        } else if (this.props.geoLocation) {
            let region = this.computeRegionFromLocation(this.props.geoLocation);

            this.setState({ region: region, centerOnLocation: true });
        }
    }

    computeRegionFromLocation(location, delta = 0.5) {
        let currentLocationBoundingCoordinates = location.boundingCoordinates(delta, undefined, true);

        let latitudeDelta = Math.abs(Math.abs(location.latitude()) - Math.abs(currentLocationBoundingCoordinates[0].latitude())) * 2;
        let longitudeDelta = Math.abs(Math.abs(location.longitude()) - Math.abs(currentLocationBoundingCoordinates[0].longitude())) * 2;

        return {
            latitude: location.latitude(),
            longitude: location.longitude(),
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta
        };
    }

    componentDidMount() { }

    componentWillReceiveProps(nextProps) {
        if (!this.props.geoLocation && nextProps.geoLocation) {
            if (this.state.region) {
                console.log('[Map][1][a] !this.props.geoLocation && nextProps.geoLocation');
                this.setState({
                    region: {
                        latitude: nextProps.geoLocation.latitude(),
                        longitude: nextProps.geoLocation.longitude(),
                        latitudeDelta: this.state.region.latitudeDelta,
                        longitudeDelta: this.state.region.longitudeDelta
                    }
                });
            } else {
                console.log('[Map][1][b} !this.props.geoLocation && nextProps.geoLocation');
                this.setState({
                    region: this.computeRegionFromLocation(nextProps.geoLocation, 0.5)
                });
            }

            console.log('[Map] ------------------ Current location region from geoLocation[2]:', this.state.region);
        } else if (!this.props.geoLocation && !nextProps.geoLocation && nextProps.center) {
            console.log('[Map][2] !this.props.geoLocation && !nextProps.geoLocation && nextProps.center');

            this.setState({
                region: this.computeRegionFromLocation(nextProps.center, 0.5)
            });

            console.log('[Map] ------------------ Current location region from center[1]:', this.state.region);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        console.log(`--- selectedIndex: ${this.state.selectedIndex}, ${nextState.selectedIndex}`);

        if (nextState.centerOnLocation) {
            console.log('[Map][Updating] center on location');

            return true;
        } else if (this.props.version !== nextProps.version) {
            console.log('[Map][Updating] props version changed (', this.props.version, ', ', nextProps.version, ')');
            return true;
        }

        return false;
    }

    renderSegmentedControl() {
        if (Platform.OS === 'ios') {
            return (
                <SegmentedControlIOS
                    values={[ 'Places', 'Vélos' ]}
                    selectedIndex={this.state.selectedIndex}
                    style={{ backgroundColor: 'white', width: 160 }}
                    tintColor="#325d7a"
                    onChange={this.onChange}
                />
            );
        } else {
            var AndroidSegmented = require('react-native-segmented-android');

            return (
                <AndroidSegmented
                    tintColor={['#325d7a','#ffffff']}
                    style={{ backgroundColor: 'white', width: 160, height: 30 }}
                    childText={[ 'Places', 'Vélos' ]}
                    orientation='horizontal'
                    selectedPosition={this.state.selectedIndex}
                    onChange={this.onChange} />
            );
        }

    }

    render() {

        console.log('--- [Map] Render -------------------------------------------------------------------------------------');

        console.log('[Map] -------------- Region:', this.state.region);

        console.log('[Map] -------------- centerOnLocation:', this.state.centerOnLocation);

        const centerOnLocation = this.state.centerOnLocation;

        if (centerOnLocation) {
            this.state.centerOnLocation = false;
        }

        return (
            <View style={{ flex: 1 }}>
                <View style={{ zIndex: 100, position: 'absolute', left: 24, right: 24, bottom: Platform.OS === 'ios' ? 72 : 32 }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    {this.renderSegmentedControl()}
                    </View>
                </View>
                <IconButton iconName="location-arrow" onPress={this.onCenterOnLocation} style={{ zIndex: 100, position: 'absolute', right: 24, bottom: Platform.OS === 'ios' ? 64 : 24 }} />
                <MapView
                    style={{ flex: 1, zIndex: 2 }}
                    showsUserLocation={true}
                    showsMyLocationButton={false}
                    showsCompass={false}
                    toolbarEnabled={false}
                    onRegionChangeComplete={this.onRegionChangeComplete}
                    onRegionChange={this.onRegionChange}
                    onPress={this.onPress}
                    onPanDrag={this.onPanDrap}
                    onLongPress={this.onLongPress}
                    initialRegion={this.state.region}
                    region={centerOnLocation ? this.state.region : undefined}
                 >
                    { this.props.annotations.map(annotation => {
                        return Platform.OS == 'ios' ? (
                            <MapView.Marker
                                key={annotation.id}
                                draggable
                                coordinate={annotation}
                            >
                                <StationMarkerView {...annotation} onPress={annotation.onPress} />
                            </MapView.Marker>
                        ) : (
                            <MapView.Marker
                                key={annotation.id}
                                onPress={annotation.onPress}
                                draggable
                                coordinate={annotation}
                            >
                                <StationMarkerView {...annotation} />
                            </MapView.Marker>
                        )
                    }) }
                </MapView>
            </View>
        )
    }

}

export default Map;