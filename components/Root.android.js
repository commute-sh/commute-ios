import React, { Component, PropTypes } from 'react';

import {
    Text
} from 'react-native';

import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';

import SearchTabScene from './SearchTabScene';
import FavoriteStationsTabScene from './FavoriteStationsTabScene';
import MapTabScene from './MapTabScene';

class Root extends Component {

    render() {
        return (
            <ScrollableTabView
                style={{ marginTop: 0 }}
                initialPage={0}
                tabBarBackgroundColor="white"
                tabBarActiveTextColor="#325d7a"
                tabBarInactiveTextColor="#325d7a"
                under
                renderTabBar={() => <DefaultTabBar underlineStyle={{ backgroundColor: '#325d7a' }} tabStyle={{ height: 56 }} />}
            >
                <MapTabScene tabLabel='Plan' />
                <FavoriteStationsTabScene tabLabel='Favoris' />
                <SearchTabScene tabLabel='Recherche' />
            </ScrollableTabView>
        );
    }

}

export default Root;