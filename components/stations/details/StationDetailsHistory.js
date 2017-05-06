import React, { Component, PropTypes } from 'react';

import BikesAvailabilityChart from '../charts/BikesAvailabilityChart'

class StationDetailsHistory extends Component {

    static propTypes = {
        station: PropTypes.object,
        data: PropTypes.array,
        padding: PropTypes.number,
        dataToShow: PropTypes.string,
        onChartPress: PropTypes.func
    };

    render() {
        return (
            <BikesAvailabilityChart {...this.props} />
        );
    }

}

export default StationDetailsHistory;
