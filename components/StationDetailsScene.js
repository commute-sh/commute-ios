import React, { Component, PropTypes } from 'react';

import StationMarkerView from './StationMarkerView';

import {
    Animated,
    Image,
    View,
    Text,
    ScrollView,
    processColor,
    Platform
} from 'react-native';

import NativeMethodsMixin from 'react/lib/NativeMethodsMixin';

import reactMixin from 'react-mixin';

import Icon from 'react-native-vector-icons/Ionicons';

import moment from 'moment';

import LineChart from './LineChart';
import PageControl from 'react-native-page-control';

import { fetchDataByDateAndStationNumber } from '../services/StationService';

import NetworkImage from './NetworkImage';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as locationActionCreators from '../actions/location'

import { stationPinColor } from '../utils/Stations';

var screen = require('Dimensions').get('window');

class StationDetailsScene extends Component {

    static propTypes = {
        station: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 0,
            dataToShow: 'AVAILABLE_BIKES'
        };
    }

    componentDidMount() {
        this.fetchHistory(this.props.station);
        this.updateDistance(this.props.geoLocation, this.props.station);
    }

    componentWillReceiveProps(nextProps) {
        this.updateDistance(nextProps.geoLocation, nextProps.station);
    }

    updateDistance(geoLocation, station) {
        if (geoLocation && station) {
            this.setState({ distance: (geoLocation.distanceTo(station.geoLocation, true) * 1000).toFixed(0) });
        }
    }

    render() {
        console.log('--- [StationDetailsScene] Render -------------------------------------------------------------------------------------');

       return (
            <ScrollView style={{ backgroundColor: '#fff' }}>
                <View style={{ height: Platform.OS === 'ios' ? 64 : 56 }}></View>
                {this.renderHeader()}
                {this.renderContent()}
                {this.renderHistory()}
            </ScrollView>
        );
    }

    onScroll(event) {
        var offsetX = event.nativeEvent.contentOffset.x,
            pageWidth = screen.width - 10;

        this.setState({
            currentPage: Math.floor((offsetX - pageWidth / 2) / pageWidth) + 1
        });
    }

    onItemTap(index) {
        console.log(index);
    }

    renderHeader() {

        const station = this.props.station;
        console.log("screen:", screen);

        return (

            <View style={{
                width: screen.width,
                height: screen.width * 240 / 320
            }}>
                <ScrollView pagingEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false} bounces={false} onScroll={this.onScroll.bind(this)} scrollEventThrottle={16}>
                    {this.renderPhotoHeader()}
                    {this.renderMapHeader()}
                </ScrollView>
                <PageControl
                    style={{position:'absolute', left:0, right:0, bottom:64}}
                    numberOfPages={2}
                    currentPage={this.state.currentPage}
                    hidesForSinglePage={true}
                    pageIndicatorTintColor='grey'
                    indicatorSize={{width:8, height:8}}
                    currentPageIndicatorTintColor='black'
                    onPageIndicatorPress={this.onItemTap.bind(this)}
                />
                <View style={{ padding: 5, paddingLeft: 12, backgroundColor: 'rgba(0, 0, 0, 0.6)', position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                    <Text style={{ fontFamily: 'System', fontSize: 17, fontWeight: '500', color: 'white' }}>{station.number || ' '} - {station.name || ' '}</Text>
                    <Text style={{ fontFamily: 'System', fontSize: 12, color: 'white', paddingTop: 5, paddingBottom: 5 }}>{station.address || ' '}</Text>
                </View>
            </View>
        );

    }

    renderPhotoHeader() {

        const station = this.props.station || { name: ' ', address: ' ' };

        const backgroundSourceUri = `https://s3-eu-west-1.amazonaws.com/image-commute-sh/${station.contract_name}-${station.number}-1-${640}-${60}.jpg`;
        const contractBackgroundSourceUri = `https://s3-eu-west-1.amazonaws.com/image-commute-sh/contracts/${station.contract_name}-1-${640}-${60}.jpg`;

        console.log("Photo URL:", backgroundSourceUri);

        return (
            <NetworkImage
                source={{ uri: backgroundSourceUri }}
                errorSource={{ uri: contractBackgroundSourceUri }}
                style={{
                    width: screen.width,
                    height: screen.width * 240 / 320,
                }}
            />
        );
    }

    renderMapHeader() {
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

    renderContent() {

        const station = this.props.station;

        return (
            <View style={{
                paddingLeft: 16,
                paddingTop: 5,
                paddingBottom: 5
            }}>
                { station.status == 'CLOSED' && (
                    <View style={{
                        padding: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E4E4E4'
                    }}>
                        <Text style={{ fontFamily: 'System', fontSize: 12, color: '#e74c3c' }}>Station fermée</Text>
                    </View>
                )}

                { station.status != 'CLOSED' && (
                    <View style={{ paddingTop: 10, paddingBottom: 10, flexDirection: 'row',
                        borderBottomWidth: 1,
                        borderBottomColor: '#E4E4E4'
                    }}>
                        <View style={{ flex: 0.6, flexDirection: 'column' }}>
                            <Text style={{ fontFamily: 'System', fontSize: 12, color: '#4A4A4A' }}>Vélos Dispos.</Text>
                            <Text style={{ fontFamily: 'System', fontSize: 48, fontWeight: '100', color: stationPinColor(station, 'BIKES') }}>{station.available_bikes !== undefined ? station.available_bikes : '-'}</Text>
                        </View>
                        <View style={{ flex: 0.6, flexDirection: 'column', paddingLeft: 20 }}>
                            <Text style={{ fontFamily: 'System', fontSize: 12, color: '#4A4A4A' }}>Places Dispos.</Text>
                            <Text style={{ fontFamily: 'System', fontSize: 48, fontWeight: '100', color: stationPinColor(station, 'STANDS') }}>{station.available_bike_stands !== undefined ? station.available_bike_stands : '-'}</Text>
                        </View>
                        <View style={{ flex: 0.6, flexDirection: 'column', paddingLeft: 20 }}>
                            <Text style={{ fontFamily: 'System', fontSize: 12, color: '#4A4A4A' }}>Distance</Text>

                            <Text numberOfLines={1} style={{ fontFamily: 'System', fontSize: 48, fontWeight: '100', color: '#000' }}>
                                {this.state.distance !== undefined ? (this.state.distance >= 1000 ? (this.state.distance / 1000).toFixed(1) : this.state.distance) : '-'}
                                <Text style={{ fontSize: 20 }}>{this.state.distance !== undefined ? (this.state.distance >= 1000 ? ' km' : ' m') : ''}</Text>
                            </Text>
                        </View>
                        <View style={{ paddingRight: 16, width: 48, flexDirection: 'column', alignItems: "flex-end" }}>
                            { station.banking && (<Icon name='ios-card' size={24} color='#7ED321' style={{  }} />) }
                            { station.bonus && (<Icon name='ios-thumbs-up-outline' size={24} color='#50E3C2' style={{  }} />) }
                        </View>
                    </View>
                )}
            </View>
        );
    }

    renderHistory() {

        const station = this.props.station;

        console.log("this.state.data:", this.state.data);

        const graphProps = {
            data: (this.state.data || [
                { available_bikes: 0, available_bike_stands: 0, offset: 0, time: moment() },
                { available_bikes: 0, available_bike_stands: 0, offset: 1, time: moment() }
                ]).map(datum => {
                    // console.log('datum.timestamp:', datum.time);
                    datum.time = moment(datum.time);
                    return datum;
                }),
            width: screen.width - 20 * 2,
            height: screen.width * 120 / 320 - 20 * 2
        };
        graphProps.xAccessor = (d) => {
            // console.log('Moment Date:', d.time.format());
            // console.log('Date:', d.time.toDate());
            return d.time.toDate();
        };
        if (this.state.dataToShow === 'AVAILABLE_BIKES') {
            graphProps.yAccessor = (d) => {
                // console.log('d.available_bikes:', d.available_bikes);
                return d ? (d.available_bikes || 0) : 0;
            }
        } else {
            graphProps.yAccessor = (d) => d.available_bike_stands;
        }

        return (
            <View style={{ padding: 20 }}>
                <LineChart
                    icon="ios-bicycle"
                    title={ this.state.dataToShow === 'AVAILABLE_BIKES' ? "Vélos disponibles" : "Places disponibles" }
                    titleValue={ this.state.dataToShow === 'AVAILABLE_BIKES' ? station.available_bikes : station.available_bike_stands }
                    subTitle={ "Moyenne journalière: " + "nc" }
                    subTitleValue="Aujourd'hui"
                    linearGradients={
                        this.state.dataToShow === 'AVAILABLE_BIKES' ? {
                            '0': 'rgba(251,179,116,1)',
                            '0.25': 'rgba(251,179,116,0.5)',
                            '1': 'rgba(251,179,116,0)'
                        } : {
                            '0': 'rgba(71, 202, 238, 1)',
                            '0.25': 'rgba(71, 202, 238, 0.5)',
                            '1': 'rgba(71, 202, 238, 0)'
                        }
                    }
                    linearGradientColors={
                        this.state.dataToShow === 'AVAILABLE_BIKES' ?
                            [ "#fb9757", "#fc6040", "#fb412b" ] :
                            [ "#4295ff", "#2165c6", "#053a9a" ]
                    }
                    onPress={this.onChartPress.bind(this)}
                    {...graphProps}
                />
            </View>
        );
    }

    onChartPress() {
        console.log("On Chart Click:", this.state.dataToShow);
        this.setState({ dataToShow: this.state.dataToShow === 'AVAILABLE_BIKES' ? 'AVAILABLE_BIKE_STANDS' : 'AVAILABLE_BIKES' });
    }

    fetchHistory(station) {

        return fetchDataByDateAndStationNumber(station.contract_name, moment(), station.number)
            .then((data) => {
                this.setState({ data: data });
            })
            .catch(err => {
                console.log('Error:', err, 'Stack:', err.stack);
            });
    }

}

reactMixin(StationDetailsScene.prototype, NativeMethodsMixin);


const mapStateToProps = (state) => Object.assign({}, {
    position: state.location.position,
    geoLocation: state.location.geoLocation
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        Object.assign({}, locationActionCreators),
        dispatch
    )
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StationDetailsScene);
