import React, { Component, PropTypes } from 'react';

import {
    View,
    Text,
    ScrollView
} from 'react-native';

import PageControl from 'react-native-page-control';

import NetworkImage from '../../NetworkImage';

import StationDetailsMapHeader from './StationDetailsMapHeader';
import StationDetailsPhotoHeader from './StationDetailsPhotoHeader';

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
        console.log('--- [StationDetailsHeader] Render -------------------------------------------------------------------------------------');
        console.log("screen:", screen);

        const station = this.props.station;

        return (

            <View style={{
                width: screen.width,
                height: screen.width * 240 / 320
            }}>
                <ScrollView pagingEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false} bounces={false} onScroll={this.onScroll.bind(this)} scrollEventThrottle={16}>
                    <StationDetailsPhotoHeader station={station} />
                    <StationDetailsMapHeader station={station} />
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

}

export default StationDetailsHeader;
