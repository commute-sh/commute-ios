import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Platform,
    TouchableWithoutFeedback
} from 'react-native';

import Color from 'color';

class StationMarkerView extends Component {

    static propTypes = {
        key: PropTypes.string,
        number: PropTypes.number,
        value: PropTypes.number,
        station: PropTypes.object,
        pinSize: PropTypes.number,
        strokeColor: PropTypes.string,
        bgColor: PropTypes.string,
        lineWidth: PropTypes.number,
        fontSize: PropTypes.number,
        fontWeight: PropTypes.string,
        opacity: PropTypes.number,
        color: PropTypes.string,
        onPress: PropTypes.func
    };

    static defaultProps = {
        pinSize: 32,
        value: 0,
        strokeColor: '#2c3e50',
        bgColor: '#2c3e50',
        fontSize: 14,
        lineWidth: 2,
        fontWeight: '100',
        color: 'white'
    };

    onPress(e) {
        if (this.props.onPress) {
            this.props.onPress(e);
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.onPress.bind(this)}>
                <View style={{
                    width: this.props.pinSize,
                    height: this.props.pinSize,
                    backgroundColor: this.props.bgColor,
                    borderRadius: 100,
                    borderWidth: this.props.lineWidth,
                    borderColor: this.props.strokeColor,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: this.props.fontSize,
                        fontWeight: this.props.fontWeight,
                        backgroundColor: 'transparent',
                        color: Color('white').alpha(0.7) }}>
                        {this.props.value}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

export default StationMarkerView;
