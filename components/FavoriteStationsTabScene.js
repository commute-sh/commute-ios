import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as contractStationActionCreators from '../actions/contractStations'

import {
    Animated,
    Image,
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    RefreshControl,
    Platform
} from 'react-native';

import Swipeout from 'react-native-animated-swipeout';

import { stationPinColor } from '../utils/Stations';

//var LISTVIEW = 'FavoriteListView';

// import DropRefreshControl from 'react-native-drop-refresh';

import Icon from 'react-native-vector-icons/Ionicons';

import NetworkImage from './NetworkImage';


class FavoriteStationsTabScene extends Component {

    static propTypes = {
        navigator: PropTypes.object
    };

    static defaultProps = {
        dataSource: new ListView.DataSource({ rowHasChanged: (s1, s2) => s1 !== s2 })
    };

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            dataSource: this.props.dataSource.cloneWithRows([]),
            highlightedRow: {
                sectionID: undefined,
                rowID: undefined
            }
        };

        this.pressRowIn = this.pressRowIn.bind(this);
        this.pressRowOut = this.pressRowOut.bind(this);
        this.pressRow = this.pressRow.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
    }

    componentWillMount() {
        const stations = this.props.contractStations[this.props.contractName];
        const favoriteStations = this.props.favoriteStations;

        this.setState({
            dataSource:
                this.props.dataSource.cloneWithRows(stations.data.filter(station => {
                    return favoriteStations.data.map(fs => fs.number).indexOf(station.number) >= 0;
                }))
        });
    }

    componentDidMount() {
        const self = this;

        if (Platform.OS === 'ios') {
        //     DropRefreshControl.configure({
        //         node: this.refs[LISTVIEW]
        //     }, () => {
        //         self.onRefresh();
        //     });
        }
    }

    componentWillReceiveProps(nextProps) {

        if (
            Platform.OS === 'ios' &&
            this.props.contractStations[this.props.contractName].isFetching &&
            !nextProps.contractStations[nextProps.contractName].isFetching
        ) {
//            DropRefreshControl.endRefreshing(this.refs[LISTVIEW]);
        }

        const stations = nextProps.contractStations[this.props.contractName];
        const favoriteStations = nextProps.favoriteStations;

        this.setState({
            dataSource:
                nextProps.dataSource.cloneWithRows(stations.data.filter(station => {
                    return favoriteStations.data.map(fs => fs.number).indexOf(station.number) >= 0;
                }))
        });
    }

    render() {
        console.log('--- [SearchTabScene] Render -------------------------------------------------------------------------------------');

        return (
            <View style={{ flex: 1 }}>
                <ListView style={{ marginTop: Platform.OS === 'ios' ? 64 : 0, backgroundColor: 'white' }}
                          dataSource={this.state.dataSource}
                          automaticallyAdjustContentInsets={false}
                          enableEmptySections={true}
                          renderRow={this.renderRow}
                          keyboardDismissMode="on-drag"
                          renderSeparator={this.renderSeparator}
                          refreshControl={
                              <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                                title="Loading stations ..."
                              />
                          }
                />
                {/*ref={LISTVIEW}*/}
                { this.state.dataSource.getRowCount() <= 0 &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 10, backgroundColor: 'white' }}>
                        <Text>Vous n'avez pas encore ajouté de favoris ...</Text>
                    </View>
                }
            </View>
        );
    }

    renderRow(station, sectionID, rowID, highlightRow) {
        const backgroundSourceUri = `http://image-commute-sh.s3-website-eu-west-1.amazonaws.com/contracts/${station.contract_name}/${station.contract_name}-${station.number}-1-${128}-${100}.jpg`;

        const rowPress = sectionID === this.state.highlightedRow.sectionID && rowID === this.state.highlightedRow.rowID;

//        console.log("--- Row[sectionID: ", sectionID, "/", this.state.highlightedRow.sectionID , ", rowID:", rowID, "/", this.state.highlightedRow.rowID , "] is Pressed:", rowPress);

        const favoriteStations = this.props.favoriteStations.data;

        let swipeBtns = [
            {
                component:
                    <View style={{ flex: 1, backgroundColor: 'transparent', zIndex: 100, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={ favoriteStations.map(fs => fs.number).indexOf(station.number) >= 0 ? 'ios-star' : 'ios-star-outline' } color="#fff" size={44} />
                    </View>,
                backgroundColor: 'red',
                underlayColor: 'rgba(0, 0, 0, 0.6)',
                onPress: () => { this.onFavoriteStarPress(station) }
            }
        ];

        const placeholderImage = require('../images/map_placeholder.jpg');

        return (
            <Swipeout right={swipeBtns}
                      autoClose={true}
                      backgroundColor= 'transparent'>
                <TouchableHighlight underlayColor='#EBECF0' onPressIn={() => {
                    this.pressRowIn(sectionID, rowID);
                    highlightRow(sectionID, rowID);
                }} onPressOut={() => {
                    this.pressRowOut(sectionID, rowID);
                }} onPress={() => {
                    this.pressRow(sectionID, rowID);
                    highlightRow(null);
                }}>
                    <View style={{ flexDirection: 'row', height: 96 }}>
                        <NetworkImage
                            source={ (station.images || []).length > 0 ? { uri: backgroundSourceUri } : undefined }
                            errorSource={placeholderImage}
                            placeholderSource={placeholderImage}
                            resizeMode='cover'
                            style={{ width: 96, height: 96 }} />

                        <View style={{ flexDirection: 'column', flex: 1, padding: 20, paddingRight: 10 }}>
                            <Text style={{ fontFamily: 'System', fontSize: 14, fontWeight: '500', color: rowPress ? '#49b2d8' : '#49b2d8' }}>{station.number} - {station.name}</Text>
                            <Text  style={{ fontFamily: 'System', fontSize: 12, fontWeight: '500', color: rowPress ? '#9d9d9d' : '#9d9d9d' }}>{station.address}</Text>
                        </View>

                        <View style={{ width: 80, padding: 20, paddingTop: 20, paddingBottom: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                            <Text style={{ fontFamily: 'System', fontSize: 18, fontWeight: '500', color: stationPinColor(station, 'BIKES') }}>{station.available_bikes}</Text>
                            { station.distance && <Text style={{ fontFamily: 'System', fontSize: 12, fontWeight: '500', color: rowPress ? '#c2c2c2' : '#c2c2c2' }}>{(station.distance / 1000).toFixed(1)} km</Text>}
                        </View>
                    </View>
                </TouchableHighlight>
            </Swipeout>
        );
    }

    _loadEventFired(event) {
        this.setState((state) => {
            return state.events = [...state.events, event];
        });
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        return (
            <View
                key={`${sectionID}-${rowID}`}
                style={{
                    height: adjacentRowHighlighted ? 1 : 1,
                    backgroundColor: adjacentRowHighlighted ? '#E9E8ED' : '#E9E8ED',
                }}
            />
        );
    }

    onRefresh() {
      this.props.actions.fetchContractStations(this.props.contractName)
    }

    pressRowIn(sectionID, rowID) {
        console.log("--- On Row pressed In [sectionID: ", sectionID, ", rowID:", rowID, "]");
        this.setState({ highlightedRow: { sectionID: sectionID, rowID: rowID } });
    }

    pressRowOut(sectionID, rowID) {
        console.log("--- On Row pressed Out [sectionID: ", sectionID, ", rowID:", rowID, "]");
        this.setState({ highlightedRow: { sectionID: undefined, rowID: undefined } });
    }

    pressRow(sectionID, rowID) {
        console.log("--- On Row pressed [sectionID: ", sectionID, ", rowID:", rowID, "]");
        this.props.navigator.push({ id: 'StationDetails', station: this.state.dataSource.getRowData(0, rowID) });
    }

}

const mapStateToProps = (state) => Object.assign({}, {
    contractStations: state.contractStations,
    favoriteStations: state.favoriteStations,
    contractName: state.contract.name
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        Object.assign({}, contractStationActionCreators),
        dispatch
    )
});

export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(FavoriteStationsTabScene);
