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
                toastColor: 'green',
                message: 'Success!'
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
        this.callToast(event.message, event.type);
    }

    onTabIconPress(selectedTab) {
        this.setState({ selectedTab: selectedTab });
    }

    callToast(message, type) {
        console.log('Calling toast with message:"', message, '" and type:', type);

        if(this.state.toast.modalShown) {
            return ;
        }

        this.setToastType(message, type);

        this.setState({ modalShown: true });

        Animated.timing(this.animatedValue, { toValue: 1, duration: 350 }).start(() => {
            setTimeout(() => {
                this.setState({ modalShown: false });
                Animated.timing( this.animatedValue, { toValue: 0, duration: 350 }).start();
            }, 2000);
        });
    }

    setToastType(message='Success!', type='success') {
        let color;

        if (type == 'error') {
            color = '#e74c3c';
        } else if (type == 'primary') {
            color = '#2980b9';
        } else if (type == 'warning') {
            color = '#f39c12';
        } else if (type == 'success') {
            color = '#1abc9c';
        }

        this.setState({ toast: { toastColor: color, message: message } });
    }

    render() {

        let animation = this.animatedValue.interpolate({
            inputRange: [0, .3, 1],
            outputRange: [70, 10, 0]
        });

        return (
            <View style={{ flex: 1 }}>
                <TabBarIOS style={{ zIndex: 1 }}>
                    <MapTab globalEventEmitter={this.eventEmitter} selectedTab={this.state.selectedTab} onPress={this.onTabIconPress.bind(this, 'map')} />
                    <FavoriteTab selectedTab={this.state.selectedTab} onPress={this.onTabIconPress.bind(this, 'favorites')} />
                    <SearchTab selectedTab={this.state.selectedTab} onPress={this.onTabIconPress.bind(this, 'search')} />
                </TabBarIOS>

                <Animated.View  style={{ zIndex: 2, transform: [{ translateY: animation }], height: 70, backgroundColor: this.state.toast.toastColor, position: 'absolute',left:0, top: windowHeight - 70, right:0, justifyContent:  'center' }}>
                    <Text style={{ marginLeft: 10,  color: 'white',  fontSize: 16, fontWeight: '500', fontFamily: 'System'  }}>
                        Impossible de charger la liste des stations
                    </Text>
                    <Text style={{ marginLeft: 10,  color: 'white',  fontSize: 12, fontWeight: '300', fontFamily: 'System' }}>
                        Erreur: { this.state.toast.message }
                    </Text>
                </Animated.View>
            </View>

        );
    }

}

reactMixin(App.prototype, Subscribable.Mixin);

AppRegistry.registerComponent('commute', () => App);
