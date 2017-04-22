import React, { Component, PropTypes } from 'react';

import BikesAvailabilityChart from '../charts/BikesAvailabilityChart'

class StationDetailsHistory extends Component {

    static propTypes = {
        station: PropTypes.object,
        data: PropTypes.array,
        padding: PropTypes.number
    };

    render() {
        return (
            <BikesAvailabilityChart station={this.props.station} data={this.props.data} padding={this.props.padding} />
        );
    }

}

export default StationDetailsHistory;
