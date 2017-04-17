import React, {Component, PropTypes } from 'react';

import {
    Text,
    View
} from 'react-native';

class StationNoInfos extends Component {

  static propTypes = {
      station: PropTypes.object
  };

  render() {
    console.log('--- [StationNoInfos] Render -------------------------------------------------------------------------------------');

    return (
        <View>
            <Text style={{ textAlign: 'center' }}>No Infos on station</Text>
        </View>
    );
  }

}

export default StationNoInfos;
