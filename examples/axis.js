var scale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, 1000]);

var axis = fc.axis()
  .scale(scale);

var d3Axis = d3.axisBottom(scale);

const svg = d3.select('body').append('svg')
    .attr('class', 'axis')
    .attr('width', 1440)
    .attr('height', 200);
svg.append('g')
    .attr('transform', 'translate(0,30)')
    .call(axis);

svg.append('g')
    .attr('transform', 'translate(0,60)')
    .call(d3Axis);
