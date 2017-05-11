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
    Text,
    Dimensions
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
            distance: Number.MAX_SAFE_INTEGER,
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
            this.setState({ distance: (geoLocation.distanceTo(station.geoLocation, true) * 1000) });
        }
    }

    onChangeDataToShow() {
        console.log("On Chart Click:", this.state.dataToShow);
        this.setState({ dataToShow: this.state.dataToShow === 'AVAILABLE_BIKES' ? 'AVAILABLE_BIKE_STANDS' : 'AVAILABLE_BIKES' });
    }

    render() {
        console.log('--- [StationDetailsScene] Render -------------------------------------------------------------------------------------');

        const height = Dimensions.get('window').height;
        const mapHeight = height <= 568 ? 120 : (height <= 667 ? 192 : 252);

        return (
            <ScrollView style={{ backgroundColor: '#fff', position: 'relative' }}>
                <Spacer height={ Platform.OS === 'ios' ? 64 : 56 } />

                <StationHeader station={this.props.station} />
                <StationDetailsContent station={this.props.station} distance={this.state.distance} />

                <StationDetailsHeaderMap
                    station={this.props.station}
                    geoLocation={this.props.geoLocation}
                    style={{ padding: 0, borderRadius: 12 }}
                    paddingLeft={12}
                    paddingRight={12}
                    paddingTop={0}
                    paddingBottom={0}
                    height={mapHeight}
                    dataToShow={this.state.dataToShow}
                    zoomEnabled={true}
                    onMarkerPress={this.onChangeDataToShow.bind(this)}
                />

                <StationDetailsHistory
                    station={this.props.station}
                    data={this.state.data}
                    padding={12}
                    dataToShow={this.state.dataToShow}
                    onChartPress={this.onChangeDataToShow.bind(this)}
                />

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
