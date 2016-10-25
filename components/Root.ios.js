import React, { Component, PropTypes } from 'react';

import {
    TabBarIOS,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import MapTab from './MapTab';
import FavoriteTab from './FavoritesTab';
import SearchTab from './SearchTab';

class Root extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedTab: 'map'
        };
    }

    onTabIconPress(selectedTab) {
        this.setState({ selectedTab: selectedTab });
    }

    render() {
        return (
            <TabBarIOS style={{ zIndex: 1 }}>
                <Icon.TabBarItemIOS
                    title="Plan"
                    iconName="ios-globe-outline"
                    selectedIconName="ios-globe"
                    selected={this.props.selectedTab === 'map'}
                    onPress={this.onTabIconPress.bind(this, 'map')}
                >
                    <MapTab selectedTab={this.state.selectedTab} />
                </Icon.TabBarItemIOS>

                <Icon.TabBarItemIOS
                    title="Favoris"
                    iconName="ios-star-outline"
                    selectedIconName="ios-star"
                    selected={this.props.selectedTab === 'favorites'}
                    onPress={this.onTabIconPress.bind(this, 'favorites')}
                >
                    <FavoriteTab selectedTab={this.state.selectedTab} />
                </Icon.TabBarItemIOS>
                <Icon.TabBarItemIOS
                    title="Recherche"
                    iconName="ios-search-outline"
                    selectedIconName="ios-search"
                    selected={this.props.selectedTab === 'search'}
                    onPress={this.onTabIconPress.bind(this, 'search')}
                >
                    <SearchTab selectedTab={this.state.selectedTab} />
                </Icon.TabBarItemIOS>
            </TabBarIOS>
        );
    }

}

export default Root;