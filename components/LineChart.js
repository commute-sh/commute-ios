import React, { Component, PropTypes } from 'react';
import { ART, Dimensions, LayoutAnimation, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import _ from 'lodash';

const { Group, Shape, Surface, LinearGradient } = ART;

import moment from 'moment';

import Icon from 'react-native-vector-icons/Ionicons';

import RNLinearGradient from 'react-native-linear-gradient';

import Morph from 'art/morph/path';

import * as graphUtils from './graph-utils';

const dimensionWindow = Dimensions.get('window');

export default class LineChart extends Component {

    static propTypes = {
        data: PropTypes.array.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        xAccessor: PropTypes.func.isRequired,
        yAccessor: PropTypes.func.isRequired,
        icon: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        titleValue: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        subTitle: PropTypes.string.isRequired,
        subTitleValue: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]),
        strokeColor: PropTypes.string,
        strokeWidth: PropTypes.number,
        backgroundColor: PropTypes.string,
        animationDuration: PropTypes.number,
        linearGradients: PropTypes.object,
        paddingSize: PropTypes.number,
        tickWidth: PropTypes.number,
        iconColor: PropTypes.string,
        iconSize: PropTypes.number,
        titleStyle: PropTypes.object,
        titleStyleValueStyle: PropTypes.object,
        subTitleStyle: PropTypes.object,
        subTitleValueStyle: PropTypes.object,
        headerStyle: PropTypes.object,
        linearGradientColors: PropTypes.array,
        onPress: PropTypes.func.isRequired

    };

    static defaultProps = {
        width: Math.round(dimensionWindow.width * 0.9),
        height: Math.round(dimensionWindow.height * 0.5),
        strokeColor: '#fff',
        strokeWidth: 2,
        iconColor: '#fff',
        iconSize: 32,
        backgroundColor: "rgba(0, 0, 0, 0)",
        title: 'Title',
        titleValue: 'Today',
        subTitle: 'SubTitle',
        subTitleValue: 2,
        animationDuration: 500,
        paddingSize: 10,
        tickWidth: 32 /* paddingSize*/ * 2,
        linearGradients: {
            '0': 'rgba(251,179,116,1)',
            '0.25': 'rgba(251,179,116,0.5)',
            '1': 'rgba(251,179,116,0)'
        },
        linearGradientColors: [ '#fb9757', '#fc6040', '#fb412b' ],
        titleStyle: {
            fontFamily: 'System',
            fontSize: 17,
            fontWeight: '600',
            color: 'white'
        },
        titleStyleValue: {
            fontFamily: 'System',
            fontSize: 17,
            fontWeight: '600',
            color: 'white'
        },
        subTitleStyle: {
            fontFamily: 'System',
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.75)',
            paddingTop: 0,
            paddingBottom: 5
        },
        subTitleStyleValue: {
            fontFamily: 'System',
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.75)',
            paddingTop: 0,
            paddingBottom: 5
        },
        headerStyle: {
            backgroundColor: 'transparent',
            borderBottomColor: 'rgba(255, 255, 255, 0.5)',
            borderBottomWidth: 1
        }
    };

    state = {
        graphWidth: 0,
        graphHeight: 0,
        linePath: '',
    };

    componentWillMount() {
        this.computeNextState(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.computeNextState(nextProps);
    }

    computeNextState(nextProps) {
        const {
            data,
            width,
            height,
            xAccessor,
            yAccessor,
        } = nextProps;

        const graphWidth = width - this.props.paddingSize * 4;
        const graphHeight = height - this.props.paddingSize * 2;

        const lineGraph = graphUtils.createLineGraph({
            data,
            xAccessor,
            yAccessor,
            width: graphWidth,
            height: graphHeight,
        });

        this.setState({
            graphWidth,
            graphHeight,
            linePath: lineGraph.path,
            ticks: lineGraph.ticks,
            allTicks: lineGraph.allTicks,
            scale: lineGraph.scale,
        });

        // The first time this function is hit we need to set the initial
        // this.previousGraph value.
        if (!this.previousGraph) {
            this.previousGraph = lineGraph;
        }

        // Only animate if our properties change. Typically this is when our
        // yAccessor function changes.
        if (this.props !== nextProps) {
            const pathFrom = this.previousGraph.path;
            const pathTo = lineGraph.path;

            cancelAnimationFrame(this.animating);
            this.animating = null;

            // Opt-into layout animations so our y tickLabel's animate.
            // If we wanted more discrete control over their animation behavior
            // we could use the Animated component from React Native, however this
            // was a nice shortcut to get the same effect.
            LayoutAnimation.configureNext(
                LayoutAnimation.create(
                    this.props.animationDuration,
                    LayoutAnimation.Types.easeInEaseOut,
                    LayoutAnimation.Properties.opacity
                )
            );

            this.setState({
                // Create the ART Morph.Tween instance.
                linePath: Morph.Tween( // eslint-disable-line new-cap
                    pathFrom,
                    pathTo,
                ),
            }, () => {
                // Kick off our animations!
                this.animate();
            });

            this.previousGraph = lineGraph;
        }
    }

    animate(start) {
        this.animating = requestAnimationFrame((timestamp) => {
            if (!start) {
                // eslint-disable-next-line no-param-reassign
                start = timestamp;
            }

            // Get the delta on how far long in our animation we are.
            const delta = (timestamp - start) / this.props.animationDuration;

            // If we're above 1 then our animation should be complete.
            if (delta > 1) {
                this.animating = null;
                // Just to be safe set our final value to the new graph path.
                this.setState({
                    linePath: this.previousGraph.path,
                });

                // Stop our animation loop.
                return;
            }

            // Tween the SVG path value according to what delta we're currently at.
            this.state.linePath.tween(delta);

            // Update our state with the new tween value and then jump back into
            // this loop.
            this.setState(this.state, () => {
                this.animate(start);
            });
        });
    }

    render() {
        const { yAccessor } = this.props;
        const { graphWidth, graphHeight, linePath, ticks, allTicks } = this.state;

        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <RNLinearGradient colors={this.props.linearGradientColors} style={{ borderRadius: 5, borderWidth: 0 }}>
                    <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 5, paddingBottom: 5 }}>
                        {this.renderHeader()}
                    </View>

                    <View style={{
                        width: this.props.width,
                        height: this.props.height + 10,
                        padding: this.props.paddingSize
                    }}>
                        {this.renderChart(linePath, graphWidth, graphHeight)}
                        {this.renderTicksX(ticks)}
                        {this.renderTicksY(allTicks, yAccessor)}
                        {this.renderTickDots(allTicks)}
                    </View>
                </RNLinearGradient>
            </TouchableOpacity>
        );
    }

    renderHeader() {
        return (
            <View style={this.props.headerStyle}>
                <View style={{flexDirection: 'row'}}>
                    <Icon name={this.props.icon} color={this.props.iconColor} size={this.props.iconSize}/>
                    <View style={{paddingLeft: 10}}>
                        <Text style={this.props.titleStyle}>{this.props.title}</Text>
                        <Text style={this.props.subTitleStyle}>{this.props.subTitle}</Text>
                    </View>
                    <View style={{paddingLeft: 10, flex: 1, alignItems: 'flex-end'}}>
                        <Text style={this.props.titleStyleValue}>{this.props.titleValue}</Text>
                        <Text style={this.props.subTitleStyleValue}>{this.props.subTitleValue}</Text>
                    </View>
                </View>
            </View>
        );
    }

    renderChart(linePath, graphWidth, graphHeight) {
        return Platform.OS === 'ios' ? (
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Surface width={graphWidth} height={graphHeight} style={{ backgroundColor: 'transparent' }}>
                    <Group x={0} y={0}>
                        <Shape
                            d={linePath}
                            fill={
                                new LinearGradient(this.props.linearGradients,
                                    graphWidth / 2, //x1
                                    0, //y1
                                    graphWidth / 2, //x2
                                    graphHeight //y2
                                )
                            }
                            stroke={this.props.strokeColor }
                            strokeWidth={this.props.strokeWidth }
                        />
                    </Group>
                </Surface>
            </View>
        ) : (
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Surface width={graphWidth} height={graphHeight} style={{ backgroundColor: 'transparent' }}>
                    <Group x={0} y={0}>
                        <Shape
                          d={linePath}
                          stroke={this.props.strokeColor }
                          strokeWidth={this.props.strokeWidth }
                        />
                    </Group>
                </Surface>
            </View>
        );
    }

    renderTicksX(ticks) {
        return (
            <View key={'ticksX'} style={[{ paddingLeft: this.props.paddingSize * 2, paddingTop: 10 }]}>
                {ticks.map((tick, index) => {
                    return (
                        <Text key={index} style={[
                            {
                                left: tick.x - (this.props.tickWidth / 2) + this.props.paddingSize * 2,
                                width: this.props.tickWidth
                            },
                            {
                                position: 'absolute',
                                top: 0,
                                fontSize: 12,
                                textAlign: 'center',
                                color: 'white',
                                backgroundColor: 'transparent'
                            }
                        ]}>
                            {moment(tick.datum.time).format('HH:mm')}
                        </Text>
                    );
                })}
            </View>
        );
    }

    renderTicksY(ticks, yAccessor) {
        return (
            <View key={'ticksY'} style={[{ position: 'absolute', top: 0, left: 0 }, { backgroundColor: 'green' }]}>
                {_.uniqBy(ticks.map(tick => {
                    tick.yValue = yAccessor(tick.datum);
                    return tick;
                }), 'yValue').map((tick, index) => {
                    const value = tick.yValue;

                    return (
                        <Text key={index} style={[
                            {
                                position: 'absolute',
                                left: 0,
                                top: tick.y + 12,
                                width: 20
                            },
                            {
                                fontSize: 12,
                                textAlign: 'right',
                                color: 'white',
                                backgroundColor: 'transparent'
                            }
                        ]}>
                            {value}
                        </Text>
                    );
                })}
            </View>
        );
    }

    renderTickDots(ticks) {
        return (
            <View key={'ticksYDot'} style={[{ position: 'absolute', top: this.props.paddingSize + 10, left: this.props.paddingSize * 2 }, { backgroundColor: 'purple' }]}>
                {ticks.map((tick, index) => (
                    <View
                        key={index}
                        style={[
                            {
                                left: tick.x - (4 / 2) + 10,
                                top: tick.y - (4 / 2)
                            },
                            {
                                position: 'absolute',
                                width: 4,
                                height: 4,
                                backgroundColor: 'white',
                                borderRadius: 100
                            }
                        ]}
                    />
                ))}
            </View>
        );
    }

}