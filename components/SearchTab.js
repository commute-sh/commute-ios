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
    Image,
    ListView,

} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import SearchTabScene from './SearchTabScene';

export default class SearchTab extends Component {

    static propTypes = {
        selectedTab: PropTypes.string,
        onPress: PropTypes.func
    };

    render() {
        return (
            <Icon.TabBarItemIOS
                title="Recherche"
                iconName="ios-search-outline"
                selectedIconName="ios-search"
                selected={this.props.selectedTab === 'search'}
                onPress={this.props.onPress}
            >
                <Navigator
                    initialRoute={{ id: 'StationSearch', title: 'Recherche de stations' }}
                    renderScene={(route, navigator) => {
                        if (route.id == 'StationSearch') {
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
                                    return null;
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
            </Icon.TabBarItemIOS>
        );
    }

}

export default SearchTab;
