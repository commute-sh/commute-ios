import React, { Component, PropTypes } from 'react';

import {
    Animated,
    Image,
    ListView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import SearchBar from 'react-native-search-bar';

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBar: {
        marginTop: 64,
        height: 44,
        backgroundColor: 'green',
    },
    listView: {
        backgroundColor: 'white',
    },
});

class SearchTabScene extends Component {

    static propTypes = { dataSource: PropTypes.object.isRequired }
    static defaultProps = { dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}) }
    state = { dataSource: this.props.dataSource.cloneWithRows(['User 1', 'User 2', 'User 3', 'User 4', 'User 5']) }

    render() {
        console.log('--- [SearchTabScene] Render -------------------------------------------------------------------------------------');

        return (
            <View style={styles.container}>
                <SearchBar placeholder="Search"
                           style={styles.searchBar}
                           barTintColor="#325d7a"
                           tintColor="white" />
                <ListView style={styles.listView} dataSource={this.state.dataSource}
                          automaticallyAdjustContentInsets={false}
                          renderRow={(rowData) => <Text>{rowData}</Text>} />
            </View>
        )
    }
}

export default SearchTabScene;
