import React, { Component, PropTypes } from 'react';
import {
    MapView,
    View,
    SegmentedControlIOS
} from 'react-native';

import FaIcon from 'react-native-vector-icons/FontAwesome';

export default class Map extends Component {

    static propTypes = {
        annotations: PropTypes.array,
        center: PropTypes.object,
        geoLocation: PropTypes.object,
        onAnnotationPress: PropTypes.func,
        onRegionChange: PropTypes.func,
        onRegionChangeComplete: PropTypes.func,
        onChange: PropTypes.func,
        pinSize: PropTypes.number
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
    }

    onChange(event) {
        this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
        if (this.props.onChange) {
            this.props.onChange(event);
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
        } else {
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

    componentDidMount() {
        // if (this.props.geoLocation) {
        //     this.state.region = this.computeRegionFromLocation(this.props.geoLocation, 0.5);
        //
        //     console.log('[Map] ------------------ Current location region from geoLocation[1]:', this.state.region);
        // } else if (this.props.center) {
        //     this.state.region = this.computeRegionFromLocation(this.props.center, 0.5);
        //
        //     console.log('[Map] ------------------ Current location region from center[1]:', this.state.region);
        // }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.geoLocation && nextProps.geoLocation) {
            if (this.state.region) {

                this.setState({
                    region: {
                        latitude: nextProps.geoLocation.latitude(),
                        longitude: nextProps.geoLocation.longitude(),
                        latitudeDelta: this.state.region.latitudeDelta,
                        longitudeDelta: this.state.region.longitudeDelta
                    }
                });
            } else {
                this.setState({
                    region: this.computeRegionFromLocation(nextProps.geoLocation, 0.5)
                });
            }

            console.log('[Map] ------------------ Current location region from geoLocation[2]:', this.state.region);
        } else if (!this.props.geoLocation && !nextProps.geoLocation && nextProps.center) {
            this.setState({
                region: this.computeRegionFromLocation(nextProps.center, 0.5)
            });

            console.log('[Map] ------------------ Current location region from center[1]:', this.state.region);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.pinSize !== nextProps.pinSize) {
            console.log('[Map][Updating] pinSize changed (', this.props.pinSize, ', ', nextProps.pinSize, ')');
            return true;
        } else if (this.state.selectedIndex !== nextState.selectedIndex) {
            console.log('[Map][Updating] selectedIndex changed (', this.state.selectedIndex, ', ', nextState.selectedIndex, ')');
            return true;
        } /*else if ((this.state.region && nextState && nextState.region && (nextState.region.latitude != this.state.region.latitude || nextState.region.longitude != this.state.region.longitude))) {
            console.log('shouldComponentUpdate - centerOnLocation');

            return true;
        }*/ else if (nextState.centerOnLocation) {
            this.state.centerOnLocation = false;
            console.log('[Map][Updating] center on location');

            return true;
        }

        const annotationsChanged = this.props.annotations.length !== nextProps.annotations.length;

        if (annotationsChanged) {
            console.log('[Map][Updating] annotation changed (', this.props.annotations.length, ', ', nextProps.annotations.length, ')');
        }

 //       console.log('Received annotations are:', annotationsAreEqual ? 'equal' : 'not equal - should update component');
        return annotationsChanged;
    }

    render() {

        console.log('--- [Map] Render -------------------------------------------------------------------------------------');

        console.log('[Map] -------------- Region:', this.state.region);

        return (
            <View style={{ flex: 1 }}>
                <View style={{ zIndex: 100, position: 'absolute', left: 0, right: 0, bottom: 64 }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <SegmentedControlIOS
                            values={[ 'Places', 'Bornes' ]}
                            selectedIndex={this.state.selectedIndex}
                            style={{ backgroundColor: 'white', width: 160 }}
                            tintColor="#325d7a"
                            onChange={this.onChange}
                        />

                        <View style={{
                            position: 'absolute',
                            right: 24,
                            top: 0
                        }}>
                            <FaIcon.Button
                                name="location-arrow"
                                size={20}
                                color="white"
                                onPress={this.onCenterOnLocation}
                                style={{
                                    backgroundColor: '#325d7a',
                                    borderRadius: 5,
                                    paddingTop: 3,
                                    paddingBottom: 3,
                                    paddingLeft: 5,
                                    paddingRight: 5
                                }}
                                iconStyle={{
                                    marginRight: 0
                                }}
                            />
                        </View>

                    </View>
                </View>
                <MapView
                    style={{ flex: 1, zIndex: 2 }}
                    showsUserLocation={true}
                    onRegionChangeComplete={this.onRegionChangeComplete}
                    onRegionChange={this.onRegionChange}
                    region={this.state.region}
                    annotations={this.props.annotations}
                 />
            </View>
        )
    }

}
