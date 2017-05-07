import React, {Component, PropTypes} from 'react';

import {
    Animated,
    AppRegistry,
    View,
} from 'react-native';

import MapView from 'react-native-maps';
import rnfs from 'react-native-fs';
import axios from 'axios';

class Commute extends Component {


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Instances variables
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    state = {};


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Lifecycle
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    componentWillMount() {

        const self = this;
        setTimeout(async () => {
            let url = `https://api.commute.sh/stations?contract-name=Paris`;

            const response = await axios.get(url, {
                timeout: 30000,
                headers: { 'Accept': 'application/json' }
            });

            let data = response.data;

            if (data === "The request timed out.") {
                throw new Error(data);
            }

            console.log('stations:', data.length);

            self.setState({ shouldTakeSnapshot: true, index: 0, stations: data });

        }, 0);
    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /// Render
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    render() {

        const self = this;
        if (self.state.stations && self.state.stations.length > 0 && self.state.shouldTakeSnapshot) {

            setTimeout(() => {
                const station = self.state.stations[self.state.index];
                self.takeSnapshot.bind(self, station)()
            }, 5000);

            self.state.shouldTakeSnapshot = false;
        }

        const station = self.state.stations && self.state.stations.length > 0 ? this.state.stations[this.state.index] : { position: { lat: 0, lng: 0 } };

        console.log(`Station[${this.state.index}] stations:`, { latitude: station.position.lat, longitude: station.position.lng });

        return (
            <View style={{ marginTop: 96, width: 192, height: 192 }}>
                <MapView ref="map" style={{ width: 192, height: 192 }}
                         initialRegion={{ latitude: 0, longitude: 0, latitudeDelta: 0.00410, longitudeDelta: 0.00386 }}
                         region={{ latitude: station.position.lat, longitude: station.position.lng, latitudeDelta: 0.00410, longitudeDelta: 0.00386 }}
                >
{/*                    <MapView.Marker
                        coordinate={{ latitude: station.position.lat, longitude: station.position.lng }}>
                        <StationMarkerView
                            pinSize={24}
                            value="C"
                            bgColor="#49b2d8"
                            strokeColor="#49b2d8"
                        />
                    </MapView.Marker>*/}
                </MapView>
            </View>
        );
    }

    takeSnapshot (station) {

        const self = this;

        // 'takeSnapshot' takes a config object with the following options
        this.refs.map.takeSnapshot({
            format: 'jpg',   // image formats: 'png', 'jpg' (default: 'png')
            quality: 0.6,    // image quality: 0..1 (only relevant for jpg, default: 1)
            result: 'file'   // result types: 'file', 'base64' (default: 'file')
        }).then(async (uri) => {
            this.setState({ mapSnapshot: uri });

            const src = uri;
            const dest = uri.replace(/snapshot-.*\.jpg/g, `Paris-${station.number}-1-128-60.jpg`);

            console.log('src:', src);
            console.log('dest:', dest);

            const exists = await rnfs.exists(dest);

            if (exists) {
                await rnfs.unlink(dest);
            }

            await rnfs.moveFile(src, dest);

            self.setState({ shouldTakeSnapshot: true, index: this.state.index + 1 });
        });
    }

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// Exports
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default Commute;

AppRegistry.registerComponent('commute', () => Commute);
