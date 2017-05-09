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

import { computeRegionRadiusInMeters, regionEquals, computeRegionFromLocation } from '../utils/Region'

import _ from 'lodash';

const { min, random } = Math;

class Map extends Component {


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Propeties
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    static propTypes = {
        annotations: PropTypes.array,
        version: PropTypes.number,
        region: PropTypes.object,
        geoLocation: PropTypes.object,
        onRegionChange: PropTypes.func,
        onRegionChangeComplete: PropTypes.func,
        onChange: PropTypes.func,
        onPress: PropTypes.func
    };

    static defaultProps = {
        annotations: []
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// instance variables
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    state = {
        selectedIndex: 0
    };


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Constructor
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    constructor(props) {
        super(props);

        this.onCenterOnLocation = this.onCenterOnLocation.bind(this);
        this.onRegionChange = this.onRegionChange.bind(this);
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onPress = this.onPress.bind(this);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Lifecycle
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    componentWillReceiveProps(nextProps) {

        if (!this.props.geoLocation && nextProps.geoLocation) {
            if (this.state.region) {
                console.log('[Map][componentWillReceiveProps][1] !this.props.geoLocation && nextProps.geoLocation && this.state.region');
                const region = {
                    latitude: nextProps.geoLocation.latitude(),
                    longitude: nextProps.geoLocation.longitude(),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.025
                };
                this.setState({ region, centerOnRegion: true });

                console.log('[Map][componentWillReceiveProps][1][End] Current location region from center:', region);
                this.onRegionChangeComplete(region);
            } else {
                console.log('[Map][componentWillReceiveProps][2] !this.props.geoLocation && nextProps.geoLocation && !this.state.region');
                const region = computeRegionFromLocation(nextProps.geoLocation, 0.5);
                this.setState({ region, centerOnRegion: true });

                console.log('[Map][componentWillReceiveProps][2][End] Current location region from center:', region);
                this.onRegionChangeComplete(region);
            }
        } /*else if (!regionEquals(this.state.region, nextProps.region)) {
            console.log('[Map][componentWillReceiveProps][3] else');

            const region = _.clone(nextProps.region);
            this.setState({ region, centerOnRegion: true });

            console.log('[Map][componentWillReceiveProps][3][End] Current location region from center:', region);
        }*/
    }

    shouldComponentUpdate(nextProps, nextState) {

        console.log(`[Map][shouldComponentUpdate] selected index: ${this.state.selectedIndex}, ${nextState.selectedIndex}`);

        if (nextState.centerOnRegion) {
            console.log('[Map][shouldComponentUpdate] center on region');
            return true;
        } else if (this.props.version !== nextProps.version) {
            console.log('[Map][shouldComponentUpdate] props version changed (', this.props.version, ', ', nextProps.version, ')');
            return true;
        } else if (!regionEquals(this.state.region, nextState.region)) {
            console.log('[Map][shouldComponentUpdate] state region changed (', this.state.region, ', ', nextState.region, ')');
        }

        return false;
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Events
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
        if (this.props.onRegionChange) {
            this.props.onRegionChange(region);
        }
    }

    onRegionChangeComplete(region) {
        console.log('[Map][onRegionChangeComplete] (region: ', region, ', this.props.region: ', this.props.region, '), geoLocation: ', this.props.geoLocation);

        if (this.props.onRegionChangeComplete) {
            if (region && this.props.region) {
                this.props.onRegionChangeComplete(region);
            } else if (this.props.geoLocation) {
                const region = {
                    latitude: this.props.geoLocation.latitude(),
                    longitude: this.props.geoLocation.longitude(),
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.025
                };

                this.props.onRegionChangeComplete(region);
            } else {
                region = {
                    longitudeDelta: 0.00772,
                    latitude: 48.85319,
                    longitude: 2.34831,
                    latitudeDelta: 0.00819
                };

                this.props.onRegionChangeComplete(region);
            }
        }
    }

    onCenterOnLocation() {
        if (this.props.geoLocation) {
            if (this.state.region) {
                let region = Object.assign({}, this.state.region);

                region.latitude = this.props.geoLocation.latitude();
                region.longitude = this.props.geoLocation.longitude();
                region.latitudeDelta = region.latitudeDelta + (random() + 0.0001) * 0.0001;
                region.longitudeDelta = region.longitudeDelta +  (random() + 0.0001) * 0.0001;

                this.setState({ region, centerOnRegion: true });
            } else {
                let region = computeRegionFromLocation(this.props.geoLocation);

                this.setState({ region, centerOnRegion: true });
            }
        } else {
            console.warn('No geoLocation found !');
        }
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Render
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    render() {
        console.log('--- [Map] Render -------------------------------------------------------------------------------------');

        return (
            <View style={{ flex: 1 }}>
                {this.renderActionBar()}
                {this.renderActionButton()}
                {this.renderMapView()}
            </View>
        )
    }

    renderMapView() {
        console.log('[Map][render] Region:', this.state.region);

        console.log('[Map][render] CenterOnRegion:', this.state.centerOnRegion);

        const centerOnRegion = this.state.centerOnRegion;

        if (centerOnRegion) {
            console.log('[Map][render] Centering on region', this.state.centerOnRegion, '(Setting centerOnRegion to false)');
            this.state.centerOnRegion = false;
        }


        return (
            <MapView
                style={{ flex: 1, zIndex: 2 }}
                showsUserLocation={true}
                showsMyLocationButton={false}
                showsCompass={false}
                toolbarEnabled={false}
                onRegionChangeComplete={this.onRegionChangeComplete}
                onRegionChange={this.onRegionChange}
                onPress={this.onPress}
                initialRegion={this.state.region}
                region={centerOnRegion ? this.state.region : undefined}
            >
                {this.renderCircle()}
                {this.renderAnnotations()}
            </MapView>
        );
    }

    renderActionBar() {
        return (
            <View style={{
                zIndex: 100, position: 'absolute',
                left: 0, right: 0, top: Platform.OS === 'ios' ? 64 : 0, height: 44,
                backgroundColor: 'white', opacity: Platform.OS === 'ios' ? 0.9 : 0.7,
                borderBottomWidth: 0.33,
                borderBottomColor: 'rgba(0, 0, 0, 0.4)'
            }}>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {this.renderSegmentedControl()}
                </View>
            </View>
        );
    }

    renderAnnotations() {
        return this.props.annotations.map(annotation => {
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
        });
    }

    renderActionButton() {
        return (
            <IconButton iconName="ios-locate-outline" onPress={this.onCenterOnLocation} style={{ zIndex: 100, position: 'absolute', right: 16, bottom: Platform.OS === 'ios' ? 64 : 24 }} />
        );
    }

    renderCircle() {
        const { region } = this.state;

        let circleRegion = { latitude: 0, longitude: 0 };

        if (region) {
            const regionRadiusInMeters = computeRegionRadiusInMeters(region);
            console.log("[Map][render] computeRegionRadiusInMeters(region):", regionRadiusInMeters);

            if (regionRadiusInMeters < 2500 || regionRadiusInMeters > 10000) {
                console.log("[Map][render] Not rendering circle as distance is lower than 2500 or greater than 10.000 meters:", regionRadiusInMeters);
                return;
            }

            circleRegion = { latitude: region.latitude, longitude: region.longitude };
        }

        console.log('[Map][render] Region:', circleRegion);

        return (
            <MapView.Circle
                key={(circleRegion.longitude + '-' + circleRegion.latitude).toString()}
                center={circleRegion}
                radius={1000}
                fillColor="rgba(0, 122, 255, 0.25)"
                strokeColor="rgba(0, 122, 255, 0.25)"
                zIndex={2}
                strokeWidth={1}
            />
        );
    }

    renderSegmentedControl() {
        if (Platform.OS === 'ios') {
            return (
                <SegmentedControlIOS
                    values={[ 'Places', 'Vélos' ]}
                    selectedIndex={this.state.selectedIndex}
                    style={{ backgroundColor: 'white', width: 260 }}
                    tintColor="#49b2d8"
                    onChange={this.onChange}
                />
            );
        } else {
            const AndroidSegmented = require('react-native-segmented-android');

            return (
                <AndroidSegmented
                    tintColor={['#49b2d8','#ffffff']}
                    style={{ backgroundColor: 'white', width: 260, height: 30 }}
                    childText={[ 'Places', 'Vélos' ]}
                    orientation='horizontal'
                    selectedPosition={this.state.selectedIndex}
                    onChange={this.onChange} />
            );
        }

    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Exports
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default Map;