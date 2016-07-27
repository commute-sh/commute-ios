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

import reactMixin from 'react-mixin';

import Subscribable from 'Subscribable';

import StationAnnotation from './StationAnnotation';

class MapTabScene extends Component {

    static propTypes = {
        eventEmitter: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.state = {
            stationToaster: new Animated.ValueXY(0, -500),
            stationToasterVisible: true,
            stations: [],
            annotations: [],
            annotationTextInfo: 'STANDS'
        };

        this.onRegionChange = this.onRegionChange.bind(this);
        this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
        this.loadNearbyStations = this.loadNearbyStations.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.stationToasterAppear = this.stationToasterAppear.bind(this);
        this.stationToasterDisappear = this.stationToasterDisappear.bind(this);
        this.onChange = this.onChange.bind(this);
        this.mapStationToAnnotation = this.mapStationToAnnotation.bind(this);
        this.distanceFromPosition = this.distanceFromPosition.bind(this);
        this.useSmallPins = this.useSmallPins.bind(this);
    }

    onChange(event) {
        this.state.annotationTextInfo = event.nativeEvent.selectedSegmentIndex === 0 ? 'STANDS' : 'BIKES';
        this.setState({ annotations: this.state.stations.map(this.mapStationToAnnotation) });
    }

    onStationBlur(station) {
        console.log('On Blur - Station:', station.number);
        this.stationToasterDisappear(300);
        this.setState({ station: undefined });
    }

    onStationFocus(station) {
        console.log('On Focus - Station:', station.number);
        this.setState({ station: station, atLeastOneStationAlreadyShown: true });
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

        setTimeout(() => {
            this.stationToasterDisappear(0);
        }, 0);
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    stationToasterAppear(cb) {
        const stationToast = this.refs.stationToast;
        Animated.timing(this.state.stationToaster, { duration: 300, toValue: { x: 0, y: 0 } }).start(() => {
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

    stationToasterDisappear(duration, cb) {
        const stationToast = this.refs.stationToast;
        if (stationToast && stationToast.measure) {
            stationToast.measure((fx, fy, width, height, px, py) => {
                console.log('Component width is: ' + width);
                console.log('Component height is: ' + height);
                console.log('X offset to frame: ' + fx);
                console.log('Y offset to frame: ' + fy);
                console.log('X offset to page: ' + px);
                console.log('Y offset to page: ' + py);

                Animated.timing(this.state.stationToaster, { duration: duration, toValue: { x: 0, y: -height } }).start(() => {
                    this.stationToasterVisible = false;
                    cb && cb();
                });
            });
        } else {
            Animated.timing(this.state.stationToaster, { duration: duration, toValue: { x: 0, y: -160 } }).start(() => {
                this.stationToasterVisible = false;
                cb && cb();
            });
        }
    }

    onRegionChange(region) {
//        console.log('onRegionChange:', region);
        this.setState({ region, annotations: this.state.stations.map(this.mapStationToAnnotation) });
    }

    onRegionChangeComplete(region) {
//        console.log('onRegionChangeComplete:', region);

        if (!region) {
           console.log('No region defined. Abort trying to load stations ...');
        }

        this.setState({ region, annotations: this.state.stations.map(this.mapStationToAnnotation) });

        let centerPoint = new GeoPoint(region.latitude, region.longitude);

        let latitudeDelta = Math.min(0.5, Math.abs(region.latitudeDelta));
        let longitudeDelta = Math.min(0.5, Math.abs(region.longitudeDelta));
        let topLeftPoint = new GeoPoint(region.latitude + latitudeDelta, region.longitude + longitudeDelta);

        let regionToCenterDistance = centerPoint.distanceTo(topLeftPoint, true) * 1000;

        let distance = Math.min(10000, regionToCenterDistance);

//        console.log("[onRegionChangeComplete] regionToCenterDistance:", regionToCenterDistance, ", distance:", distance);

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

                this.setState({ stations: stations, annotations: stations.map(this.mapStationToAnnotation) });
            })
            .catch(err => {
                this.props.globalEventEmitter.emit('ToastShow', { message: err.message, type: 'error' });
            })
            .finally(() => {
                console.log("isFetching: false");
                this.setState({ isFetching: false })
            });
    }

    mapStationToAnnotation(station) {
        if (!station.geoPosition) {
            station.geoPosition = new GeoPoint(station.position.lat, station.position.lng);
        }

        const stationNumber = String(station.number);

        return {
            id: stationNumber,
            latitude: station.position.lat,
            longitude: station.position.lng,
            onFocus: this.onStationFocus.bind(this, station),
            onBlur: this.onStationBlur.bind(this, station),
            view:
                <StationAnnotation
                    station={station}
                    textInfo={() => this.state.annotationTextInfo}
                    useSmallPins={this.useSmallPins}
                    distanceFromPosition={this.distanceFromPosition}
                    style={{ width: 64, height: 64 }}
                />
        };

    }

    distanceFromPosition(station) {
        if (!this.state.geoPosition) {
            return -1;
        }

        return station.geoPosition.distanceTo(this.state.geoPosition, true) * 1000;
    }

    useSmallPins() {
        return this.state.region && this.state.region.longitudeDelta > 0.025;
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
                <Animated.View style={[{ transform: this.state.stationToaster.getTranslateTransform()}, styles.container, {
                    shadowColor: "#000000",
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    shadowOffset: {
                    height: 1,
                    width: 0
                }}]}>
                    {this.state.atLeastOneStationAlreadyShown && <StationToast ref="stationToast" station={this.state.station} />}
                </Animated.View>
                <Map
                    annotations={this.state.annotations}
                    location={currentLocation}
                    useSmallPins={this.useSmallPins()}
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
