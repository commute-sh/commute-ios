import React, { Component, PropTypes } from 'react';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';

import Color from 'color';

import FaIcon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

export default class IconButton extends Component {

    static propTypes = {
        size: PropTypes.number,
        fontSize: PropTypes.number,
        color: PropTypes.string,
        shadowColor: PropTypes.string,
        bgColor: PropTypes.string,
        activeBgColor: PropTypes.string,
        style: PropTypes.object,
        shadowOpacity: PropTypes.number,
        shadowRadius: PropTypes.number,
        activeOpacity: PropTypes.number,
        iconName: PropTypes.string.isRequired,
        iconPadding: PropTypes.number,
        onPress: PropTypes.func
    };

    static defaultProps = {
        size: 44,
        fontSize: 22,
        color: 'white',
        shadowColor: '#000000',
        bgColor: '#49b2d8',
        activeBgColor: Color('#49b2d8').darken(0.5).toString(),
        shadowOpacity: 0.5,
        shadowRadius: 1,
        activeOpacity: 0.5,
        iconPadding: 11,
        onPress: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedIndex: 0
        };
    }

    render() {
        return (
            <View style={[this.props.style, {
                width: this.props.size,
                height: this.props.size,
                shadowColor: this.props.shadowColor,
                shadowOpacity: this.props.shadowOpacity,
                borderRadius: this.props.size,
                backgroundColor:  this.props.activeBgColor,
                shadowRadius: this.props.shadowRadius,
                shadowOffset: {
                    height: 1,
                    width: 0
                }
            }]}>
                <TouchableOpacity activeOpacity={this.props.activeOpacity} onPress={this.props.onPress}>
                    <View style={{
                        borderRadius: this.props.size,
                        backgroundColor: this.props.bgColor
                    }}>
                        <Icon
                              name={this.props.iconName}
                              size={this.props.fontSize}
                              color={this.props.color}
                              backgroundColor="transparent"
                              style={{
                                  backgroundColor: 'transparent',
                                  paddingLeft: 12,
                                  paddingRight: 10,
                                  paddingTop: 12,
                                  paddingBottom: 10,
                              }} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

}
