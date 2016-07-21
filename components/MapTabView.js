import React, { Component, PropTypes } from 'react';
import GeoPoint from 'geopoint';
import EStyleSheet from 'react-native-extended-stylesheet';
import _ from 'lodash'
import {
    Animated,
    Image,
    View
} from 'react-native';

import Map from './Map';
import StationToast from './StationToast';
import * as StationService from '../services/StationService';
import moment from 'moment';

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

import reactMixin from 'react-mixin';

import Subscribable from 'Subscribable';

class MapTabView extends Component {

    static propTypes = {
        eventEmitter: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            stationToaster: new Animated.ValueXY(),
            stationToasterVisible: true,
            annotations: []
        };

        this.onRegionChange = this.onRegionChange.bind(this);
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
        this.loadNearbyStations = this.loadNearbyStations.bind(this);
        this.pushStationToAnnotations = this.pushStationToAnnotations.bind(this);
        this.onRefresh = this.onRefresh.bind(this);

        this.annotations = [];
        this.annotationsById = {};
        this.pinImages = {
            'red': {
                'small': {
                    'opaque': <Image source={smallPinRed} />,
                    'transparent': <Image source={smallPinRed} style={{ opacity: 0.25 }} />
                },
                'big': {
                    'opaque': <Image source={pinRed} />,
                    'transparent': <Image source={pinRed} style={{ opacity: 0.25 }} />
                }
            },
            'yellow': {
                'small': {
                    'opaque': <Image source={smallPinYellow} />,
                    'transparent': <Image source={smallPinYellow} style={{ opacity: 0.25 }} />
                },
                'big': {
                    'opaque': <Image source={pinYellow} />,
                    'transparent': <Image source={pinYellow} style={{ opacity: 0.25 }} />
                }
            },
            'green': {
                'small': {
                    'opaque': <Image source={smallPinGreen} />,
                    'transparent': <Image source={smallPinGreen} style={{ opacity: 0.25 }} />
                },
                'big': {
                    'opaque': <Image source={pinGreen} />,
                    'transparent': <Image source={pinGreen} style={{ opacity: 0.25 }} />
                }
            },
            'orange': {
                'small': {
                    'opaque': <Image source={smallPinOrange} />,
                    'transparent': <Image source={smallPinOrange} style={{ opacity: 0.25 }} />
                },
                'big': {
                    'opaque': <Image source={pinOrange} />,
                    'transparent': <Image source={pinOrange} style={{ opacity: 0.25 }} />
                }
            },
            'black': {
                'small': {
                    'opaque': <Image source={smallPinBlack} />,
                    'transparent': <Image source={smallPinBlack} style={{ opacity: 0.25 }} />
                },
                'big': {
                    'opaque': <Image source={pinBlack} />,
                    'transparent': <Image source={pinBlack} style={{ opacity: 0.25 }} />
                }
            }
        };
    }

    onStationBlur(station) {
        console.log('On Blur - Station:', station.number);
        this.stationToasterDisappear();
        this.setState({ station: undefined });
    }

    onStationFocus(station) {
        console.log('On Focus - Station:', station.number);
        this.setState({ station: station });
        this.stationToasterAppear();
    }

    onRefresh() {
        let region = this.state.region;

        if (!region) {
            this.loadNearbyStations(this.state.position);
        } else {
            let centerPoint = new GeoPoint(region.latitude, region.longitude);

            let latitudeDelta = Math.min(0.5, Math.abs(region.latitudeDelta));
            let longitudeDelta = Math.min(0.5, Math.abs(region.longitudeDelta));
            let topLeftPoint = new GeoPoint(region.latitude + latitudeDelta, region.longitude + longitudeDelta);

            let regionToCenterDistance = centerPoint.distanceTo(topLeftPoint, true) * 1000;
            let distance = Math.min(10000, regionToCenterDistance);

            console.log("[onRefresh] regionToCenterDistance:", regionToCenterDistance, ", distance:", distance);

            this.loadNearbyStations({ coords: { latitude: region.latitude, longitude: region.longitude } }, distance);
        }
    }

    componentDidMount() {
        this.addListenerOn(this.props.eventEmitter, 'Refresh', this.onRefresh);

        this.stationToasterDisappear();

        navigator.geolocation.getCurrentPosition((position) => {
            console.log('navigator.geolocation.getCurrentPosition - position:', position);
                this.setState({ position, geoPosition: new GeoPoint(position.coords.latitude, position.coords.longitude) });
                this.loadNearbyStations(position);
            }, (error) => {
                alert(error.message)
            }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
            console.log('navigator.geolocation.watchPosition - position:', position);
            this.setState({position, geoPosition: new GeoPoint(position.coords.latitude, position.coords.longitude) });
            this.loadNearbyStations(position);
        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    stationToasterAppear(cb) {
        const stationToast = this.refs.stationToast;
        Animated.timing(this.state.stationToaster, { duration: 150, toValue: { x: 0, y: 0 } }).start(() => {
            this.stationToasterVisible = true;
            if (stationToast && stationToast.measure) {
                stationToast.measure((fx, fy, width, height, px, py) => {
                    console.log('Component width is: ' + width);
                    console.log('Component height is: ' + height);
                    console.log('X offset to frame: ' + fx);
                    console.log('Y offset to frame: ' + fy);
                    console.log('X offset to page: ' + px);
                    console.log('Y offset to page: ' + py);
                });
            }

            cb && cb();
        });
    }

    stationToasterDisappear(cb) {
        Animated.timing(this.state.stationToaster, { duration: 150, toValue: { x: 0, y: -160 } }).start(() => {
            this.stationToasterVisible = false;
            cb && cb();
        });
    }

    onRegionChange(region) {
        console.log('onRegionChange:', region);
        this.setState({region});
    }

    onRegionChangeComplete(region) {
        console.log('onRegionChangeComplete:', region);

        if (!region) {
           console.log('No region defined. Abort trying to load stations ...');
        }

        this.setState({region});

        let centerPoint = new GeoPoint(region.latitude, region.longitude);

        let latitudeDelta = Math.min(0.5, Math.abs(region.latitudeDelta));
        let longitudeDelta = Math.min(0.5, Math.abs(region.longitudeDelta));
        let topLeftPoint = new GeoPoint(region.latitude + latitudeDelta, region.longitude + longitudeDelta);

        let regionToCenterDistance = centerPoint.distanceTo(topLeftPoint, true) * 1000;

        let distance = Math.min(10000, regionToCenterDistance);

        console.log("[onRegionChangeComplete] regionToCenterDistance:", regionToCenterDistance, ", distance:", distance);

        this.loadNearbyStations({ coords: { latitude: region.latitude, longitude: region.longitude } }, distance);
    }

    loadNearbyStations(position, distance = 1000) {

        if (!position) {
            console.info('No position available');
            return ;
        }

        if (this.state.isFetching) {
            console.info('Already fetching nearest stations');
            return ;
        }

        console.log("isFetching: true");
        this.setState({ isFetching: true });

        return StationService.getStationsNearby(position.coords, distance)
            .then((stations) => {
                console.log("Found", stations.length, "matching position", position, " and distance", distance);

                stations.forEach(station => {
                    this.pushStationToAnnotations(station);
                });

                this.setState({ annotations: this.annotations });
            })
            .catch(err => alert(err))
            .finally(() => {
                console.log("isFetching: false");
                this.setState({ isFetching: false })
            });
    }

    pushStationToAnnotations(station) {
        if (!station.geoPosition) {
            station.geoPosition = new GeoPoint(station.position.lat, station.position.lng);
        }

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

        let useSmallPin = this.state.region && this.state.region.longitudeDelta > 0.025;

        let distanceFromPosition = this.distanceFromPosition(station);

        const stationNumber = String(station.number);

        let annotation = this.annotationsById[stationNumber];
        if (annotation) {
            let image = this.pinImages[pinColor][useSmallPin ? 'small' : 'big'][distanceFromPosition < 1000 ? 'opaque' : 'transparent'];
            if (annotation.view != image) {
                annotation.view = image;
            }
        } else {
            annotation = {
                id: stationNumber,
                latitude: station.position.lat,
                longitude: station.position.lng,
                onFocus: this.onStationFocus.bind(this, station),
                onBlur: this.onStationBlur.bind(this, station),
                view: this.pinImages[pinColor][useSmallPin ? 'small' : 'big'][distanceFromPosition < 1000 ? 'opaque' : 'transparent']
            };

            this.annotations.push(annotation);
            this.annotationsById[stationNumber] = annotation;
        }
    }

    distanceFromPosition(station) {
        if (!this.state.geoPosition) {
        return -1;
    }

    return station.geoPosition.distanceTo(this.state.geoPosition, true) * 1000;
}

    render() {
        console.log('--- [MapTabView] Render -------------------------------------------------------------------------------------');

        let position = this.state.position;
        console.log('position:', position);

        let currentLocation;

        if (position) {

            currentLocation = new GeoPoint(position.coords.latitude, position.coords.longitude);
            console.log('currentLocation:', currentLocation);

            console.log('annotation count:', this.state.annotations.length);
        }

        return (
            <View style={{flex: 1}}>
                {/*
                     <Image source={require('../images/paris.jpg')} style={styles.container}>
                         <BlurView blurType="light" style={{ flex: 1 }}>
                             <Text style={styles.welcome}>Coucou</Text>
                         </BlurView>
                     </Image>
                 */}
                <Animated.View style={[{ transform: this.state.stationToaster.getTranslateTransform()}, styles.container]}>
                    { this.state.station && <StationToast ref="stationToast" station={this.state.station} /> }
                </Animated.View>
                <Map annotations={this.state.annotations} location={currentLocation} onRegionChange={this.onRegionChange} onRegionChangeComplete={this.onRegionChangeComplete} />
            </View>
        )
    }
}

var styles = EStyleSheet.create({
    container: {
        flexDirection:'row',
        alignSelf: 'stretch',
        width: '100%',
        height: 160,
        top: 64,
        left: 0,
        position: 'absolute',
        zIndex: 1000,
        backgroundColor: 'white'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
        color: '#FFFFFF',
    }
});

reactMixin(MapTabView.prototype, Subscribable.Mixin);

// calculate styles
EStyleSheet.build();

export default MapTabView;
