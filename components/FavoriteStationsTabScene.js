import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as stationActionCreators from '../actions/stations'

import {
    Animated,
    Image,
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    RefreshControl
} from 'react-native';


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
        const stations = this.props.stations;
        const favoriteStations = this.props.favoriteStations;

        this.setState({
            dataSource:
                this.props.dataSource.cloneWithRows(stations.data.filter(station => {
                    return favoriteStations.data.map(fs => fs.number).indexOf(station.number) >= 0;
                }))
        });

    }

    componentWillReceiveProps(nextProps) {
        const stations = nextProps.stations;
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
                <ListView style={{ marginTop: 64, backgroundColor: 'white' }}
                          dataSource={this.state.dataSource}
                          automaticallyAdjustContentInsets={false}
                          enableEmptySections={true}
                          renderRow={this.renderRow}
                          keyboardDismissMode="on-drag"
                          refreshControl={
                              <RefreshControl refreshing={this.props.stations.isFetching} onRefresh={this.onRefresh} />
                          }
                />
            </View>
        )
    }

    renderRow(station, sectionID, rowID, highlightRow) {
        const backgroundSourceUri = `https://s3-eu-west-1.amazonaws.com/image-commute-sh/${station.contract_name}-${station.number}-1-${640}-${60}.jpg`;

        const rowPress = sectionID === this.state.highlightedRow.sectionID && rowID === this.state.highlightedRow.rowID;

        console.log("--- Row[sectionID: ", sectionID, "/", this.state.highlightedRow.sectionID , ", rowID:", rowID, "/", this.state.highlightedRow.rowID , "] is Pressed:", rowPress);

        return (
            <TouchableHighlight onPressIn={() => {
                this.pressRowIn(sectionID, rowID);
                highlightRow(sectionID, rowID);
            }} onPressOut={() => {
                this.pressRowOut(sectionID, rowID);
            }} onPress={() => {
                this.pressRow(sectionID, rowID);
                highlightRow(null);
            }}>
                <View style={{ flexDirection: 'row', padding: 10 }}>
                    <Image defaultSource={require('../images/map_placeholder.jpg')} source={{ uri: backgroundSourceUri }} style={{ width: 96, height: 64 }} />
                    <View style={{ flexDirection: 'column', flex: 1, paddingLeft: 10 }}>
                        <Text style={{ fontFamily: 'System', fontSize: 14, fontWeight: '500', color: rowPress ? '#fff' : '#000' }}>{station.name}</Text>
                        <Text  style={{ fontFamily: 'System', fontSize: 11, fontWeight: '500', color: rowPress ? '#fff' : '#000' }}>{station.address}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }

    onRefresh() {
        const search = this.props.stations.search;
        if (search) {
            this.props.actions.fetchStations(search.position, search.distance, search.contractName);
        }
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
        this.props.navigator.push({ id: 'StationDetails', station: this.props.stations.data[rowID] });
    }

}

const mapStateToProps = (state) => Object.assign({}, {
    stations: state.stations,
    favoriteStations: state.favoriteStations
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        Object.assign({}, stationActionCreators),
        dispatch
    )
});

export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(FavoriteStationsTabScene);
