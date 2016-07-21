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

import MapTabView from './MapTabView';

import Icon from 'react-native-vector-icons/Ionicons';

import EventEmitter from 'EventEmitter';

export default class MapTab extends Component {

    static propTypes = {
        selectedTab: PropTypes.string,
        onPress: PropTypes.func
    };

    constructor(props) {
        super(props);

        this.onRightButtonPress = this.onRightButtonPress.bind(this);
    }

    onRightButtonPress() {
        this.eventEmitter.emit('Refresh');
    }

    componentWillMount() {
        this.eventEmitter = new EventEmitter();
    }

    render() {
        return (
            <Icon.TabBarItemIOS
                title="Plan"
                iconName="ios-map-outline"
                selectedIconName="ios-map"
                selected={this.props.selectedTab === 'map'}
                onPress={this.props.onPress}
            >
                <Navigator
                    initialRoute={{id: 'map', title: 'Plan' }}
                    renderScene={(route, navigator) => <MapTabView eventEmitter={this.eventEmitter} />}
                    style={{ flex:1 }}
                    navigationBar={
                        <Navigator.NavigationBar
                            routeMapper={{
                                LeftButton: (route, navigator, index, navState) => {
                                    if(index > 0) {
                                        return (
                                            <View style={{ paddingTop: 5, paddingRight: 10 }}>
                                                <TouchableHighlight underlayColor="transparent" onPress={() => { if (index > 0) { navigator.pop() } }}>
                                                    <Text>Back</Text>
                                                </TouchableHighlight>
                                            </View>)
                                    }
                                    else { return null }
                                },
                                RightButton: (route, navigator, index, navState) =>
                                    <View style={{ paddingTop: 5, paddingRight: 10 }}>
                                        <TouchableHighlight underlayColor="transparent" onPress={this.onRightButtonPress}>
                                            <Icon name="ios-refresh-outline" size={30} color="white" />
                                        </TouchableHighlight>
                                    </View>
                                ,
                                Title: (route, navigator, index, navState) =>
                                    <View style={{ paddingTop: 2 }}>
                                        <Image source={require('../images/commute-icon.png')} style={{ width: 32, height: 32 }}/>
                                    </View>
                                ,
                            }}
                            style={{ backgroundColor: '#325d7a' }}
                        />
                    }
                />
            </Icon.TabBarItemIOS>
        );
    }

}
