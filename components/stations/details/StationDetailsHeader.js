import React, { Component, PropTypes } from 'react';

import StationMarkerView from '../../StationMarkerView';

import {
    Animated,
    Image,
    View,
    Text,
    ScrollView,
    processColor,
    Platform
} from 'react-native';

import PageControl from 'react-native-page-control';

import NetworkImage from '../../NetworkImage';

import { stationPinColor } from '../../../utils/Stations';

const screen = require('Dimensions').get('window');

class StationDetailsHeader extends Component {

    static propTypes = {
        station: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            currentPage: 0
        };
    }

    onScroll(event) {
        const offsetX = event.nativeEvent.contentOffset.x;
        const pageWidth = screen.width - 10;

        this.setState({
            currentPage: Math.floor((offsetX - pageWidth / 2) / pageWidth) + 1
        });
    }

    onItemTap(index) {
        console.log(index);
    }

    render() {
        console.log('--- [StationDetailsScene] Render -------------------------------------------------------------------------------------');

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

        const backgroundSourceUri = `http://image-commute-sh.s3-website-eu-west-1.amazonaws.com/contracts/${station.contract_name}/${station.contract_name}-${station.number}-1-${640}-${60}.jpg`;
        const contractBackgroundSourceUri = `http://image-commute-sh.s3-website-eu-west-1.amazonaws.com/contracts/${station.contract_name}/${station.contract_name}-1-${640}-${60}.jpg`;

        console.log("Photo URL:", backgroundSourceUri);

        return (
            <NetworkImage
                source={ (station.images || []).length > 0 ? { uri: backgroundSourceUri } : undefined }
                errorSource={{ uri: contractBackgroundSourceUri }}
                placeholderSource={{ uri: contractBackgroundSourceUri }}
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

}

export default StationDetailsHeader;
