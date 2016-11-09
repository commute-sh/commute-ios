import React, { Component, PropTypes } from 'react';

import {
    Image,
    Text,
    View,
    StyleSheet,
    Platform
} from 'react-native';

import Spinner from 'react-native-spinkit';

import EStyleSheet from 'react-native-extended-stylesheet';
const ImageSourcePropType = require('ImageSourcePropType');

class NetworkImage extends Component {

    static propTypes = {
      source: ImageSourcePropType.isRequired,
      resizeMode: PropTypes.string,
      errorSource: ImageSourcePropType,
      style: PropTypes.object,
      children: PropTypes.oneOfType([
          PropTypes.object,
          PropTypes.array
      ])
    };

    static defaultProps = {
        style: {},
        resizeMode: 'cover'
    };

    constructor(props) {
        super(props);

        this.state = {
            error: false,
            fallbackError: false,
            loading: false,
            loaded: false,
            progress: 0
        };
    }

    render() {

        var loader = this.state.loading && !this.state.loaded ?
            <View style={styles.progress}>
                <Spinner color="#000000" type="Pulse" />
            </View> : null;

        if (this.state.error) {
            // console.log('*-*-* this.state.error:', this.state.error);
            // console.log('*-*-* this.props.source:', this.props.source);
            // console.log('*-*-* this.props.errorSource:', this.props.errorSource);
        }

        if (this.state.fallbackError) {
            // console.log('*-*-* this.state.fallbackError:', this.state.fallbackError);
            // console.log('*-*-* this.props.errorSource:', this.props.errorSource);
        }

        const events = this.state.loaded ? {} : {
            onLoadStart: (e) => {
                // console.log("////////////// [Default] onLoadStart:");
                if (!this.state.loaded) {
                    this.setState({ loading: true })
                }
            },
            onError: (e) => {
                // console.log("////////////// [Default] onError:");
                if (!this.state.loaded) {
                    this.setState({ error: e.nativeEvent.error, loading: false });
                }
            },
            // onProgress: (e) => {
            //     if (!this.state.loaded) {
            //         this.setState({ progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total) })
            //     }
            // },
            onLoad: (e) => {
                // console.log("////////////// [Default] onLoad:");
                if (!this.state.loaded) {
                    this.setState({ loaded: true, loading: false, error: false });
                }
            },
            onLoadEnd: (e) => {
                // console.log("////////////// [Default] onLoadEnd:");
                if (!this.state.loaded) {
                    this.setState({ loaded: Platform.OS === 'ios', error: Platform.OS === 'ios' ? undefined : new Error('Failed to load Image: ' + this.props.source), loading: false });
                }
            }
        };

        const fallbackEvents = this.state.loaded ? {} : {
            onLoadStart: (e) => {
                // console.log("////////////// [Fallback] onLoadStart:");
                if (!this.state.fallbackError) {
                    this.setState({ loading: true })
                }
            },
            onError: (e) => {
                // console.log("////////////// [Fallback] Error:");
                if (!this.state.loaded) {
                    this.setState({ fallbackError: e.nativeEvent.error, loading: false });
                }
            },
            // onProgress: (e) => {
            //     if (!this.state.loaded) {
            //         this.setState({ progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total) })
            //     }
            // },
            onLoad: (e) => {
                // console.log("////////////// [Fallback] onLoad:");
                if (!this.state.loaded) {
                    this.setState({ loading: false, loaded: true, fallbackError: false })
                }
            },
            onLoadEnd: (e) => {
                // console.log("////////////// [Fallback] onLoadEnd:");
                if (!this.state.loaded) {
                    this.setState({ loaded: Platform.OS === 'ios', fallbackError: Platform.OS === 'ios' ? undefined : new Error('Failed to load Fallback Image: ' + this.props.errorSource), loading: false })
                }
            }
        };

        return this.state.error ? (
            this.props.errorSource && !this.state.fallbackError ?
                <Image
                    source={this.props.errorSource}
                    style={[this.props.style, { }]}
                    resizeMode={this.props.resizeMode}
                    {...fallbackEvents}
                >
                    {loader}
                </Image> :
                <View style={[this.props.style, { }]}>
                    <Text>{this.state.error}</Text>
                </View>
        ) : (
            <Image
                source={this.props.source}
                style={[this.props.style, { }]}
                resizeMode={this.props.resizeMode}
                {...events}
            >
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