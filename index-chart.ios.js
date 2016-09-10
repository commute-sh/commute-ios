import React, {Component, PropTypes } from 'react';

import {
    Animated,
    AppRegistry,
    StyleSheet,
    NavigatorIOS,
    Navigator,
    TabBarIOS,
    ScrollView,
    MapView,
    TouchableHighlight,
    TouchableOpacity,
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';

import { fetchDataByDateAndStationNumber } from './services/StationService';

import moment from 'moment';

import LineChart from './components/LineChart';

var screen = require('Dimensions').get('window');

class App extends Component {

    state = {
        data: []
    };

    componentWillMount() {
        fetchDataByDateAndStationNumber('Paris', moment(), 44101).then((data) => {
            this.setState({ data: data });
        });
    }

    render() {
        console.log('this.state:', this.state);

        return (
            <View>
                {this.state.data.length >= 2 && this.renderHistory()}
            </View>
        );
    }


    renderHistory() {

        const showMax = true;

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
                <LineChart
                    icon="ios-bicycle"
                    title="Vélos disponibles"
                    titleValue={2}
                    subTitle="Moyenne journalière: 1"
                    subTitleValue="Aujourd'hui"
                    {...graphProps} />
            </View>
        );
    }


}

AppRegistry.registerComponent('commute', () => App);
