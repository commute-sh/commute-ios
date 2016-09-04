import * as scale from 'd3-scale';
import * as shape from 'd3-shape';
import * as array from 'd3-array';
import * as time from 'd3-time';
const d3 = {
    array,
    scale,
    shape,
    time
};

import moment from 'moment';

/**
 * Create an x-scale.
 * @param {number} start Start time in seconds.
 * @param {number} end End time in seconds.
 * @param {number} width Width to create the scale with.
 * @return {Function} D3 scale instance.
 */
function createScaleX(start, end, width) {
    return d3.scale.scaleTime()
        .domain([new Date(start * 1000), new Date(end * 1000)])
        .range([0, width]);
}

/**
 * Create a y-scale.
 * @param {number} minY Minimum y value to use in our domain.
 * @param {number} maxY Maximum y value to use in our domain.
 * @param {number} height Height for our scale's range.
 * @return {Function} D3 scale instance.
 */
function createScaleY(minY, maxY, height) {
    return d3.scale.scaleLinear()
        .domain([minY, maxY]).nice()
        // We invert our range so it outputs using the axis that React uses.
        .range([height, 0]);
}

/**
 * Creates a line graph SVG path that we can then use to render in our
 * React Native application with ART.
 * @param {Array.<Object>} options.data Array of data we'll use to create
 *   our graphs from.
 * @param {function} xAccessor Function to access the x value from our data.
 * @param {function} yAccessor Function to access the y value from our data.
 * @param {number} width Width our graph will render to.
 * @param {number} height Height our graph will render to.
 * @return {Object} Object with data needed to render.
 */
export function createLineGraph({
    data,
    xAccessor,
    yAccessor,
    width,
    height,
}) {
    const lastDatum = data[data.length - 1];

    const scaleX = createScaleX(
        data[0].time.unix(),
        lastDatum.time.unix(),
        width - 20
    );

    // Collect all y values.
    const allYValues = data.reduce((all, datum) => {
        all.push(yAccessor(datum));
        return all;
    }, []);
    // Get the min and max y value.
    const extentY = d3.array.extent(allYValues);
    const scaleY = createScaleY(extentY[0], extentY[1], height - 20);

    const lineShape = d3.shape.line()
        .curve(d3.shape.curveCatmullRom)
        .x((d) => 10 + scaleX(xAccessor(d)))
        .y((d) => 10 + scaleY(yAccessor(d)));

    const firstDatum = data[0];
    const firstDate = moment(firstDatum.time);
    const lastDate = moment(lastDatum.time);
    const deltaFirstLast = moment.duration(lastDate.diff(firstDate)).asMinutes() / 2;

    const middleDate = moment(firstDate).add(deltaFirstLast, 'minutes');
    const timestamp = moment(middleDate).unix();
    const timestamps = data.map(xAccessor).map(date => date.getTime() / 1000);

    // console.log('timestamp:', timestamp);
    // console.log('timestamps:', timestamps);

    const middleDataIndex = closest(timestamps, timestamp);
    const middleDatum = data[middleDataIndex];

    // console.log('ts index found:', middleDataIndex);
    // console.log('nearest ts found:', middleDatum.time.unix());

    return {
        data,
        scale: {
            x: scaleX,
            y: scaleY,
        },
        path: lineShape(data),
        ticks: [firstDatum, middleDatum, lastDatum].map((datum) => {

            // console.log('--- datum:', datum);
            const time = datum;

            // console.log('--- time:', time);
            const value = yAccessor(datum);

            // console.log('--- value:', value);

            return {
                x: scaleX(datum.time),
                y: scaleY(value),
                datum,
            };
        }),
        allTicks: data.map((datum) => {

            // console.log('--- datum:', datum);
            const time = datum;

            // console.log('--- time:', time);
            const value = yAccessor(datum);

            // console.log('--- value:', value);

            return {
                x: scaleX(datum.time),
                y: scaleY(value),
                datum,
            };
        }),
    };

}

function closest (arr, num) {
    var curr = arr[0];
    var index = 0;
    var diff = Math.abs (num - curr);
    for (var val = 0; val < arr.length; val++) {
        var newdiff = Math.abs (num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
            index = val;
        }
    }
    return index;
}