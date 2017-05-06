import React, {Component, PropTypes } from 'react';

import {
    Text,
    View
} from 'react-native';

import StationClosed from './stations/StationClosed'
import StationNoInfos from './stations/StationNoInfos'
import StationInfos from './stations/StationInfos'
import StationHeader from './stations/StationHeader'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as locationActionCreators from '../actions/location'

class StationToast extends Component {

  static propTypes = {};

  constructor(props) {
    super(props);

    this.state = {
      distance: Number.MAX_SAFE_INTEGER
    };
  }

  componentDidMount() {
    this.updateDistance(this.props.geoLocation, this.props.station);
  }

  componentWillReceiveProps(nextProps) {
    this.updateDistance(nextProps.geoLocation, nextProps.station);
  }

  updateDistance(geoLocation, station) {
      this.setState({
          distance: geoLocation && station ?
              (geoLocation.distanceTo(station.geoLocation, true) * 1000) :
              Number.MAX_SAFE_INTEGER
      });
  }

  render() {
    console.log('--- [StationToast] Render -------------------------------------------------------------------------------------');

    const station = this.props.station;

    if (!station) {
       return <StationNoInfos/>;
    }

    return (
      <View>
        <StationHeader station={station} />
          <View style={{flex: 1, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0}}>
            { station.status == 'CLOSED' && <StationClosed />}
            { station.status != 'CLOSED' && <StationInfos station={station} distance={this.state.distance} />}
          </View>
      </View>
    );
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
