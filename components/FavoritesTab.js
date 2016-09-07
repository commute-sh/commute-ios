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

import Icon from 'react-native-vector-icons/Ionicons';

export default class FavoriteTab extends Component {

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
                title="Favoris"
                iconName="ios-star-outline"
                selectedIconName="ios-star"
                selected={this.props.selectedTab === 'favorites'}
                onPress={this.props.onPress}
            >

                <Navigator
                    initialRoute={{id: 'favorites', title: 'Favoris' }}
                    renderScene={(route, navigator) => null}
                    style={{ flex: 1 }}
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

            </Icon.TabBarItemIOS>
        );
    }

}

export default FavoriteTab
