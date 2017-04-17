import React, {Component, PropTypes } from 'react';

import {
    Text,
    View
} from 'react-native';

import moment from 'moment'

class StationUpdateDate extends Component {

  static propTypes = {
      station: PropTypes.object
  };

  render() {
    console.log('--- [StationClosed] Render -------------------------------------------------------------------------------------');

    return (
      <View>
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

export default StationUpdateDate;
