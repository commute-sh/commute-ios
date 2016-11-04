import React, { Component, PropTypes } from 'react';
import {
    View,
    Text,
    Platform,
    TouchableWithoutFeedback
} from 'react-native';

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
        onPress: PropTypes.func
    };

    static defaultProps = {
        pinSize: 32,
        value: 0,
        strokeColor: 'black',
        bgColor: 'white',
        fontSize: 14,
        lineWidth: 2,
        fontWeight: 900
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
                    backgroundColor: 'white',
                    borderRadius: 100,
                    borderWidth: this.props.lineWidth,
                    borderColor: this.props.strokeColor,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: this.props.fontSize,
                        fontWeight: this.props.fontWeight,
                        color: this.props.strokeColor }}>
                        {this.props.value}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

export default StationMarkerView;
