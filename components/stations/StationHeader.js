import React, { Component, PropTypes } from 'react';

import {
    Animated,
    Image,
    View,
    Text,
    ScrollView,
    processColor,
    Platform
} from 'react-native';

class StationHeader extends Component {

    static propTypes = {
        station: PropTypes.object,
        distance: PropTypes.number
    };

    render() {

        const station = this.props.station;

        return (
            <View style={{paddingTop: 5, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#E4E4E4'}}>
                <Text style={{
                    fontFamily: 'System',
                    fontSize: 17,
                    fontWeight: '500',
                    color: '#4A4A4A'
                }}>{station.number || ' '} - {station.name || ' '}</Text>
                <Text style={{
                    fontFamily: 'System',
                    fontSize: 12,
                    color: '#49b2d8',
                    paddingTop: 5,
                    paddingBottom: 5
                }}>{station.address || ' '}</Text>
            </View>
        );
    }

}

export default StationHeader;
