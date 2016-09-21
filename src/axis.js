import _ticks from './ticks';
import { scaleRange, isOrdinal } from './scale';
import { select } from 'd3-selection';
import { line } from 'd3-shape';
import { dataJoin as _dataJoin } from 'd3fc-data-join';
import { rebindAll } from 'd3fc-rebind';

const identity = (d) => d;

export default () => {

    let decorate = () => {};
    let orient = 'bottom';
    let tickFormat = null;
    let outerTickSize = 6;
    let innerTickSize = 6;
    let tickPadding = 3;

    const svgDomainLine = line();
    const ticks = _ticks();

    const dataJoin = _dataJoin('g', 'tick')
        .key(identity);

    const domainPathDataJoin = _dataJoin('path', 'domain');

    // returns a function that creates a translation based on
    // the bound data
    const containerTranslate = (s, trans) =>
        d => trans(s(d), 0);

    const translate = (x, y) =>
        isVertical()
            ? `translate(${y}, ${x})`
            : `translate(${x}, ${y})`;

    const pathTranspose = (arr) =>
        isVertical()
           ? arr.map(d => [d[1], d[0]])
           : arr;

    const isVertical = () =>
        orient === 'left' || orient === 'right';

    const tryApply = (fn, defaultVal) => {
        const scale = ticks.scale();
        return scale[fn] ? scale[fn].apply(scale, ticks.ticks()) : defaultVal;
    };

    const axis = (selection) => {

        selection.each(function(data, index) {

            const scale = ticks.scale();

            // Stash a snapshot of the new scale, and retrieve the old snapshot.
            const scaleOld = this.__chart__ || scale;
            this.__chart__ = scale.copy();

            const ticksArray = ticks();
            const tickFormatter = tickFormat == null ? tryApply('tickFormat', identity) : tickFormat;
            const sign = orient === 'bottom' || orient === 'right' ? 1 : -1;
            const container = select(this);

            // add the domain line
            const range = scaleRange(scale);
            const domainPathData = pathTranspose([
                [range[0], sign * outerTickSize],
                [range[0], 0],
                [range[1], 0],
                [range[1], sign * outerTickSize]
            ]);

            const domainLine = domainPathDataJoin(container, [data]);
            domainLine
                .attr('d', svgDomainLine(domainPathData));

            const g = dataJoin(container, ticksArray);

            // enter
            g.enter()
                .attr(
                    // set the initial tick position based on the previous scale
                    // in order to get the correct enter transition - however, for ordinal
                    // scales the tick will not exist on the old scale, so use the current position
                    'transform', containerTranslate(isOrdinal(scale) ? scale : scaleOld, translate)
                )
                .append('path');

            var labelOffset = sign * (innerTickSize + tickPadding);
            g.enter()
                .append('text')
                .attr('transform', translate(0, labelOffset));

            // update
            g.attr('class', 'tick orient-' + orient);

            g.attr('transform', containerTranslate(scale, translate));

            g.select('path')
                .attr('d',
                    (d) => svgDomainLine(pathTranspose([
                        [0, 0], [0, sign * innerTickSize]
                    ]))
                );

            g.select('text')
               .attr('transform', translate(0, labelOffset))
               .attr('dy', () => {
                   let offset = '0em';
                   if (isVertical()) {
                       offset = '0.32em';
                   } else if (orient === 'bottom') {
                       offset = '0.71em';
                   }
                   return offset;
               })
               .text(tickFormatter);

            // exit - for non ordinal scales, exit by animating the tick to its new location
            if (!isOrdinal(scale)) {
                g.exit()
                    .attr('transform', containerTranslate(scale, translate));
            }

            decorate(g, data, index);
        });
    };

    axis.tickFormat = function(x) {
        if (!arguments.length) {
            return tickFormat;
        }
        tickFormat = x;
        return axis;
    };

    axis.tickSize = function(x) {
        var n = arguments.length;
        if (!n) {
            return innerTickSize;
        }
        innerTickSize = Number(x);
        outerTickSize = Number(arguments[n - 1]);
        return axis;
    };

    axis.innerTickSize = function(x) {
        if (!arguments.length) {
            return innerTickSize;
        }
        innerTickSize = Number(x);
        return axis;
    };

    axis.outerTickSize = function(x) {
        if (!arguments.length) {
            return outerTickSize;
        }
        outerTickSize = Number(x);
        return axis;
    };

    axis.tickPadding = function(x) {
        if (!arguments.length) {
            return tickPadding;
        }
        tickPadding = x;
        return axis;
    };

    axis.orient = function(x) {
        if (!arguments.length) {
            return orient;
        }
        orient = x;
        return axis;
    };

    axis.decorate = function(x) {
        if (!arguments.length) {
            return decorate;
        }
        decorate = x;
        return axis;
    };

    rebindAll(axis, ticks);

    return axis;
}
