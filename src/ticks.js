import { scaleIdentity } from 'd3-scale';

export default () => {

    let scale = scaleIdentity();
    let tickArguments = [10];
    let tickValues = null;

    const tryApply = (fn, defaultVal) =>
        scale[fn] ? scale[fn].apply(scale, tickArguments) : defaultVal;

    const ticks = () =>
        tickValues == null ? tryApply('ticks', scale.domain()) : tickValues;

    ticks.scale = (...args) => {
        if (!args.length) {
            return scale;
        }
        scale = args[0];
        return ticks;
    };

    ticks.ticks = (...args) => {
        if (!args.length) {
            return tickArguments;
        }
        tickArguments = args[0];
        return ticks;
    };

    ticks.tickValues = (...args) => {
        if (!args.length) {
            return tickValues;
        }
        tickValues = args[0];
        return ticks;
    };

    return ticks;
};
