import React, { Component, PropTypes } from 'react';

import {
    Animated,
    AppRegistry,
    StyleSheet,
    Navigator,
    ScrollView,
    MapView,
    TouchableHighlight,
    TouchableOpacity,
    Text,
    View,
    Image,
    ListView
} from 'react-native';

import EvilIcon from 'react-native-vector-icons/EvilIcons';

import SearchTabScene from './SearchTabScene';
import StationDetailsScene from './StationDetailsScene';

class SearchTab extends Component {

    render() {
        return (
            <Navigator
                initialRoute={{ id: 'StationSearch', title: 'Recherche de stations' }}
                renderScene={(route, navigator) => {
                    if (route.id == 'StationDetails') {
                        return (
                            <StationDetailsScene
                                station={route.station}
                                navigator={navigator}
                            />
                        );
                    } else if (route.id == 'StationSearch') {
                        return (
                            <SearchTabScene navigator={navigator} />
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
                                else { return null }
                            },
                            RightButton: (route, navigator, index, navState) => {
                                return null;
                            },
                            Title: (route, navigator, index, navState) => {
                                return (
                                    <View style={{ paddingTop: 2 }}>
                                        <Image source={require('../images/commute-icon.png')} style={{ width: 32, height: 32 }} />
                                    </View>
                                );
                            },
                        }}
                        style={{ backgroundColor: '#325d7a' }}
                    />
                }
            />
        );
    }

}

export default SearchTab;
