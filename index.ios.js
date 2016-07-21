/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, PropTypes } from 'react';

import {
    Animated,
    AppRegistry,
    StyleSheet,
    NavigatorIOS,
    Navigator,
    TabBarIOS,
    ScrollView,
    MapView,
    TouchableHighlight,
    TouchableOpacity,
    Text,
    View,
    Image
} from 'react-native';

import StationsTab from './components/StationsTab';
import MapTab from './components/MapTab';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'map',
        }
    }

    onTabIconPress(selectedTab) {
        this.setState({ selectedTab: selectedTab });
    }

    render() {
        return (
            <TabBarIOS>
                <StationsTab selectedTab={this.state.selectedTab} onPress={this.onTabIconPress.bind(this, 'stations')} />
                <MapTab selectedTab={this.state.selectedTab} onPress={this.onTabIconPress.bind(this, 'map')} />
            </TabBarIOS>
        );
    }

}

AppRegistry.registerComponent('commute', () => App);
