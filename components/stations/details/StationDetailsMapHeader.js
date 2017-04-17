import React, { Component, PropTypes } from 'react';

import StationMarkerView from '../../StationMarkerView';

import NetworkImage from '../../NetworkImage';

import { stationPinColor } from '../../../utils/Stations';

const screen = require('Dimensions').get('window');

class StationDetailsPhotoHeader extends Component {

    static propTypes = {
        station: PropTypes.object
    };

    render() {
        const station = this.props.station || { name: ' ', address: ' ' };

        const imageSize = { w: 640, h: 400 };
        const zoom = 17;

        const backgroundSourceUri = `https://maps.googleapis.com/maps/api/staticmap?center=${station.position.lat},${station.position.lng}&zoom=${zoom}&size=${imageSize.w}x${imageSize.h}&path=weight:3%7Ccolor:blue%7Cenc:{coaHnetiVjM??_SkM??~R`;

        console.log("Map URL:", backgroundSourceUri);

        return (
            <NetworkImage source={{ uri: backgroundSourceUri }} style={{
                width: screen.width,
                height: screen.width * 240 / 320,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <StationMarkerView
                    number={station.number}
                    value={station.available_bikes}
                    station={station}
                    pinSize={32}
                    strokeColor={stationPinColor(station, 'BIKES')}
                    bgColor="white"
                    lineWidth={3}
                    fontSize={14}
                    fontWeight='900'
                    opacity={1}
                    style={{ width: 32, height: 32 }}
                />
            </NetworkImage>
        );
    }

}

export default StationDetailsPhotoHeader;
