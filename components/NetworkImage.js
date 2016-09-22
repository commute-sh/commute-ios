import React, { Component, PropTypes } from 'react';

import {
    Image,
    Text,
    View,
    StyleSheet
} from 'react-native';

import Spinner from 'react-native-spinkit';

import EStyleSheet from 'react-native-extended-stylesheet';

class NetworkImage extends Component {

    static propTypes = {
      source: PropTypes.object.isRequired,
      errorSource: PropTypes.object,
      style: PropTypes.object,
      children: PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.array
      ])
    };

    static defaultProps = {
        style: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            loading: false,
            progress: 0
        };
    }

    render() {

        var loader = this.state.loading ?
            <View style={styles.progress}>
                <Spinner color="#000000" type="Pulse" />
            </View> : null;

        if (this.state.error) {
            console.log('*-*-* this.state.error:', this.state.error);
            console.log('*-*-* this.props.errorSource:', this.props.errorSource);
        }

        return this.state.error ? (
            this.props.errorSource ?
                <Image
                    source={this.props.errorSource}
                    style={[this.props.style, { }]}
                    onLoadStart={(e) => this.setState({ loading: true })}
                    onError={(e) => this.setState({ fallbackError: e.nativeEvent.error, loading: false })}
                    onProgress={(e) => this.setState({ progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total) })}
                    onLoad={() => this.setState({ loading: false, fallbackError: false })}>
                    {loader}
                </Image> :
                <View style={[this.props.style, { }]}>
                    <Text>{this.state.error}</Text>
                </View>
        ) : (
            <Image
                source={this.props.source}
                style={[this.props.style, { }]}
                onLoadStart={(e) => this.setState({ loading: true })}
                onError={(e) => this.setState({ error: e.nativeEvent.error, loading: false })}
                onProgress={(e) => this.setState({ progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total) })}
                onLoad={() => this.setState({ loading: false, error: false })}>
                {this.state.loading ? loader : this.props.children}
            </Image>
        );
    }

}



var styles = EStyleSheet.create({
    progress: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

// calculate styles
EStyleSheet.build();

export default NetworkImage;