import React, { Component, PropTypes } from 'react';

import CTAnnotationView from './CTAnnotationView';

import EStyleSheet from 'react-native-extended-stylesheet';

import {
    Animated,
    Image,
    View,
    Text,
    ScrollView,
    processColor
} from 'react-native';

import NativeMethodsMixin from 'react/lib/NativeMethodsMixin';

import reactMixin from 'react-mixin';

import Icon from 'react-native-vector-icons/Ionicons';

import moment from 'moment';

import ArtChart from './ArtChart';
import PageControl from 'react-native-page-control';

import { fetchDataByDateAndStationNumber } from '../services/StationService';

var screen = require('Dimensions').get('window');

class StationDetailsScene extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 0
        };

        this.onScroll = this.onScroll.bind(this);
        this.onItemTap = this.onItemTap.bind(this);
    }

    render() {
        console.log('--- [StationDetailsScene] Render -------------------------------------------------------------------------------------');

       return (
            <View style={styles.container}>

                <View style={{ flex: 1 }}>
                    {this.renderHeader()}
                    <ScrollView>
                        {this.renderContent()}
                        {this.renderHistory()}
                    </ScrollView>
                </View>
            </View>
        );
    }

    componentDidMount() {
        this.fetchHistory(this.props.station);
    }

    getPinColor() {

        const station = this.props.station;

        const showStands = false;
        const showBikes = ! showStands;

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

        return pinColor;
    }

    getColor(items) {

        let pinColor = '#2ecc71';

        if (items === 0) {
            pinColor = '#e74c3c';
        } else if (items <= 3) {
            pinColor = '#d35400';
        } else if (items <= 5) {
            pinColor = '#f39c12';
        }

        return pinColor;
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
                <ScrollView pagingEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false} bounces={false} onScroll={this.onScroll} scrollEventThrottle={16}>
                    {this.renderPhotoHeader()}
                    {this.renderMapHeader()}
                </ScrollView>
                <PageControl style={{position:'absolute', left:0, right:0, bottom:64}} numberOfPages={2} currentPage={this.state.currentPage} hidesForSinglePage={true} pageIndicatorTintColor='grey' indicatorSize={{width:8, height:8}} currentPageIndicatorTintColor='black' onPageIndicatorPress={this.onItemTap} />
                <View style={{ padding: 5, paddingLeft: 12, backgroundColor: 'rgba(0, 0, 0, 0.6)', position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                    <Text style={{ fontFamily: 'System', fontSize: 17, fontWeight: '500', color: 'white' }}>{station.name || ' '}</Text>
                    <Text style={{ fontFamily: 'System', fontSize: 12, color: 'white', paddingTop: 5, paddingBottom: 5 }}>{station.address || ' '}</Text>
                </View>
            </View>
        );

    }

    renderPhotoHeader() {

        const station = this.props.station || { name: ' ', address: ' ' };

        const backgroundSourceUri = `https://s3-eu-west-1.amazonaws.com/image-commute-sh/${station.contract_name}-${station.number}-1-${640}-${60}.jpg`;

        console.log("Photo URL:", backgroundSourceUri);

        return (
            <Image source={{ uri: backgroundSourceUri }} style={{
                width: screen.width,
                height: screen.width * 240 / 320,
            }} />
        );
    }

    renderMapHeader() {
        const station = this.props.station || { name: ' ', address: ' ' };

        const imageSize = { w: 640, h: 400 };
        const zoom = 17;

        const pinSize = 16;
        const pinColor = this.getPinColor();

        const backgroundSourceUri = `https://maps.googleapis.com/maps/api/staticmap?center=${station.position.lat},${station.position.lng}&zoom=${zoom}&size=${imageSize.w}x${imageSize.h}&path=weight:3%7Ccolor:blue%7Cenc:{coaHnetiVjM??_SkM??~R`;

        console.log("Map URL:", backgroundSourceUri);

        return (
            <Image source={{ uri: backgroundSourceUri }} style={{
                width: screen.width,
                height: screen.width * 240 / 320,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <CTAnnotationView
                    number={station.number}
                    pinSize={pinSize}
                    value={station.available_bikes}
                    strokeColor={processColor(pinColor)}
                    bgColor={processColor('white')}
                    lineWidth={pinSize <= 16 ? 0 : (pinSize <= 24 ? 3 : 4)}
                    fontSize={(pinSize <= 24 ? 10 : 14)}
                    fontWeight='900'
                    opacity={1}
                    style={{
                        width: pinSize,
                        height: pinSize,
                        backgroundColor: 'rgba(0, 0, 0, 0)'
                    }}
                />
            </Image>
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
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={{ fontFamily: 'System', fontSize: 12, color: '#4A4A4A' }}>Vélos Dispos.</Text>
                            <Text style={{ fontFamily: 'System', fontSize: 48, fontWeight: '100', color: this.getColor(station.available_bikes) }}>{station.available_bikes !== undefined ? station.available_bikes : '-'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={{ fontFamily: 'System', fontSize: 12, color: '#4A4A4A' }}>Places Dispos.</Text>
                            <Text style={{ fontFamily: 'System', fontSize: 48, fontWeight: '100', color: this.getColor(station.available_bike_stands) }}>{station.available_bike_stands !== undefined ? station.available_bike_stands : '-'}</Text>
                        </View>
                        <View style={{ paddingRight: 16, width: 32, flex: 1, flexDirection: 'column', alignItems: "flex-end" }}>
                            { station.banking && (<Icon name='ios-card' size={24} color='#7ED321' style={{  }} />) }
                            { station.bonus && (<Icon name='ios-thumbs-up-outline' size={24} color='#50E3C2' style={{  }} />) }
                        </View>
                    </View>
                )}
            </View>
        );
    }

    renderHistory() {

        const showMax = true;
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
        if (showMax) {
            graphProps.yAccessor = (d) => {
                // console.log('d.available_bikes:', d.available_bikes);
                return d.available_bikes;
            }
        } else {
            graphProps.yAccessor = (d) => d.available_bike_stands;
        }

        return (
            <View style={{ padding: 20 }}>
                <ArtChart
                    icon="ios-bicycle"
                    title="Vélos disponibles"
                    titleValue={station.available_bikes}
                    subTitle={"Moyenne journalière: " + "nc"}
                    subTitleValue="Aujourd'hui"
                    {...graphProps} />
            </View>
        );
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

var styles = EStyleSheet.create({
    container: {
        flexDirection:'row',
        alignSelf: 'stretch',
        width: '100%',
        height: '100%',
        top: 64,
        left: 0,
        position: 'absolute',
        zIndex: 1000,
        backgroundColor: 'white'
    }
});

// calculate styles
EStyleSheet.build();

export default StationDetailsScene;
