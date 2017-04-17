import React, {Component, PropTypes } from 'react';

import {
    Text,
    View
} from 'react-native';

class StationClosed extends Component {

  static propTypes = {
      station: PropTypes.object
  };

  render() {
    console.log('--- [StationClosed] Render -------------------------------------------------------------------------------------');

    return (
        <View style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontFamily: 'System', fontSize: 12, color: '#e74c3c'}}>Station fermée</Text>
        </View>
    );
  }

}

export default StationClosed;
