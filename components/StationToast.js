import React, {Component, PropTypes } from 'react';

import {
    Text,
    View
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as locationActionCreators from '../actions/location'

import moment from 'moment'

import { stationPinColor } from '../utils/Stations';

class StationToast extends Component {

  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      distance: undefined
    };
  }

  componentDidMount() {
    this.updateDistance(this.props.geoLocation, this.props.station);
  }

  componentWillReceiveProps(nextProps) {
    this.updateDistance(nextProps.geoLocation, nextProps.station);
  }

  updateDistance(geoLocation, station) {
    if (geoLocation && station) {
      this.setState({distance: (geoLocation.distanceTo(station.geoLocation, true) * 1000).toFixed(0)});
    }
  }

  render() {
    console.log('--- [StationToast] Render -------------------------------------------------------------------------------------');

    const station = this.props.station || {name: ' ', address: ' '};

    return (
      <View style={{flex: 1, paddingLeft: 16, paddingTop: 5, paddingBottom: 5}}>
          <View style={{paddingTop: 5, paddingBottom: 5, borderBottomWidth: 1, borderBottomColor: '#E4E4E4'}}>
              <Text style={{
                fontFamily: 'System',
                fontSize: 17,
                fontWeight: '500',
                color: '#4A4A4A'
              }}>{station.number || ' '} - {station.name || ' '}</Text>
              <Text style={{
                fontFamily: 'System',
                fontSize: 12,
                color: '#325d7a',
                paddingTop: 5,
                paddingBottom: 5
              }}>{station.address || ' '}</Text>
          </View>

        { station.status == 'CLOSED' && (
          <View style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontFamily: 'System', fontSize: 12, color: '#e74c3c'}}>Station fermée</Text>
          </View>
        )}

        { station.status != 'CLOSED' && (
          <View style={{paddingTop: 10, flexDirection: 'row'}}>
              <View style={{flex: 0.6, flexDirection: 'column'}}>
                  <Text numberOfLines={1} ellipsizeMode="tail"
                        style={{fontFamily: 'System', fontSize: 12, color: '#4A4A4A'}}>Vélos Dispos.</Text>
                  <Text style={{
                    fontFamily: 'System',
                    fontSize: 48,
                    fontWeight: '100',
                    color: stationPinColor(station, 'BIKES')
                  }}>{station.available_bikes !== undefined ? station.available_bikes : '-'}</Text>
              </View>
              <View style={{flex: 0.6, flexDirection: 'column', paddingLeft: 20}}>
                  <Text numberOfLines={1} ellipsizeMode="tail"
                        style={{fontFamily: 'System', fontSize: 12, color: '#4A4A4A'}}>Places Dispos.</Text>
                  <Text style={{
                    fontFamily: 'System',
                    fontSize: 48,
                    fontWeight: '100',
                    color: stationPinColor(station, 'STANDS')
                  }}>{station.available_bike_stands !== undefined ? station.available_bike_stands : '-'}</Text>
              </View>
              <View style={{flex: 1, flexDirection: 'column', paddingLeft: 20}}>
                  <Text numberOfLines={1} ellipsizeMode="tail"
                        style={{fontFamily: 'System', fontSize: 12, color: '#4A4A4A'}}>Distance</Text>

                  <Text numberOfLines={1}
                        style={{fontFamily: 'System', fontSize: 48, fontWeight: '100', color: '#000'}}>
                    {this.state.distance !== undefined ? (this.state.distance >= 1000 ? (this.state.distance / 1000).toFixed(1) : this.state.distance) : '-'}
                      <Text
                        style={{fontSize: 20}}>{this.state.distance !== undefined ? (this.state.distance >= 1000 ? ' km' : ' m') : ''}</Text>
                  </Text>
              </View>
              <View style={{paddingRight: 16, width: 48, flexDirection: 'column', alignItems: "flex-end"}}>
                { station.banking && (<Icon name='ios-card' size={24} color='#7ED321' style={{}}/>) }
                { station.bonus && (<Icon name='ios-thumbs-up-outline' size={24} color='#50E3C2' style={{}}/>) }
              </View>
          </View>
        )}

          <Text style={{fontFamily: 'System', fontSize: 12, color: '#9A9A9A', textAlign: 'center', padding: 5}}>
            {this.renderUpdateDate()}
          </Text>
      </View>
    );
  }

  renderUpdateDate() {
    const station = this.props.station;

    if (!station) {
      return undefined;
    }

    if (moment().startOf('day').isSame(moment(station.last_update).startOf('day'))) {
      return `Mis à jour à ${moment(station.last_update).format("HH:mm")}`;
    } else if (moment().subtract(1, 'days').startOf('day').isSame(moment(station.last_update).startOf('day'))) {
      return `Mis à jour hier à ${moment(station.last_update).format("HH:mm")}`;
    } else {
      return `Mis à jour le ${moment(station.last_update).format("DD/MM/YYYY")} à ${moment(station.last_update).format("HH:mm")}`;
    }
  }

}


const mapStateToProps = (state) => Object.assign({}, {
    position: state.location.position,
    geoLocation: state.location.geoLocation
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        Object.assign({}, locationActionCreators),
        dispatch
    )
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StationToast);
