import React, { Component, PropTypes } from 'react';

import { View } from 'react-native';

import StationMarkerView from '../../StationMarkerView';

import NetworkImage from '../../NetworkImage';

import { stationPinColor } from '../../../utils/Stations';

const screen = require('Dimensions').get('window');

class StationDetailsMapImageHeader extends Component {

    static propTypes = {
        station: PropTypes.object,
        paddingLeft: PropTypes.number,
        paddingRight: PropTypes.number,
        paddingTop: PropTypes.number,
        paddingBottom: PropTypes.number,
        height: PropTypes.number
    };

    render() {
        const station = this.props.station || { name: ' ', address: ' ' };

        console.log("Screen size[w:", screen.width, ', h:', screen.height, ']');

        const width = (screen.width - this.props.paddingLeft - this.props.paddingRight);
        const height = this.props.height;
        const ratio = 640 / width;

        const imageSize = {
            w: (width * ratio).toFixed(0),
            h: (height * ratio).toFixed(0)
        };

        const zoom = 17;

        console.log("Image size[w:", imageSize.w, ', h:', imageSize.h, ']');

        const backgroundSourceUri = `https://maps.googleapis.com/maps/api/staticmap?center=${station.position.lat},${station.position.lng}&zoom=${zoom}&size=${imageSize.w}x${imageSize.h}&path=weight:3%7Ccolor:blue%7Cenc:{coaHnetiVjM??_SkM??~R`;

        console.log("Map URL:", backgroundSourceUri);

        return (
            <View style={{
                paddingLeft: this.props.paddingLeft,
                paddingRight: this.props.paddingRight,
                paddingTop: this.props.paddingTop,
                paddingBottom: this.props.paddingBottom
            }}>
                <NetworkImage
                    source={{ uri: backgroundSourceUri }}
                    resizeMode="cover"
                    style={{
                        width: width,
                        height: height,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4
                }}>
                    <StationMarkerView
                        number={station.number}
                        value={station.available_bikes}
                        station={station}
                        pinSize={24}
                        strokeColor={stationPinColor(station, 'BIKES')}
                        bgColor="white"
                        lineWidth={3}
                        fontSize={11}
                        fontWeight='400'
                        opacity={1}
                        style={{ width: 24, height: 24 }}
                    />
                </NetworkImage>
            </View>
        );
    }

}

export default StationDetailsMapImageHeader;
