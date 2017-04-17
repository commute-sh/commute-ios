import React, { Component, PropTypes } from 'react';

import {
    View
} from 'react-native';

import moment from 'moment';

import LineChart from '../../LineChart';

const screen = require('Dimensions').get('window');

class StationDetailsHistory extends Component {

    static propTypes = {
        station: PropTypes.object,
        data: PropTypes.array
    };

    constructor(props) {
        super(props);

        this.state = {
            dataToShow: 'AVAILABLE_BIKES'
        };
    }

    computeGraphProps() {

        const graphProps = {
            data: (this.props.data || [
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

        return graphProps;
    }

    render() {

        const station = this.props.station;
        const data = this.props.data;
        const dataToShow = this.state.dataToShow;

        console.log("this.props.data:", data);

        const graphProps = this.computeGraphProps();

        const linearGradients = {
            'AVAILABLE_BIKES': {
                '0': 'rgba(251,179,116,1)',
                '0.25': 'rgba(251,179,116,0.5)',
                '1': 'rgba(251,179,116,0)'
            },
            'AVAILABLE_BIKE_STANDS': {
                '0': 'rgba(71, 202, 238, 1)',
                '0.25': 'rgba(71, 202, 238, 0.5)',
                '1': 'rgba(71, 202, 238, 0)'
            }
        };

        const linearGradientColors = {
            'AVAILABLE_BIKES': [ "#fb9757", "#fc6040", "#fb412b" ],
            'AVAILABLE_BIKE_STANDS': [ "#4295ff", "#2165c6", "#053a9a" ]
        };

        const subTitle = "Moyenne journalière: " + "nc";
        const subTitleValue = "Aujourd'hui";

        const title = dataToShow === 'AVAILABLE_BIKES' ? "Vélos disponibles" : "Places disponibles";
        const titleValue = dataToShow === 'AVAILABLE_BIKES' ? station.available_bikes : station.available_bike_stands;

        return (
            <View style={{ padding: 20 }}>
                <LineChart
                    icon="ios-bicycle"
                    title={title}
                    titleValue={titleValue}
                    subTitle={subTitle}
                    subTitleValue={subTitleValue}
                    linearGradients={linearGradients[dataToShow]}
                    linearGradientColors={linearGradientColors[dataToShow]}
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

}

export default StationDetailsHistory;
