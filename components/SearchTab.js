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
    ListView,

} from 'react-native';

import SearchBar from 'react-native-search-bar';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        marginTop: 20,
        height: 44
    },
    listView: {
        backgroundColor: 'white',
    },
});

import Icon from 'react-native-vector-icons/Ionicons';

import EventEmitter from 'EventEmitter';

import SearchTabScene from './SearchTabScene';

export default class FavoriteTab extends Component {

    static propTypes = {
        selectedTab: PropTypes.string,
        onPress: PropTypes.func,
        dataSource: PropTypes.object.isRequired
    };
    static defaultProps = { dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}) }
    state = { dataSource: this.props.dataSource.cloneWithRows(['User 1', 'User 2', 'User 3', 'User 4', 'User 5']) }

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
                title="Recherche"
                iconName="ios-search-outline"
                selectedIconName="ios-search"
                selected={this.props.selectedTab === 'search'}
                onPress={this.props.onPress}
            >

                <View style={styles.container}>
                    <View style={{ backgroundColor: "#325d7a", height: 64 }}>
                    <SearchBar placeholder="Search"
                               style={styles.searchBar}
                               barTintColor="#325d7a"
                               textColor="black"
                               tintColor="white" />
                    </View>
                    <ListView style={styles.listView} dataSource={this.state.dataSource}
                              automaticallyAdjustContentInsets={false}
                              renderRow={(rowData) => <Text>{rowData}</Text>} />
                </View>

            </Icon.TabBarItemIOS>

        );
    }

}

export default FavoriteTab
