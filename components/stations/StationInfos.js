import React, { Component, PropTypes } from 'react';

import {
    View,
    Text
} from 'react-native';

import Color from 'color';

import Icon from 'react-native-vector-icons/Ionicons';

import { stationPinColor } from '../../utils/Stations';

class StationInfos extends Component {

    static propTypes = {
        station: PropTypes.object,
        distance: PropTypes.number,
        style: PropTypes.object
    };

    render() {

        const station = this.props.station;

        const distanceInUnit = (
            this.props.distance >= 1000 ?
                (this.props.distance >= 100000 ? '-' : (this.props.distance / 1000).toFixed(1)) :
                this.props.distance.toFixed(0)
        ) || 'N/A';
        const distanceUnit = this.props.distance >= 1000 ? (this.props.distance >= 100000 ? '' : ' km') : ' m';

        return (
            <View style={Object.assign({}, {flexDirection: 'row'}, this.props.style)}>
                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',  alignItems: 'center' }}>
                    <View style={{flex: 1, flexDirection: 'column', padding: 12, paddingTop: 0, paddingBottom: 5 }}>
                        <Text numberOfLines={1} ellipsizeMode="tail"
                              style={{fontFamily: 'System', fontSize: 12, color: '#4A4A4A'}}>Vélos Dispos.</Text>
                        <Text style={{
                            fontFamily: 'System',
                            fontSize: 48,
                            fontWeight: '100',
                            color: stationPinColor(station, 'BIKES')
                        }}>{station.available_bikes}</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'column', padding: 12, paddingTop: 0, paddingBottom: 5 }}>
                        <Text numberOfLines={1} ellipsizeMode="tail"
                              style={{fontFamily: 'System', fontSize: 12, color: '#4A4A4A'}}>Places Dispos.</Text>
                        <Text style={{
                            fontFamily: 'System',
                            fontSize: 48,
                            fontWeight: '100',
                            color: stationPinColor(station, 'STANDS')
                        }}>{station.available_bike_stands}</Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'column', padding: 12, paddingTop: 0, paddingBottom: 5 }}>
                        <Text numberOfLines={1} ellipsizeMode="tail"
                              style={{fontFamily: 'System', fontSize: 12, color: '#4A4A4A'}}>Distance</Text>

                        <Text numberOfLines={1}
                              adjustsFontSizeToFit={true}
                              minimumFontScale={0.1}
                              style={{
                                  flexGrow: 1,
                                  fontFamily: 'System',
                                  fontSize: 48,
                                  fontWeight: '100',
                                  color: '#2c3e50'
                              }}>
                            {distanceInUnit}
                            <Text
                                style={{ fontSize: 20, color: '#2c3e50' }}>{distanceUnit}</Text>
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'column', alignItems: "flex-end", padding: 12, paddingTop: 0, paddingBottom: 5 }}>
                    { station.banking && (<Icon name='ios-card-outline' size={24} color={Color('#2c3e50').alpha(0.5)} style={{}} />) }
                    { station.bonus && (<Icon name='ios-thumbs-up-outline' size={24} color={Color('#2c3e50').alpha(0.5)} style={{}} />) }
                </View>
            </View>
        );
    }

}

export default StationInfos;
