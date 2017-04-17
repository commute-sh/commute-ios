import React, { Component, PropTypes } from 'react';

import {
    View
} from 'react-native';

import StationClosed from '../StationClosed';
import StationInfos from '../StationInfos';

class StationDetailsContent extends Component {

    static propTypes = {
        station: PropTypes.object,
        distance: PropTypes.number
    };

    render() {

        const station = this.props.station;

        return (
            <View style={{flex: 1, paddingLeft: 16, paddingTop: 5, paddingBottom: 0}}>
                { station.status == 'CLOSED' && (
                    <StationClosed />
                )}

                { station.status != 'CLOSED' && (
                    <StationInfos station={station} distance={this.props.distance} style={{
                        borderBottomWidth: 1,
                        borderBottomColor: '#E4E4E4'
                    }} />
                )}
            </View>
        );
    }

}

export default StationDetailsContent;
