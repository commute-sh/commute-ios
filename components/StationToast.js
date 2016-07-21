import React, {Component, PropTypes } from 'react';

import {
    Text,
    View
} from 'react-native';

export default class StationToast extends Component {
    render() {
        console.log('--- [StationToast] Render -------------------------------------------------------------------------------------');

        const station = this.props.station;

        return (
            <View style={{ flex: 1, padding: 10 }}>
                <Text>{station.name}</Text>
                <Text style={{ fontSize: 12 }}>{station.address}</Text>
                <View style={{ paddingTop: 10 }}>
                    { station.status == 'CLOSED' &&
                    <Text style={{ fontSize: 12 }}>Station fermée</Text>
                    }
                    { station.status != 'CLOSED' &&
                    <Text style={{ fontSize: 12 }}>P: {station.available_bike_stands} / V: {station.available_bikes}</Text>
                    }
                </View>
            </View>
        );
    }
}

