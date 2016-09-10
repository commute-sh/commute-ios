import React, { Component, PropTypes } from 'react';

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

import MapTabScene from './MapTabScene';
import StationDetailsScene from './StationDetailsScene';

import Icon from 'react-native-vector-icons/Ionicons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';


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
        // Do Something
    }

    render() {

        return (
            <Icon.TabBarItemIOS
                title="Plan"
                iconName="ios-globe-outline"
                selectedIconName="ios-globe"
                selected={this.props.selectedTab === 'map'}
                onPress={this.props.onPress}
            >
                <Navigator
                    initialRoute={{id: 'Map', title: 'Plan' }}
                    renderScene={(route, navigator) => {
                        if (route.id == 'StationDetails') {
                            return (
                                <StationDetailsScene
                                    station={route.station}
                                    navigator={navigator}
                                />
                            );
                        } else if (route.id === 'Map') {
                            return (
                                <MapTabScene
                                    navigator={navigator}
                                />
                            );
                        }

                    }}
                    style={{ flex: 1 }}
                    navigationBar={
                        <Navigator.NavigationBar
                            routeMapper={{
                                LeftButton: (route, navigator, index, navState) => {
                                    if(index > 0) {
                                        return (
                                            <View style={{ marginLeft: -4 }}>
                                                <TouchableHighlight underlayColor="transparent" onPress={() => { if (index > 0) { navigator.pop() } }}>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                        <EvilIcon name="chevron-left" size={48} color="white" style={{ width: 36, paddingTop: 2 }} />
                                                        <Text style={{ color: 'white' }}>Back</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </View>)
                                    }
                                    else {
                                        return (null);
                                    }
                                },
                                RightButton: (route, navigator, index, navState) =>
{ return null /*                                    <View style={{ paddingTop: 0, paddingRight: 16 }}>
                                        <TouchableHighlight underlayColor="transparent" onPress={this.onRightButtonPress}>
                                            <Icon name="ios-refresh-outline" size={40} color="white" />
                                        </TouchableHighlight>
                                    </View>*/}
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
