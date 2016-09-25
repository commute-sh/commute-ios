import React, { Component, PropTypes } from 'react';
import GeoPoint from 'geopoint';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    Animated,
    Image,
    View,
    Text,
    processColor,
    TouchableHighlight
} from 'react-native';

import Map from './Map';
import StationToast from './StationToast';

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

import CTAnnotationView from "./CTAnnotationView";

import moment from 'moment';

import _ from 'lodash';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as nearbyStationActionCreators from '../actions/nearbyStations'

class MapTabScene extends Component {

    static propTypes = {
        navigator: PropTypes.object
    };

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
            pinSize: 32,
            center: new GeoPoint(48.85319, 2.34831)
        };

        this.onRegionChange = this.onRegionChange.bind(this);
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
        this.loadNearbyStations = this.loadNearbyStations.bind(this);
//        this.onRefresh = this.onRefresh.bind(this);
        this.stationToasterAppear = this.stationToasterAppear.bind(this);
        this.stationToasterDisappear = this.stationToasterDisappear.bind(this);
        this.onChange = this.onChange.bind(this);
        this.mapStationToAnnotation = this.mapStationToAnnotation.bind(this);
        this.mapStationsToAnnotations = this.mapStationsToAnnotations.bind(this);
        this.processAnimationQueue = this.processAnimationQueue.bind(this);
        this.enqueueAnimation = this.enqueueAnimation.bind(this);
        this.processAnimationQueueInternal = this.processAnimationQueueInternal.bind(this);
        this.renderStationToast = this.renderStationToast.bind(this);
        this._onPressButton = this._onPressButton.bind(this);

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
            annotations: this.mapStationsToAnnotations(this.props.nearbyStations.data, {
                region: this.state.region,
                pinSize: this.state.pinSize,
                selectedIndex: event.nativeEvent.selectedSegmentIndex
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

/*
    onRefresh() {
        let region = this.state.region;

        if (!region) {
            this.loadNearbyStations(this.state.center);
        } else {
            let distance = this.computeRegionRadiusInMeters(region);

            console.log("[onRefresh] region radius distance in meters:", distance);

            this.loadNearbyStations(this.state.center, distance);
        }
    }
*/

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log('navigator.geolocation.getCurrentPosition - position:', position);
                this.setState({ position, geoLocation: new GeoPoint(position.coords.latitude, position.coords.longitude) });
                this.loadNearbyStations(position);
            }, (error) => {
                alert(error.message);
            }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
            console.log('navigator.geolocation.watchPosition - position:', position);
            this.setState({ position, geoLocation: new GeoPoint(position.coords.latitude, position.coords.longitude) });
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

    componentWillReceiveProps(nextProps) {

        if (nextProps.nearbyStations.data) {

            const stations = nextProps.nearbyStations.data;

            this.setState({
                annotations: this.mapStationsToAnnotations(stations, {
                    region: this.state.region,
                    selectedIndex: this.state.selectedIndex,
                    pinSize: this.state.pinSize
                })
            });
        }
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
//         this.setState({
//             region,
//             center: new GeoPoint(region.latitude, region.longitude),
//             pinSize: region.longitudeDelta > 0.1 ? 16 : (this.state.region.longitudeDelta < 0.025 ? 32 : 24),
//             annotations: this.mapStationsToAnnotations(this.state.stations, {
//                 region: this.state.region,
//                 selectedIndex: this.state.selectedIndex,
//                 pinSize: region.longitudeDelta > 0.1 ? 16 : (this.state.region.longitudeDelta < 0.025 ? 32 : 24),
//             })
//         });
    }

    onRegionChangeComplete(region) {
        console.log('[MapTabScene] onRegionChangeComplete:', region, '*************************************************');

        if (!region) {
           console.log('No region defined. Abort trying to load stations ...');
        }

        this.setState({
            region,
            center: new GeoPoint(region.latitude, region.longitude),
            pinSize: region.longitudeDelta > 0.1 ? 16 : (region.longitudeDelta < 0.025 ? 32 : 24),
            annotations: this.mapStationsToAnnotations(this.state.stations, {
                region: region,
                selectedIndex: this.state.selectedIndex,
                pinSize: region.longitudeDelta > 0.1 ? 16 : (region.longitudeDelta < 0.025 ? 32 : 24)
            })
        });

        let distance = this.computeRegionRadiusInMeters(region);

//        console.log("[onRegionChangeComplete] regionToCenterDistance:", regionToCenterDistance, ", distance:", distance);

        if (distance <= 100000) {
            console.log("Region radius (", distance, ") <= 100000 - Fetching stations inside perimeter");
            this.loadNearbyStations({ coords: { latitude: region.latitude, longitude: region.longitude } }, distance);
        } else {
            console.log("Region radius (", distance, ") > 100000 - Do not fetch stations inside perimeter");
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

        if (_.isEqual(currentPosition, self.state.lastPosition) && (distance / 100).toFixed(0) === (this.state.lastDistance / 100).toFixed(0)) {
            console.info('Current position did not changed:', currentPosition, 'with distance:', distance, '~=', this.state.lastDistance);
            return ;
        }

        this.setState({
            lastPosition: currentPosition,
            lastDistance: distance,
        });

        this.props.actions.fetchNearbyStations(position.coords, distance);
    }

    mapStationsToAnnotations(stations, opts) {

        const start = moment();

        this.uid = (this.uid || 0) + 1;

        console.log("stations is array:", _.isArray(stations));
        console.log("stations length:", stations.length);

        if (!_.isArray(stations)) {
            console.log("Stations (Not array: ", JSON.stringify(stations), ")");
        }

        const region = opts.region;

        if (!region) {
            return ;
        }

        const latMin = region.latitude - region.latitudeDelta / 2;
        const latMax = region.latitude + region.latitudeDelta / 2;
        const lngMin = region.longitude - region.longitudeDelta / 2;
        const lngMax = region.longitude + region.longitudeDelta / 2;

        const stationsInRegion = _.filter(stations, station =>
            latMin <= station.position.lat && station.position.lat <= latMax &&
            lngMin <= station.position.lng && station.position.lng <= lngMax
        );

        const annotations = _.map(stationsInRegion, (station) => {
            return this.mapStationToAnnotation(station, opts);
        });

        const end = moment();
        const duration = moment.duration(end.diff(start)).asMilliseconds();

        console.log("*** Annotations mapped in", duration, "ms");

        return annotations;
    }

    mapStationToAnnotation(station, opts) {

        let showStands = opts.selectedIndex === 0;
        let showBikes = !showStands;

        let pinColor = '#2ecc71'; // GREEN

        if (station.status === 'CLOSED') {
            pinColor = '#000000';
        } else if (showStands && station.available_bike_stands === 0 || showBikes && station.available_bikes === 0) {
            pinColor = '#e74c3c'; // RED
        } else if (showStands && station.available_bike_stands <= 3 || showBikes && station.available_bikes <= 3) {
            pinColor = '#d35400'; // ORANGE
        } else if (showStands && station.available_bike_stands <= 5 || showBikes && station.available_bikes <= 5) {
            pinColor = '#f39c12'; // YELLOW
        }

        let pinSize = opts.pinSize;

        const stationNumber = String(station.number);

        const distanceToRegion = this.state.center ? station.geoLocation.distanceTo(this.state.center, true) * 1000 : -1;

        const distanceToPosition = this.state.geoLocation ? station.geoLocation.distanceTo(this.state.geoLocation, true) * 1000 : -1;
        // if (distanceToRegion < 1000 || distanceToPosition < 1000) {
        //     console.log('Station[', station.number, ' / ', station.name , '] distanceToRegion:', distanceToRegion, ', distanceToPosition:', distanceToPosition);
        // }

        return {
            id: this.uid + '-' + stationNumber,
//            id: stationNumber,
            latitude: station.position.lat,
            longitude: station.position.lng,
            viewIndex: stationNumber,
            onFocus: this.onStationFocus.bind(this, station),
            onBlur: this.onStationBlur.bind(this, station),
            view: <CTAnnotationView
//                key={stationNumber}
                key={this.uid + '-' + stationNumber}
                number={station.number}
                pinSize={pinSize}
                value={showStands ? station.available_bike_stands : station.available_bikes}
                strokeColor={processColor(pinColor)}
                bgColor={processColor('white')}
                lineWidth={pinSize <= 16 ? 0 : (pinSize <= 24 ? 3 : 4)}
                fontSize={(pinSize <= 24 ? 10 : 14)}
                fontWeight='900'
                opacity={(distanceToPosition > 1000 && distanceToRegion > 1000) ? 0.33 : 1}
                style={{
                    width: pinSize,
                    height: pinSize,
                }} />
        };
    }

    shouldComponentUpdate(nextProps, nextState) {

        /*if (nextState.isFetching) {
            return false;
        } else */if (this.state.station !== nextState.station) {
            console.log('[MapTabScene][Updating] selected station changed');
            return true;
        } else if (this.state.selectedIndex !== nextState.selectedIndex) {
            console.log('[MapTabScene][Updating] selectedIndex changed (', this.state.selectedIndex, ', ', nextState.selectedIndex, ')');
            return true;
        } else if (this.state.pinSize !== nextState.pinSize) {
            console.log('[MapTabScene][Updating] pinSize changed (', this.state.pinSize, ', ', nextState.pinSize, ')');
            return true;
        } else if (this.props.nearbyStations.data.length !== nextProps.nearbyStations.data.length) {
            console.log('[MapTabScene][Updating] stations length changed (', this.props.nearbyStations.data.length, ', ', nextProps.nearbyStations.data.length, ')');
            return true;
        } else if (this.state.center && nextState.center && (
                this.state.center.latitude() !== nextState.center.latitude() ||
                this.state.center.longitude() !== nextState.center.longitude()
            )) {
            console.log('[MapTabScene][Updating][2] position changed (', this.state.center, ', ', nextState.center, ')');
            return true;
        }

        return false;
    }

    render() {
        console.log('--- [MapTabScene] Render -------------------------------------------------------------------------------------');

        return (
            <View style={{flex: 1}}>
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
                    {this.state.atLeastOneStationAlreadyShown && this.renderStationToast()}
                </Animated.View>
                <Map
                    annotations={this.state.annotations}
                    center={this.state.center}
                    geoLocation={this.state.geoLocation}
                    pinSize={this.state.pinSize}
                    onRegionChange={this.onRegionChange}
                    onRegionChangeComplete={this.onRegionChangeComplete}
                    onChange={this.onChange}
                />
            </View>
        )
    }

    _onPressButton() {
        this.props.navigator.push({ id: 'StationDetails', station: this.state.station });
    }

    renderStationToast() {
        return (
            <TouchableHighlight onPress={this._onPressButton} activeOpacity={0.5} underlayColor="white" style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <StationToast ref="stationToast" station={this.state.station} />
                </View>
            </TouchableHighlight>
        );
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

// calculate styles
EStyleSheet.build();

const mapStateToProps = (state) => Object.assign({}, {
    nearbyStations: state.nearbyStations
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        Object.assign({}, nearbyStationActionCreators),
        dispatch
    )
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapTabScene);
