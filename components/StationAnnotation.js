import React, { Component, PropTypes } from 'react';

import {
    Text,
    View,
    Image
} from 'react-native';

const pinGreen = require('../images/location-pin-green@2x.png');
const pinYellow = require('../images/location-pin-yellow@2x.png');
const pinOrange = require('../images/location-pin-orange@2x.png');
const pinRed = require('../images/location-pin-red@2x.png');
const pinBlack = require('../images/location-pin-black@2x.png');

const smallPinGreen = require('../images/location-pin-green-small@2x.png');
const smallPinYellow = require('../images/location-pin-yellow-small@2x.png');
const smallPinOrange = require('../images/location-pin-orange-small@2x.png');
const smallPinRed = require('../images/location-pin-red-small@2x.png');
const smallPinBlack = require('../images/location-pin-black-small@2x.png');

class StationAnnotation extends Component {

    static propTypes = {
        station: PropTypes.object,
        textInfo: PropTypes.func,
        useSmallPins: PropTypes.func,
        distanceFromPosition: PropTypes.func
    };

    static defaultTypes = {
        textInfo: 'STANDS'
    };

    static pinImages = {
        'red': {
            'small': smallPinRed,
            'big': pinRed
        },
        'yellow': {
            'small': smallPinYellow,
            'big': pinYellow
        },
        'green': {
            'small': smallPinGreen,
            'big': pinGreen
        },
        'orange': {
            'small': smallPinOrange,
            'big': pinOrange
        },
        'black': {
            'small': smallPinBlack,
            'big': pinBlack
        }
    };

    render() {
        const station = this.props.station;

        let pinColor = '#27ae60';

        if (station.status === 'CLOSED') {
            pinColor = '#2c3e50';
        } else if (station.available_bike_stands === 0 || station.available_bikes === 0) {
            pinColor = '#e74c3c';
        } else if (station.available_bike_stands <= 3 || station.available_bikes <= 3) {
            pinColor = '#e67e22';
        } else if (station.available_bike_stands <= 5 || station.available_bikes <= 5) {
            pinColor = '#f1c40f';
        }

        let useSmallPin = this.props.useSmallPins();

        let distanceFromPosition = this.props.distanceFromPosition(station);

        return (
            <Image source={StationAnnotation.pinImages[pinColor][useSmallPin ? 'small' : 'big']} style={{
                zIndex: 3,
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: distanceFromPosition < 1000 ? 1 : 0.25
            }}>
                <Text style={{ backgroundColor: 'rgba(0,0,0,0)', zIndex: 4, color: 'white', fontSize: 12 }}>
                    {this.props.textInfo === 'STANDS' ? station.available_bike_stands : station.available_bikes}
                </Text>
            </Image>
        );
    }

}

export default StationAnnotation;