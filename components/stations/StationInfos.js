import React, { Component, PropTypes } from 'react';

import {
    View,
    Text
} from 'react-native';

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
                (this.props.distance / 1000).toFixed(1) :
                this.props.distance.toFixed(0)
        ) || 'N/A';
        const distanceUnit = this.props.distance >= 1000 ? ' km' : ' m';

        return (
            <View style={Object.assign({}, {paddingTop: 10, flexDirection: 'row'}, this.props.style)}>
                <View style={{flex: 0.7, flexDirection: 'column'}}>
                    <Text numberOfLines={1} ellipsizeMode="tail"
                          style={{fontFamily: 'System', fontSize: 12, color: '#4A4A4A'}}>Vélos Dispos.</Text>
                    <Text style={{
                        fontFamily: 'System',
                        fontSize: 48,
                        fontWeight: '100',
                        color: stationPinColor(station, 'BIKES')
                    }}>{station.available_bikes}</Text>
                </View>
                <View style={{flex: 0.7, flexDirection: 'column', paddingLeft: 5}}>
                    <Text numberOfLines={1} ellipsizeMode="tail"
                          style={{fontFamily: 'System', fontSize: 12, color: '#4A4A4A'}}>Places Dispos.</Text>
                    <Text style={{
                        fontFamily: 'System',
                        fontSize: 48,
                        fontWeight: '100',
                        color: stationPinColor(station, 'STANDS')
                    }}>{station.available_bike_stands}</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'column', paddingLeft: 5}}>
                    <Text numberOfLines={1} ellipsizeMode="tail"
                          style={{fontFamily: 'System', fontSize: 12, color: '#4A4A4A'}}>Distance</Text>

                    <Text numberOfLines={1}
                          style={{fontFamily: 'System', fontSize: 48, fontWeight: '100', color: '#000'}}>
                        {distanceInUnit}
                        <Text
                            style={{fontSize: 20}}>{distanceUnit}</Text>
                    </Text>
                </View>
                <View style={{paddingRight: 10, width: 48, flexDirection: 'column', alignItems: "flex-end"}}>
                    { station.banking && (<Icon name='ios-card' size={24} color='#7ED321' style={{}} />) }
                    { station.bonus && (<Icon name='ios-thumbs-up-outline' size={24} color='#50E3C2' style={{}} />) }
                </View>
            </View>
        );
    }

}

export default StationInfos;
