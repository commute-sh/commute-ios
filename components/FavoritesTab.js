import React, {Component, PropTypes } from 'react';

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
    Image
} from 'react-native';

import EvilIcon from 'react-native-vector-icons/EvilIcons';

import FavoriteStationsTabScene from './FavoriteStationsTabScene';
import StationDetailsScene from './StationDetailsScene';

class FavoriteTab extends Component {

    constructor(props) {
        super(props);

        this.onRightButtonPress = this.onRightButtonPress.bind(this);
    }

    onRightButtonPress() {
        // Do Something
    }

    render() {
        return (
            <Navigator
                initialRoute={{id: 'FavoriteStations', title: 'Favoris' }}
                renderScene={(route, navigator) => {
                    if (route.id == 'StationDetails') {
                        return (
                            <StationDetailsScene
                                station={route.station}
                                navigator={navigator}
                            />
                        );
                    } else if (route.id == 'FavoriteStations') {
                        return (
                            <FavoriteStationsTabScene navigator={navigator} />
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
                            RightButton: (route, navigator, index, navState) =>
                                null
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
        );
    }

}

export default FavoriteTab;
