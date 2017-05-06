import React, { Component, PropTypes } from 'react';

import { View, Platform } from 'react-native';

import MapView from 'react-native-maps';

import StationMarkerView from '../../StationMarkerView';
import { mapStationToAnnotation } from '../../../utils/Stations'

const screen = require('Dimensions').get('window');

class StationDetailsMapHeader extends Component {

    static propTypes = {
        station: PropTypes.object,
        geoLocation: PropTypes.object,
        paddingLeft: PropTypes.number,
        paddingRight: PropTypes.number,
        paddingTop: PropTypes.number,
        paddingBottom: PropTypes.number,
        height: PropTypes.number,
        zoomEnabled: PropTypes.bool,
        dataToShow: PropTypes.string,
        onMarkerPress: PropTypes.func
    };

    onStationPress(station) {
        console.log(`On Station Press: ${station}`);
        if (this.props.onMarkerPress) {
            this.props.onMarkerPress();
        }
    }

    render() {
        const { station, geoLocation, dataToShow } = this.props;

        console.log("[StationDetailsMapHeader][render] dataToShow: ", this.props.dataToShow);

        const annotationType = dataToShow === 'AVAILABLE_BIKES' ? 'BIKES' : 'STANDS';
        const pinSize = 24;

        const annotation = mapStationToAnnotation.bind(this)(station, { onStationPress: this.onStationPress.bind(this), annotationType, undefined, geoLocation, pinSize });

        const initialRegion = {
            latitude: station.position.lat,
            longitude: station.position.lng,
            latitudeDelta: 0.00156125,
            longitudeDelta: 0.000780625,
        };

        return (
            <View style={{
                flex: 1,
                paddingLeft: this.props.paddingLeft,
                paddingRight: this.props.paddingRight,
                paddingTop: this.props.paddingTop,
                paddingBottom: this.props.paddingBottom
            }}>
                <MapView
                    initialRegion={initialRegion}
                    zoomEnabled={this.props.zoomEnabled}
                    style={{
                        width: screen.width - this.props.paddingLeft - this.props.paddingRight,
                        height: this.props.height,
                        borderRadius: 4
                    }}
                >
                    { Platform.OS == 'ios' ? (
                        <MapView.Marker
                            key={annotation.id}
                            style={{ flex: 1, zIndex: 2 }}
                            draggable
                            coordinate={annotation}
                            showsUserLocation={false}
                            showsMyLocationButton={false}
                            showsCompass={false}
                            toolbarEnabled={false}
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
                    ) }
                </MapView>
            </View>
        );
    }

}

export default StationDetailsMapHeader;
