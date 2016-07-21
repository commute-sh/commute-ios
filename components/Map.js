import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
    MapView,
} from 'react-native';


export default class Map extends Component {

    static propTypes = {
        location: PropTypes.object,
        onRegionChangeComplete: PropTypes.func
    };

    componentDidMount() {
        this.annotationsLength = this.props.annotations.length;
    }

    shouldComponentUpdate(nextProps, nextState) {
        const annotationsAreEqual = this.annotationsLength === nextProps.annotations.length;
        this.annotationsLength = nextProps.annotations.length;

        console.log('Received annotations are:', annotationsAreEqual ? 'equal' : 'not equal - should update component');
        return !annotationsAreEqual;
    }

    render() {
        console.log('--- [Map] Render -------------------------------------------------------------------------------------');

        const currentLocation = this.props.location;
        console.log('currentLocation:', currentLocation);

        let region;

        if (currentLocation) {
            let currentLocationBoundingCoordinates = currentLocation.boundingCoordinates(0.5, undefined, true);
            console.log('currentLocationBoundingCoordinates:', currentLocationBoundingCoordinates);

            let latitudeDelta = Math.abs(Math.abs(currentLocation.latitude()) - Math.abs(currentLocationBoundingCoordinates[0].latitude()));
            let longitudeDelta = Math.abs(Math.abs(currentLocation.longitude()) - Math.abs(currentLocationBoundingCoordinates[0].longitude()));

            console.log('latitudeDelta:', latitudeDelta);
            console.log('longitudeDelta:', longitudeDelta);

            region = {
                latitude: currentLocation.latitude(),
                longitude: currentLocation.longitude(),
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta
            };
        }

        return (
            <MapView
                style={{flex: 1}}
                followUserLocation={false}
                showsUserLocation={true}
                onRegionChangeComplete={this.props.onRegionChangeComplete}
                onRegionChange={this.props.onRegionChange}
                region={region}
                annotations={this.props.annotations}
            />
        )
    }
}
