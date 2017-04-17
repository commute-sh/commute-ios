import React, {Component, PropTypes } from 'react';

import {
    Text,
    View
} from 'react-native';

class Spacer extends Component {

  static propTypes = {
      height: PropTypes.number
  };

  render() {
    return (
        <View style={{height:this.props.height}} />
    );
  }

}

export default Spacer;
