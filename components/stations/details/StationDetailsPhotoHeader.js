import React, { Component, PropTypes } from 'react';

import NetworkImage from '../../NetworkImage';

const screen = require('Dimensions').get('window');

class StationDetailsHeader extends Component {

    static propTypes = {
        station: PropTypes.object
    };

    render() {
        const station = this.props.station || { name: ' ', address: ' ' };

        const backgroundSourceUri = `https://cdn.commute.sh/contracts/${station.contract_name}/${station.contract_name}-${station.number}-1-${640}-${60}.jpg`;
        const contractBackgroundSourceUri = `https://cdn.commute.sh/contracts/${station.contract_name}/${station.contract_name}-1-${640}-${60}.jpg`;

        console.log("Photo URL:", backgroundSourceUri);

        return (
            <NetworkImage
                source={ (station.images || []).length > 0 ? { uri: backgroundSourceUri } : undefined }
                errorSource={{ uri: contractBackgroundSourceUri }}
                placeholderSource={{ uri: contractBackgroundSourceUri }}
                style={{
                    width: screen.width,
                    height: screen.width * 240 / 320,
                }}
            />
        );
    }

}

export default StationDetailsHeader;
