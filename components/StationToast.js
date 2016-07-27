import React, {Component, PropTypes } from 'react';

import {
    Text,
    View
} from 'react-native';

import NativeMethodsMixin from 'NativeMethodsMixin';

import reactMixin from 'react-mixin';

import Icon from 'react-native-vector-icons/Ionicons';

class StationToast extends Component {
    render() {
        console.log('--- [StationToast] Render -------------------------------------------------------------------------------------');

        const station = this.props.station || { name: ' ', address: ' ' };

        return (
            <View style={{ flex: 1, paddingLeft: 16, paddingTop: 5, paddingBottom: 5 }}>
                <View style={{ paddingTop: 5, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#E4E4E4' }}>
                    <Text style={{ fontSize: 17, fontWeight: '500', fontFamily: 'System', color: '#4A4A4A' }}>{station.name || ' '}</Text>
                    <Text style={{ fontSize: 12, color: '#325d7a', paddingTop: 5, paddingBottom: 5 }}>{station.address || ' '}</Text>
                </View>

                { station.status == 'CLOSED' && (
                    <View>
                        <Text style={{ fontSize: 12 }}>Station fermée</Text>
                    </View>
                )}

                { station.status != 'CLOSED' && (
                    <View style={{ paddingTop: 10, flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={{ fontSize: 12, color: '#4A4A4A' }}>Vélos Dispos.</Text>
                            <Text style={{ fontFamily: 'System', fontSize: 48, fontWeight: '100', color: this.getColor(station.available_bike_stands) }}>{station.available_bike_stands !== undefined ? station.available_bike_stands : '-'}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={{ fontSize: 12, color: '#4A4A4A' }}>Places Dispos.</Text>
                            <Text style={{ fontFamily: 'System', fontSize: 48, fontWeight: '100', color: this.getColor(station.available_bikes) }}>{station.available_bikes !== undefined ? station.available_bikes : '-'}</Text>
                        </View>
                        <View style={{ paddingRight: 16, width: 32, flex: 1, flexDirection: 'column', alignItems: "flex-end" }}>
                            { station.banking && (<Icon name='ios-card' size={24} color='#7ED321' style={{  }} />) }
                            { station.bonus && (<Icon name='ios-thumbs-up-outline' size={24} color='#50E3C2' style={{  }} />) }
                        </View>
                    </View>
                )}

            </View>
        );
    }

    getColor(items) {

        let pinColor = 'green';

        if (items === 0) {
            pinColor = 'red';
        } else if (items <= 3) {
            pinColor = 'orange';
        } else if (items <= 5) {
            pinColor = 'yellow';
        }

        return pinColor;
    }
}


reactMixin(StationToast.prototype, NativeMethodsMixin);

export default StationToast;

