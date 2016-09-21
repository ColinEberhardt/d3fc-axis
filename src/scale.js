export const isOrdinal = (scale) => scale.rangeExtent;

// ordinal axes have a rangeExtent function, this adds any padding that
// was applied to the range. This functions returns the rangeExtent
// if present, or range otherwise
//
// NOTE: d3 uses very similar logic here:
// https://github.com/mbostock/d3/blob/5b981a18db32938206b3579248c47205ecc94123/src/scale/scale.js#L8
export const scaleRange = (scale) => {
    // for non ordinal, simply return the range
    if (!isOrdinal(scale)) {
        return scale.range();
    }

    // For ordinal, use the rangeExtent. However, rangeExtent always provides
    // a non inverted range (i.e. extent[0] < extent[1]) regardless of the
    // range set on the scale. The logic below detects the inverted case.
    //
    // The d3 code that tackles the same issue doesn't have to deal with the inverted case.
    const scaleRange = scale.range();
    const extent = scale.rangeExtent();
    if (scaleRange.length <= 1) {
        // we cannot detect the inverted case if the range (and domain) has
        // a single item in it.
        return extent;
    }

    const inverted = scaleRange[0] > scaleRange[1];
    return inverted ? [extent[1], extent[0]] : extent;
};
