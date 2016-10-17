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
                style={{ marginTop: 20 }}
                initialPage={0}
                renderTabBar={() => <DefaultTabBar />}
            >
                <MapTabScene tabLabel='Plan' />
                <FavoriteStationsTabScene tabLabel='Favoris' />
                <SearchTabScene tabLabel='Recherche' />
            </ScrollableTabView>
        );
    }

}

export default Root;