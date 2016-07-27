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
    }

    static pinImages = {
        'red': {
            'small': {
                'opaque': <Image source={smallPinRed}  style={{ zIndex: 3 }} />,
                'transparent': <Image source={smallPinRed} style={{ opacity: 0.25, zIndex: 3 }} />
            },
            'big': {
                'opaque': <Image source={pinRed}  style={{ zIndex: 3 }} />,
                'transparent': <Image source={pinRed} style={{ opacity: 0.25, zIndex: 3 }} />
            }
        },
        'yellow': {
            'small': {
                'opaque': <Image source={smallPinYellow}  style={{ zIndex: 3 }} />,
                'transparent': <Image source={smallPinYellow} style={{ opacity: 0.25 }} />
            },
            'big': {
                'opaque': <Image source={pinYellow}  style={{ zIndex: 3 }} />,
                'transparent': <Image source={pinYellow} style={{ opacity: 0.25, zIndex: 3 }} />
            }
        },
        'green': {
            'small': {
                'opaque': <Image source={smallPinGreen}  style={{ zIndex: 3 }} />,
                'transparent': <Image source={smallPinGreen} style={{ opacity: 0.25 }} />
            },
            'big': {
                'opaque': <Image source={pinGreen}  style={{ zIndex: 3 }} />,
                'transparent': <Image source={pinGreen} style={{ opacity: 0.25, zIndex: 3 }} />
            }
        },
        'orange': {
            'small': {
                'opaque': <Image source={smallPinOrange}  style={{ zIndex: 3 }} />,
                'transparent': <Image source={smallPinOrange} style={{ opacity: 0.25, zIndex: 3 }} />
            },
            'big': {
                'opaque': <Image source={pinOrange}  style={{ zIndex: 3 }} />,
                'transparent': <Image source={pinOrange} style={{ opacity: 0.25, zIndex: 3 }} />
            }
        },
        'black': {
            'small': {
                'opaque': <Image source={smallPinBlack}  style={{ zIndex: 3 }} />,
                'transparent': <Image source={smallPinBlack} style={{ opacity: 0.25, zIndex: 3 }} />
            },
            'big': {
                'opaque': <Image source={pinBlack}  style={{ zIndex: 3 }} />,
                'transparent': <Image source={pinBlack} style={{ opacity: 0.25, zIndex: 3 }} />
            }
        }
    };

    render() {
        const station = this.props.station;

        let pinColor = 'green';

        if (station.status === 'CLOSED') {
            pinColor = 'black';
        } else if (station.available_bike_stands === 0 || station.available_bikes === 0) {
            pinColor = 'red';
        } else if (station.available_bike_stands <= 3 || station.available_bikes <= 3) {
            pinColor = 'orange';
        } else if (station.available_bike_stands <= 5 || station.available_bikes <= 5) {
            pinColor = 'yellow';
        }

        let useSmallPin = this.props.useSmallPins();

        let distanceFromPosition = this.props.distanceFromPosition(station);

        return (
            <View style={{ backgroundColor:'#FF0000', width: 64, height: 64 }}>
                {StationAnnotation.pinImages[pinColor][useSmallPin ? 'small' : 'big'][distanceFromPosition < 1000 ? 'opaque' : 'transparent']}
                {
                    <Text style={{ backgroundColor:'#00FF00', zIndex: 4, position: 'absolute', top: 24, left: 28, color: 'white', backgroundColor: 'rgba(0,0,0,0)', fontSize: 12 }}>
                        {this.props.textInfo === this.props.textInfo() ? station.available_bike_stands : station.available_bikes}
                    </Text>
                }
            </View>
        );
    }

}

export default StationAnnotation;