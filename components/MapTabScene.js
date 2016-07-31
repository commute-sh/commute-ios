import React, { Component, PropTypes } from 'react';
import GeoPoint from 'geopoint';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    Animated,
    Image,
    View,
    Text
} from 'react-native';

import Map from './Map';
import StationToast from './StationToast';
import * as StationService from '../services/StationService';

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

import _ from 'lodash';

class MapTabScene extends Component {

    static propTypes = {
        eventEmitter: PropTypes.object
    }

    constructor(props) {
        super(props);
        this.animationQueue = [];

        this.state = {
            stationToaster: new Animated.ValueXY(0, -500),
            fadeAnim: new Animated.Value(0),
            stationToasterVisible: true,
            stations: [],
            annotations: [],
            annotationTextInfo: 'STANDS',
            selectedIndex: 0,
            useSmallPins: false,
            position: { coords: { latitude: 48.85319, longitude: 2.34831 } }
        };

        this.onRegionChange = this.onRegionChange.bind(this);
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
        this.loadNearbyStations = this.loadNearbyStations.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.stationToasterAppear = this.stationToasterAppear.bind(this);
        this.stationToasterDisappear = this.stationToasterDisappear.bind(this);
        this.onChange = this.onChange.bind(this);
        this.mapStationToAnnotation = this.mapStationToAnnotation.bind(this);
        this.processAnimationQueue = this.processAnimationQueue.bind(this);
        this.enqueueAnimation = this.enqueueAnimation.bind(this);
        this.processAnimationQueueInternal = this.processAnimationQueueInternal.bind(this);

        this.pinImages = {
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
    }

    enqueueAnimation(fn) {
        setTimeout(() => {
            console.log('Pushing animation to queue');
            this.animationQueue.push(fn);
            this.processAnimationQueue();
        }, 0);
    }

    processAnimationQueue() {
        console.log('Processing animation queue');
        if (this.processingAnimationQueue) {
            console.log('Animation queue already processing - ignoring this processing demand');
            return ;
        }

        this.processingAnimationQueue = true;

        this.processAnimationQueueInternal();
    }

    processAnimationQueueInternal() {
        console.log('Animation queue length:', this.animationQueue.length);
        if (this.animationQueue.length) {
            console.log('Animation queue not empty  - Processing the oldest animation in queue');
            const fn = this.animationQueue.shift();
            fn(this.processAnimationQueueInternal);
        } else {
            console.log('Done with processing queue');
            this.processingAnimationQueue = false;
        }
    }

    onChange(event) {
        this.state.annotationTextInfo = event.nativeEvent.selectedSegmentIndex === 0 ? 'STANDS' : 'BIKES';
        this.setState({
            selectedIndex: event.nativeEvent.selectedSegmentIndex,
            annotations: this.state.stations.map((station) => {
                return this.mapStationToAnnotation(station, {
                    useSmallPins: this.state.useSmallPins,
                    selectedIndex: event.nativeEvent.selectedSegmentIndex
                });
            })
        });
    }

    onStationBlur(station) {
        this.enqueueAnimation((animCb) => {
            console.log('On Blur - Station:', station.number);
            this.stationToasterDisappear(300, () => {
                this.setState({station: undefined});
                animCb();
            });
        });
    }

    onStationFocus(station) {
        this.enqueueAnimation((animCb) => {
            console.log('On Focus - Station:', station.number);
            this.setState({station: station, atLeastOneStationAlreadyShown: true});
            this.stationToasterAppear(animCb);
        });
    }

    computeRegionRadiusInMeters(region) {
        let centerPoint = new GeoPoint(region.latitude, region.longitude);

        let latitudeDelta = Math.min(0.5, Math.abs(region.latitudeDelta));
        let longitudeDelta = Math.min(0.5, Math.abs(region.longitudeDelta));
        let topLeftPoint = new GeoPoint(region.latitude + latitudeDelta, region.longitude + longitudeDelta);

        let distance = centerPoint.distanceTo(topLeftPoint, true) * 1000;

        return distance;
    }

    onRefresh() {
        let region = this.state.region;

        if (!region) {
            this.loadNearbyStations(this.state.position);
        } else {
            let distance = this.computeRegionRadiusInMeters(region);

            console.log("[onRefresh] regionToCenterDistance:", regionToCenterDistance, ", distance:", distance);

            this.loadNearbyStations({ coords: { latitude: region.latitude, longitude: region.longitude } }, distance);
        }
    }

    componentDidMount() {
        this.addListenerOn(this.props.eventEmitter, 'Refresh', this.onRefresh);

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
            this.setState({position, gMapTabSceneeoPosition: new GeoPoint(position.coords.latitude, position.coords.longitude) });
            this.loadNearbyStations(position);
        });

        this.enqueueAnimation((animCb) => {
            console.log('Make station toast disappear by default');
            this.stationToasterDisappear(300, animCb);
        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    stationToasterAppear(cb) {
        // const stationToast = this.refs.stationToast;

        console.log('Enqueuing animation: [stationToasterAppear]');

        Animated.parallel([
            Animated.timing(this.state.fadeAnim, {  duration: 300, toValue: 1 }),
            Animated.timing(this.state.stationToaster, { duration: 300, toValue: { x: 0, y: 0 } })
        ]).start(() => {
            this.stationToasterVisible = true;
            // if (stationToast && stationToast.measure) {
            //     stationToast.measure((fx, fy, width, height, px, py) => {
            //     });
            // }

            cb && cb();
        });
    }

    stationToasterDisappear(duration = 300, cb) {
        console.log('Enqueuing animation: [stationToasterDisappear]');

        const stationToast = this.refs.stationToast;
        if (stationToast && stationToast.measure) {
            stationToast.measure((fx, fy, width, height, px, py) => {
                Animated.parallel([
                    Animated.timing(this.state.fadeAnim, {  duration: duration, toValue: 0 }),
                    Animated.timing(this.state.stationToaster, { duration: duration, toValue: { x: 0, y: -height } })
                ]).start(() => {
                    this.stationToasterVisible = false;
                    cb && cb();
                });
            });
        } else {
            Animated.sequence([
                Animated.timing(this.state.fadeAnim, {  duration: duration, toValue: 0 }),
                Animated.timing(this.state.stationToaster, { duration: duration, toValue: { x: 0, y: -160 } })
            ]).start(() => {
                this.stationToasterVisible = false;
                cb && cb();
            });
        }
    }

    onRegionChange(region) {
//        console.log('onRegionChange:', region);
        this.setState({
            region,
            useSmallPins: region.longitudeDelta > 0.025,
            annotations: this.state.stations.map((station) => {
                return this.mapStationToAnnotation(station, {
                    selectedIndex: this.state.selectedIndex,
                    useSmallPins: region.longitudeDelta > 0.025
                });
            })
        });
    }

    onRegionChangeComplete(region) {
//        console.log('onRegionChangeComplete:', region);

        if (!region) {
           console.log('No region defined. Abort trying to load stations ...');
        }

        this.setState({
            region,
            useSmallPins: region.longitudeDelta > 0.025,
            annotations: this.state.stations.map((station) => {
                return this.mapStationToAnnotation(station, {
                    selectedIndex: this.state.selectedIndex,
                    useSmallPins: region.longitudeDelta > 0.025
                });
            })
        });

        let distance = this.computeRegionRadiusInMeters(region);

//        console.log("[onRegionChangeComplete] regionToCenterDistance:", regionToCenterDistance, ", distance:", distance);

        if (distance <= 10000) {
            this.loadNearbyStations({ coords: { latitude: region.latitude, longitude: region.longitude } }, distance);
        }
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

        const self = this;

        const currentPosition = { latitude: position.coords.latitude.toFixed(3), longitude: position.coords.longitude.toFixed(3) };

        if (_.isEqual(currentPosition, self.state.lastPosition)) {
            return ;
        }

        console.log("isFetching: true");
        this.setState({ isFetching: true });

        StationService.getStationsNearby(position.coords, distance)
            .then((stations) => {
                console.log("Found", stations.length, "matching position", position, " and distance", distance);

                self.setState({
                    lastPosition: currentPosition,
                    stations: stations,
                    isFetching: false,
                    annotations: stations.map((station) => {
                        return self.mapStationToAnnotation(station, {
                            selectedIndex: self.state.selectedIndex,
                            useSmallPins: self.state.useSmallPins
                        });
                    })
                });
            })
            .catch(err => {
                console.log('Error:', err, 'Stack:', err.stack);

                let errorMessage = err.message;

                if (err.name === 'TypeError' && err.message === "Network request failed") {
                    errorMessage = 'Pas de connectivité réseau.';
                }

                self.props.globalEventEmitter.emit('ToastShow', { title: 'Impossible de charger la liste des stations', message: errorMessage, type: 'ERROR' });
                console.log("isFetching: false");
                self.setState({ isFetching: false })
            })
    }

    mapStationToAnnotation(station, opts) {
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

        let useSmallPin = opts.useSmallPins;

        const stationNumber = String(station.number);

        return {
            id: stationNumber,
            latitude: station.position.lat,
            longitude: station.position.lng,
            onFocus: this.onStationFocus.bind(this, station),
            onBlur: this.onStationBlur.bind(this, station),
            view:
                <Image source={this.pinImages[pinColor][useSmallPin ? 'small' : 'big']} style={{ opacity: 0.25, zIndex: 3,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                 }}>
                    <Text style={{ backgroundColor: 'rgba(0,0,0,0)', zIndex: 4, color: 'white', fontSize: 12 }}>
                        {opts.selectedIndex === 0 ? station.available_bike_stands : station.available_bikes}
                    </Text>
                </Image>
        };

    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.station !== nextState.station) {
            console.log('[MapTabScene][Updating] selected station changed');
            return true;
        } else if (this.state.selectedIndex !== nextState.selectedIndex) {
            console.log('[MapTabScene][Updating] selectedIndex changed (', this.state.selectedIndex, ', ', nextState.selectedIndex, ')');
            return true;
        } else if (this.state.useSmallPins !== nextState.useSmallPins) {
            console.log('[MapTabScene][Updating] useSmallPins changed (', this.state.useSmallPins, ', ', nextState.useSmallPins, ')');
            return true;
        } else if (this.state.stations.length !== nextState.stations.length) {
            console.log('[MapTabScene][Updating] stations length changed (', this.state.stations.length, ', ', nextState.stations.length, ')');
            return true;
        } else if (!this.state.position && nextState.position) {
            console.log('[MapTabScene][Updating][1] position changed (', this.state.position, ', ', nextState.position, ')');
            return true;
        } else if (this.state.position && this.state.position.coords && nextState.position && nextState.position.coords && (
                this.state.position.coords.latitude !== nextState.position.coords.latitude ||
                this.state.position.coords.longitude !== nextState.position.coords.longitude
            )) {
            console.log('[MapTabScene][Updating][2] position changed (', this.state.position, ', ', nextState.position, ')');
            return true;
        }

        return false;
    }

    render() {
        console.log('--- [MapTabScene] Render -------------------------------------------------------------------------------------');

        let position = this.state.position;
//        console.log('position:', position);

        let currentLocation;

        if (position) {

            currentLocation = new GeoPoint(position.coords.latitude, position.coords.longitude);
//            console.log('currentLocation:', currentLocation);

//            console.log('annotation count:', this.state.annotations.length);
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
                <Animated.View style={[
                    {
                        transform: this.state.stationToaster.getTranslateTransform(),
                        opacity: this.state.fadeAnim
                    },
                    styles.container,
                    {
                        shadowColor: "#000000",
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        shadowOffset: {
                            height: 1,
                            width: 0
                        }
                    }
                ]}>
                    {this.state.atLeastOneStationAlreadyShown && <StationToast ref="stationToast" station={this.state.station} />}
                </Animated.View>
                <Map
                    annotations={this.state.annotations}
                    location={currentLocation}
                    useSmallPins={this.state.useSmallPins}
                    onRegionChange={this.onRegionChange}
                    onRegionChangeComplete={this.onRegionChangeComplete}
                    onChange={this.onChange}
                />
            </View>
        )
    }
}

var styles = EStyleSheet.create({
    container: {
        flexDirection:'row',
        alignSelf: 'stretch',
        width: '100%',
/*        height: 147,*/
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

reactMixin(MapTabScene.prototype, Subscribable.Mixin);

// calculate styles
EStyleSheet.build();

export default MapTabScene;
