import React, { Component, PropTypes } from 'react';

import NetworkImage from '../../NetworkImage';

const screen = require('Dimensions').get('window');

class StationDetailsHeader extends Component {

    static propTypes = {
        station: PropTypes.object
    };

    render() {
        const station = this.props.station || { name: ' ', address: ' ' };

        const backgroundSourceUri = `https://cdn.commute.sh/contracts/${station.contract_name}/photos/${station.contract_name}-${station.number}-1-${640}-${60}.jpg`;
        const mapThumbSourceUri = `https://cdn.commute.sh/contracts/${station.contract_name}/thumbs/map/${station.contract_name}-${station.number}-1-${128}-${60}.jpg`;

        const placeholderImage = require('../../../images/station-placeholder.jpg');

        console.log("Photo URL:", backgroundSourceUri);

        return (
            <NetworkImage
                source={ (station.images || []).length > 0 ? { uri: backgroundSourceUri } : { uri: mapThumbSourceUri } }
                errorSource={placeholderImage}
                placeholderSource={placeholderImage}
                style={{
                    width: screen.width,
                    height: screen.width * 240 / 320,
                }}
            />
        );
    }

}

export default StationDetailsHeader;
