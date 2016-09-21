import { scaleIdentity } from 'd3-scale';

export default () => {

    let scale = scaleIdentity();
    let tickArguments = [10];
    let tickValues = null;

    const tryApply = (fn, defaultVal) =>
        scale[fn] ? scale[fn].apply(scale, tickArguments) : defaultVal;

    const ticks = () =>
        tickValues == null ? tryApply('ticks', scale.domain()) : tickValues;

    ticks.scale = function(x) {
        if (!arguments.length) {
            return scale;
        }
        scale = x;
        return ticks;
    };

    ticks.ticks = function(x) {
        if (!arguments.length) {
            return tickArguments;
        }
        tickArguments = arguments;
        return ticks;
    };

    ticks.tickValues = function(x) {
        if (!arguments.length) {
            return tickValues;
        }
        tickValues = x;
        return ticks;
    };

    return ticks;
};
