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

import NetworkImage from '../NetworkImage';

class StationHeader extends Component {

    static propTypes = {
        station: PropTypes.object,
        distance: PropTypes.number
    };

    render() {
        const station = this.props.station;

        const backgroundSourceUri = `http://image-commute-sh.s3-website-eu-west-1.amazonaws.com/contracts/${station.contract_name}/${station.contract_name}-${station.number}-1-${128}-${100}.jpg`;

        const mapThumbSourceUri = `http://image-commute-sh.s3-website-eu-west-1.amazonaws.com/contracts/${station.contract_name}/thumbs/map/${station.contract_name}-${station.number}-1-${420}-${60}.jpg`;

        const placeholderImage = require('../../images/station-placeholder.jpg');

        return (
            <View style={{ flexDirection: 'row', height: 72 }}>
                <NetworkImage
                    source={ (station.images || []).length > 0 ? { uri: backgroundSourceUri } : { uri: mapThumbSourceUri } }
                    errorSource={placeholderImage}
                    placeholderSource={placeholderImage}
                    resizeMode='cover'
                    style={{ marginLeft: 12, marginTop: 12, marginRight: 12, width: 48, height: 48, borderRadius: 24 }} />

                <View style={{ flexDirection: 'column', flex: 1, padding: 10, paddingLeft: 0, paddingRight: 8 }}>
                    <Text style={{ fontFamily: 'System', fontSize: 14, fontWeight: '500', color: '#49b2d8' }}>{station.number} - {station.name}</Text>
                    <Text  style={{ fontFamily: 'System', fontSize: 11, fontWeight: '400', color: '#9d9d9d' }}>{station.address}</Text>
                </View>
            </View>
        );
    }

}

export default StationHeader;
