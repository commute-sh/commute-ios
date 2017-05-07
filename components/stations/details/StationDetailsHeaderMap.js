import React, { Component, PropTypes } from 'react';

import {
    View,
    Text,
    ScrollView
} from 'react-native';

import StationDetailsMapHeader from './StationDetailsMapHeader';

class StationDetailsHeaderMap extends Component {

    static propTypes = {
        station: PropTypes.object,
        style: PropTypes.object,
        paddingLeft:  PropTypes.number,
        paddingRight: PropTypes.number,
        paddingTop:  PropTypes.number,
        paddingBottom: PropTypes.number,
        height: PropTypes.number,
        zoomEnabled: PropTypes.bool,
        dataToShow: PropTypes.string,
        onMarkerPress: PropTypes.func
    };

    render() {
        console.log('--- [StationDetailsHeaderMap] Render -------------------------------------------------------------------------------------');

        const station = this.props.station;

        return (
            <View style={this.props.style}>
                <StationDetailsMapHeader
                    station={station}
                    paddingLeft={this.props.paddingLeft}
                    paddingRight={this.props.paddingRight}
                    paddingTop={this.props.paddingTop}
                    paddingBottom={this.props.paddingBottom}
                    height={this.props.height}
                    zoomEnabled={this.props.zoomEnabled}
                    dataToShow={this.props.dataToShow}
                    onMarkerPress={this.props.onMarkerPress}
                />
            </View>
        );

    }

}

export default StationDetailsHeaderMap;
