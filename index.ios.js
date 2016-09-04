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
    Image,
    Dimensions
} from 'react-native';

import MapTab from './components/MapTab';
import FavoriteTab from './components/FavoritesTab';
import SearchTab from './components/SearchTab';

import EventEmitter from 'EventEmitter';

import Subscribable from 'Subscribable';

import reactMixin from 'react-mixin';

let windowHeight = Dimensions.get('window').height;

class App extends Component {

    constructor(props) {
        super(props);

        this.animatedValue = new Animated.Value(0);

        this.state = {
            selectedTab: 'map',
            toast: {
                modalShown: false,
                toastColor: 'GREEN',
                title: 'Succès',
                message: 'Succès!'
            }
        };

        this.callToast = this.callToast.bind(this);
        this.onToastShow = this.onToastShow.bind(this);
    }

    componentWillMount() {
        this.eventEmitter = new EventEmitter();
        this.addListenerOn(this.eventEmitter, 'ToastShow', this.onToastShow);
    }

    onToastShow(event) {
        this.callToast(event.title, event.message, event.type);
    }

    onTabIconPress(selectedTab) {
        this.setState({ selectedTab: selectedTab });
    }

    callToast(title, message, type) {
        console.log('Calling toast with message:"', message, '", title: "', title, '" and type:', type);

        if(this.state.toast.modalShown) {
            return ;
        }

        this.setState({
            modalShown: true,
            toast: {
                title: title,
                backgroundColor: this.getToastBackgroundColor(type),
                type: type,
                message: message
            }
        });

        Animated.timing(this.animatedValue, { toValue: 1, duration: 350 }).start(() => {
            setTimeout(() => {
                this.setState({ modalShown: false });
                Animated.timing( this.animatedValue, { toValue: 0, duration: 350 }).start();
            }, 2000);
        });
    }

    getToastBackgroundColor(type) {
        // INFO
        let color = '#2980b9';

        if (type == 'ERROR') {
            color = '#e74c3c';
        } else if (type == 'WARNING') {
            color = '#f39c12';
        }

        return color;
    }

    render() {

        let animation = this.animatedValue.interpolate({
            inputRange: [0, .3, 1],
            outputRange: [70, 10, 0]
        });

        let messagePrefix = 'Info';

        if (this.state.toast.type == 'ERROR') {
            messagePrefix = 'Erreur';
        }

        return (
            <View style={{ flex: 1 }}>
                <TabBarIOS style={{ zIndex: 1 }}>
                    <MapTab globalEventEmitter={this.eventEmitter} selectedTab={this.state.selectedTab} onPress={this.onTabIconPress.bind(this, 'map')} />
                    <FavoriteTab selectedTab={this.state.selectedTab} onPress={this.onTabIconPress.bind(this, 'favorites')} />
                    <SearchTab selectedTab={this.state.selectedTab} onPress={this.onTabIconPress.bind(this, 'search')} />
                </TabBarIOS>

                <Animated.View  style={{ zIndex: 2, transform: [{ translateY: animation }], height: 70, backgroundColor: this.state.toast.backgroundColor, position: 'absolute',left:0, top: windowHeight - 70, right:0, justifyContent:  'center' }}>
                    <Text style={{ marginLeft: 10,  color: 'white',  fontSize: 16, fontWeight: '500', fontFamily: 'System'  }}>
                        { this.state.toast.title }
                    </Text>
                    <Text style={{ marginLeft: 10,  color: 'white',  fontSize: 12, fontWeight: '300', fontFamily: 'System' }}>
                        { messagePrefix }: { this.state.toast.message }
                    </Text>
                </Animated.View>
            </View>

        );
    }

}

reactMixin(App.prototype, Subscribable.Mixin);

AppRegistry.registerComponent('commute', () => App);
