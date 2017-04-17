import React, { Component, PropTypes } from 'react';

import StationDetailsHeader from './StationDetailsHeader';
import StationDetailsHistory from './StationDetailsHistory';
import StationDetailsContent from './StationDetailsContent';

import {
    View,
    ScrollView,
    Platform
} from 'react-native';

import moment from 'moment';

import { fetchDataByDateAndStationNumber } from '../../../services/StationService';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as locationActionCreators from '../../../actions/location'

import Spacer from '../../Spacer'

class StationDetailsScene extends Component {

    static propTypes = {
        station: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            distance: Number.MAX_SAFE_INTEGER
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
            this.setState({ distance: (geoLocation.distanceTo(station.geoLocation, true) * 1000) });
        }
    }

    render() {
        console.log('--- [StationDetailsScene] Render -------------------------------------------------------------------------------------');

       return (
            <ScrollView style={{ backgroundColor: '#fff' }}>
                <Spacer height={ Platform.OS === 'ios' ? 64 : 56 } />
                <StationDetailsHeader station={this.props.station} />
                <StationDetailsContent station={this.props.station} distance={this.state.distance} />
                <StationDetailsHistory station={this.props.station} data={this.state.data} />
                <Spacer height={ Platform.OS === 'ios' ? 48 : 0 } />
            </ScrollView>
        );
    }

    fetchHistory(station) {

        return fetchDataByDateAndStationNumber(station.contract_name, moment(), station.number)
            .then(data => {
                this.setState({ data });
            })
            .catch(err => {
                console.log('Error:', err, 'Stack:', err.stack);
            });
    }

}


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
