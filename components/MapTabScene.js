import React, { Component, PropTypes } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import {
    Animated,
    Image,
    View,
    Text,
    processColor,
    TouchableHighlight,
    Platform
} from 'react-native';

import moment from 'moment';

import Map from './Map';
import StationToast from './StationToast';

import { isPositionEqual } from '../utils';
import { computeRegionRadiusInMeters } from '../utils/Region';

import _ from 'lodash';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as nearbyStationActionCreators from '../actions/nearbyStations'
import * as mapActionCreators from '../actions/map'
import { filterStationsInRegion, stationPinColor } from '../utils/Stations'

class MapTabScene extends Component {

    static propTypes = {
        navigator: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.animationQueue = [];

        this.state = {
            version: 0,
            stationToaster: new Animated.ValueXY(0, -500),
            fadeAnim: new Animated.Value(0),
            stationToastVisible: true
        };
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Lifecycle
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    componentDidMount() {
        if (this.props.position) {
            this.props.actions.fetchNearbyStations(this.props.position.coords, -1, undefined, 16);
        }

        this.enqueueAnimation((animCb) => {
            console.log('Make station toast disappear by default');
            this.stationToasterDisappear(300, animCb);
        });
    }

    componentWillReceiveProps(nextProps) {

        if (
            nextProps.position &&
            nextProps.position.coords &&
            !isPositionEqual(this.props.position, nextProps.position)
        ) {
            this.props.actions.fetchNearbyStations(nextProps.position.coords, -1, undefined, 16);
        }

        if (this.props.nearbyStations.version !== nextProps.nearbyStations.version) {
            this.setState({ version: this.state.version + 1 });
        }
        if (this.props.annotationType !== nextProps.annotationType) {
            this.setState({ version: this.state.version + 1 });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        if (this.state.version !== nextState.version) {
            console.log('[MapTabScene][Updating][0] state version changed (', this.state.version, ', ', nextState.version, ')');
            return true;
        } else if (this.props.station !== nextProps.station) {
            console.log('[MapTabScene][Updating][1] selected station changed (', this.props.station ? this.props.station.number : '<undefined />', ', ', nextProps.station ? nextProps.station.number : '<undefined />', ')');
            return true;
        } else if (this.props.region && nextProps.region && (
                this.props.region.latitude !== nextProps.region.latitude ||
                this.props.region.longitude !== nextProps.region.longitude ||
                this.props.region.longitudeDelta !== nextProps.region.longitudeDelta ||
                this.props.region.latitudeDelta !== nextProps.region.latitudeDelta
            )) {
            console.log('[MapTabScene][Updating][2] position changed (', this.props.region, ', ', nextProps.region, ')');
            return true;
        }

        return false;
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Animation processing
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    stationToasterAppear(cb) {
        const self = this;
        // const stationToast = this.refs.stationToast;

        console.log('Enqueuing animation: [stationToasterAppear]');

        Animated.parallel([
            Animated.timing(this.state.fadeAnim, {  duration: 300, toValue: 1 }),
            Animated.timing(this.state.stationToaster, { duration: 300, toValue: { x: 0, y: Platform.OS === 'ios' ? 0 : -64 } })
        ]).start(() => {
            this.stationToastVisible = true;
            // if (stationToast && stationToast.measure) {
            //     stationToast.measure((fx, fy, width, height, px, py) => {
            //     });
            // }

            cb && cb.bind(self)();
        });
    }

    stationToasterDisappear(duration = 300, cb) {
        const self = this;
        console.log('Enqueuing animation: [stationToasterDisappear]');

        const stationToast = this.refs.stationToast;
        if (stationToast && stationToast.measure) {
            stationToast.measure((fx, fy, width, height, px, py) => {
                Animated.parallel([
                    Animated.timing(this.state.fadeAnim, {  duration: duration, toValue: 0 }),
                    Animated.timing(this.state.stationToaster, { duration: duration, toValue: { x: 0, y: -height } })
                ]).start((() => {
                    this.stationToastVisible = false;
                    cb && cb.bind(self)();
                }));
            });
        } else {
            Animated.sequence([
                Animated.timing(this.state.fadeAnim, {  duration: duration, toValue: 0 }),
                Animated.timing(this.state.stationToaster, { duration: duration, toValue: { x: 0, y: -160 } })
            ]).start((() => {
                this.stationToastVisible = false;
                cb && cb.bind(self)();
            }));
        }
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Events
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    onChange(event) {
        const annotationType = (Platform.OS === 'ios' ? event.nativeEvent.selectedSegmentIndex : event.selected) === 0 ? 'STANDS' : 'BIKES';
        this.props.actions.updateAnnotationType(annotationType);
        this.setState({ version: this.state.version + 1 });
    }

    onPress() {
        console.log('--------------- [MapTabScene] onPress (onStationBlur)');

        this.onStationToggleDebounce(this.onStationBlur.bind(this), undefined);
    }

    onStationToggle(fn, value) {
        console.log("--- onStationToggle:", fn, ", value:", value);
        fn(value);
    }

    onStationToggleDebounce = _.debounce(this.onStationToggle.bind(this), 300, {leading:true, trailing:false});

    onStationPress(station) {
        console.log('--------------- [MapTabScene] onStationPress');
        if (!this.props.station) {
            this.onStationToggleDebounce(this.onStationFocus.bind(this), station);
        } else if (station.number !== this.props.station.number) {
            this.onStationToggleDebounce(this.onStationFocus.bind(this), station);
        } else {
            this.onStationToggleDebounce(this.onStationBlur.bind(this), station);
        }
    }

    onStationBlur(station) {
        console.log('--------------- [MapTabScene] onStationBlur');
        this.enqueueAnimation((animCb) => {
            console.log('On Blur - Station:', station ? station.number : undefined);
            this.stationToasterDisappear(300, () => {
                this.props.actions.selectStation(undefined);
                animCb.bind(this)();
            });
        });
    }

    onStationFocus(station) {
        console.log('--------------- [MapTabScene] onStationFocus');
        this.enqueueAnimation((animCb) => {
            console.log('On Focus - Station:', station.number);
            this.props.actions.selectStation(station);
            this.stationToasterAppear(animCb);
        });
    }

    onRegionChangeComplete(region) {

        if (!region) {
//            console.debug('[MapTabScene] onRegionChangeComplete - No region defined. Abort trying to load stations ...');
            return ;
        } else if ( region && this.props.region &&
            region.latitude == this.props.region.latitude &&
            region.longitude == this.props.region.longitude &&
            region.latitudeDelta == this.props.region.latitudeDelta &&
            region.longitudeDelta == this.props.region.longitudeDelta
        ) {
            console.debug('[MapTabScene] onRegionChangeComplete - Region did not changed (region: ', JSON.stringify(region), ', this.props.region: ', JSON.stringify(this.props.region), ')');
            return ;
        }

        console.log('[MapTabScene] onRegionChangeComplete:', region, '*************************************************');

        this.props.actions.updateMapRegion(region);

        this.setState({ version: this.state.version + 1 });

        const distance = computeRegionRadiusInMeters(region);

//        console.log("[onRegionChange] regionToCenterDistance:", regionToCenterDistance, ", distance:", distance);

        if (distance <= 100000) {
            console.log("Region radius (", distance, ") <= 100000 - Fetching stations inside perimeter");
            this.props.actions.fetchNearbyStations({ latitude: region.latitude, longitude: region.longitude }, -1/*distance*/, undefined, 16);
        } else {
            console.log("Region radius (", distance, ") > 100000 - Do not fetch stations inside perimeter");
        }
    }

    onStationToastPress() {
        if (this.state.stationToastVisible) {
            this.props.navigator.push({ id: 'StationDetails', station: this.props.station });
        }
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Mappings
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    mapStationsToAnnotations(stations) {

        const { region } = this.props;

        const start = moment();

        console.log('stations is array:', _.isArray(stations));
        console.log('stations length:', stations.length);

        if (!_.isArray(stations)) {
            console.log('Stations (Not array: ', JSON.stringify(stations), ')');
        }

        if (!region) {
            console.log('Not mapping stations to annotations since there is no region available');
            return ;
        }

        const stationsInRegion = filterStationsInRegion(stations, region);

        const annotations = _.map(stationsInRegion, (station) => {
            return this.mapStationToAnnotation(station);
        });

        const end = moment();
        const duration = moment.duration(end.diff(start)).asMilliseconds();

        console.log("*** Annotations mapped in", duration, "ms");

        return annotations;
    }

    mapStationToAnnotation(station) {

        const { annotationType, center, geoLocation, pinSize } = this.props;

//        console.log(`///////////////////// annotationType: ${annotationType} - showStands: ${showStands} - value: ${showStands ? station.available_bike_stands : station.available_bikes}`);

        const showStands = annotationType === 'STANDS';

        const pinColor = stationPinColor(station, annotationType);

        const distanceToRegion = center ? station.geoLocation.distanceTo(center, true) * 1000 : -1;

        const distanceToPosition = geoLocation ? station.geoLocation.distanceTo(geoLocation, true) * 1000 : -1;

        return {
            id: String(station.number),
            station: station,
            distance: station.distance,
            latitude: station.position.lat,
            longitude: station.position.lng,

            number: station.number,
            pinSize: pinSize,
            value: showStands ? station.available_bike_stands : station.available_bikes,
            strokeColor: pinColor,
            bgColor: 'white',
            lineWidth: pinSize <= 16 ? 0 : (pinSize <= 24 ? 3 : 4),
            fontSize: (pinSize <= 24 ? 10 : 14),
            fontWeight: '900',
            opacity: (distanceToPosition > 1000 && distanceToRegion > 1000) ? 0.33 : 1,

            onPress: this.onStationPress.bind(this, station)
        };
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Render
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    render() {
        console.log('--- [MapTabScene] Render -------------------------------------------------------------------------------------');

        const annotations = this.mapStationsToAnnotations(this.props.nearbyStations.data);

        const onRegionCompleteDebounce = _.debounce(this.onRegionChangeComplete.bind(this), 300);

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
                    {this.props.atLeastOneStationAlreadyShown && this.renderStationToast()}
                </Animated.View>
                <Map
                    version={this.state.version}
                    annotations={annotations}
                    region={this.props.region}
                    geoLocation={this.props.geoLocation}
                    onRegionChange={onRegionCompleteDebounce}
                    onRegionChangeComplete={onRegionCompleteDebounce}
                    onChange={this.onChange.bind(this)}
                    onPress={this.onPress.bind(this)}
                />
            </View>
        )
    }

    renderStationToast() {
        return (
            <TouchableHighlight onPress={this.onStationToastPress.bind(this)} activeOpacity={0.5} underlayColor="white" style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <StationToast ref="stationToast" station={this.props.station} />
                </View>
            </TouchableHighlight>
        );
    }

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Styles
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Redux
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const mapStateToProps = (state) => Object.assign({}, {
    nearbyStations: state.nearbyStations,
    map: state.map,
    region: state.map.region,
    center: state.map.center,
    annotationType: state.map.annotationType,
    pinSize: state.map.pinSize,
    station: state.map.station,
    atLeastOneStationAlreadyShown: state.map.atLeastOneStationAlreadyShown,
    position: state.location.position,
    geoLocation: state.location.geoLocation
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        Object.assign({}, nearbyStationActionCreators, mapActionCreators),
        dispatch
    )
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapTabScene);
