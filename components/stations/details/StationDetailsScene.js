import React, { Component, PropTypes } from 'react';

import StationHeader from '../StationHeader';
import StationDetailsHeaderMap from './StationDetailsHeaderMap';
import StationDetailsHistory from './StationDetailsHistory';
import StationDetailsContent from './StationDetailsContent';

import {
    View,
    ScrollView,
    Platform,
    TouchableOpacity,
    TouchableHighlight,
    Text
} from 'react-native';

import moment from 'moment';

import { fetchDataByDateAndStationNumber } from '../../../services/StationService';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as locationActionCreators from '../../../actions/location'

import Spacer from '../../Spacer'

class StationDetailsScene extends Component {

    static propTypes = {
        station: PropTypes.object,
        geoLocation: PropTypes.object,
        navigator: PropTypes.object
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
            <ScrollView style={{ backgroundColor: '#fff', position: 'relative' }}>
                <Spacer height={ Platform.OS === 'ios' ? 64 : 56 } />
                <StationHeader station={this.props.station} />
                <StationDetailsContent station={this.props.station} distance={this.state.distance} />

                <TouchableHighlight
                    onPress={this.onStationDetailsHeaderMapPress.bind(this)}
                    activeOpacity={0.5}
                    underlayColor="white"
                    style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <StationDetailsHeaderMap
                            station={this.props.station}
                            geoLocation={this.props.geoLocation}
                            style={{ padding: 0, borderRadius: 12 }}
                            paddingLeft={12}
                            paddingRight={12}
                            paddingTop={0}
                            paddingBottom={0}
                            height={256}
                            zoomEnabled={false}
                        />
                    </View>
                </TouchableHighlight>

                <StationDetailsHistory station={this.props.station} data={this.state.data} padding={12} />
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
