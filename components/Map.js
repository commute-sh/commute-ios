import React, { Component, PropTypes } from 'react';
import {
    MapView,
    View,
    SegmentedControlIOS
} from 'react-native';

import _ from 'lodash';

import FaIcon from 'react-native-vector-icons/FontAwesome';

export default class Map extends Component {

    static propTypes = {
        location: PropTypes.object,
        onAnnotationPress: PropTypes.func,
        onRegionChange: PropTypes.func,
        onRegionChangeComplete: PropTypes.func,
        onChange: PropTypes.func,
        useSmallPins: PropTypes.bool
    };

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
        if (this.state.centerOnLocation) {
            this.state.centerOnLocation = false;
        } else {
            this.setState({region: region});
            this.props.onRegionChange(region);
        }
    }

    onRegionChangeComplete(region) {
        if (this.state.centerOnLocation) {
            this.state.centerOnLocation = false;
        } else {
            this.setState({region: region});
            this.props.onRegionChangeComplete(region);
        }
    }

    onCenterOnLocation() {
//        console.log('onCenterOnLocation');
        this.setState({ centerOnLocation: true });
    }

    componentDidMount() {
        this.annotationsLength = this.props.annotations.length;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.useSmallPins !== nextProps.useSmallPins) {
            return true;
        } else if (this.state.selectedIndex !== nextState.selectecIndex) {
            return true;
        } else if ((this.state.region && nextState && nextState.region && !_.isEqual(nextState.region, this.state.region))) {
            console.log('shouldComponentUpdate - centerOnLocation');

            return true;
        } else if (nextState.centerOnLocation) {
            console.log("Force refresh");

            return true;
        }

        const annotationsAreEqual = this.annotationsLength === nextProps.annotations.length;
        this.annotationsLength = nextProps.annotations.length;

 //       console.log('Received annotations are:', annotationsAreEqual ? 'equal' : 'not equal - should update component');
        return !annotationsAreEqual;
    }

    render() {
        console.log('--- [Map] Render -------------------------------------------------------------------------------------');

        const currentLocation = this.props.location;
//        console.log('currentLocation:', currentLocation);

        let region = this.state.region;

        if (currentLocation) {
            let currentLocationBoundingCoordinates = currentLocation.boundingCoordinates(0.5, undefined, true);
  //          console.log('currentLocationBoundingCoordinates:', currentLocationBoundingCoordinates);

            let latitudeDelta = Math.abs(Math.abs(currentLocation.latitude()) - Math.abs(currentLocationBoundingCoordinates[0].latitude()))// + Math.random() / 1000 + 0.0001;
            let longitudeDelta = Math.abs(Math.abs(currentLocation.longitude()) - Math.abs(currentLocationBoundingCoordinates[0].longitude()))// + Math.random() / 1000 + 0.0001;

  //          console.log('latitudeDelta:', latitudeDelta);
  //          console.log('longitudeDelta:', longitudeDelta);

            region = {
                latitude: currentLocation.latitude(),
                longitude: currentLocation.longitude(),
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta
            };

        }

        if (this.state.centerOnLocation) {
            region.latitudeDelta = region.latitudeDelta + (Math.random() + 0.0001) * 0.0001;
            region.longitudeDelta = region.longitudeDelta +  (Math.random() + 0.0001) * 0.0001;

            this.state.centerOnLocation = false;
        }

        console.log('------------------ region:', region);


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
                    region={region}
                    annotations={this.props.annotations}
                 />
            </View>
        )
    }

}
