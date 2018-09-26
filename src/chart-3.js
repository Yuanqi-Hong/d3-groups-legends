import * as d3 from 'd3'
import * as annotator from './annotator'

var margin = { top: 30, left: 100, right: 100, bottom: 30 }

var height = 300 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

var svg = d3
  .select('#chart-3')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create our scales
var xPositionScale = d3
  .scaleLinear()
  .domain([20, 100])
  .range([0, width])

var yPositionScale = d3
  .scalePoint()
  .range([height, 0])
  .padding(0.5)

// Read in files
d3.csv(require('./all-temps.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  // Group based on city names
  var nested = d3
    .nest()
    .key(d => d.city)
    .entries(datapoints)

  // Pull out the city names from each group
  // and then update our yPositionScale
  var cityNames = nested.map(d => d.key)
  yPositionScale.domain(cityNames)

  svg
    .selectAll('.city-data')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', d => {
      // Translate using template literals
      return `translate(0,${yPositionScale(d.key)})`
    })
    .each(function(d) {
      var g = d3.select(this)

      var datapoints = d.values

      // Need to use + here to convert to numbers
      let maxHigh = d3.max(datapoints, d => +d.high)
      let minHigh = d3.min(datapoints, d => +d.high)

      g.append('circle')
        .attr('r', 7)
        .attr('fill', 'pink')
        .attr('cy', 0)
        .attr('cx', xPositionScale(maxHigh))

      g.append('circle')
        .attr('r', 7)
        .attr('fill', 'lightblue')
        .attr('cy', 0)
        .attr('cx', xPositionScale(minHigh))

      g.append('line')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xPositionScale(minHigh))
        .attr('x2', xPositionScale(maxHigh))
        .attr('stroke', 'grey')
        .lower()

      g.append('text')
        .text(d.key)
        .attr('font-size', 10)
        .attr('x', 0)
        .attr('y', 0)
        .attr('alignment-baseline', 'middle')
        .attr('text-anchor', 'end')
        .attr('dx', -5)
    })

  annotator.drawAnnotations(svg, width)

  /* Add axes */
  var xAxis = d3.axisBottom(xPositionScale).tickSize(-height)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  // make the axis lines dashed
  svg.selectAll('.x-axis line').attr('stroke-dasharray', '3 5')
  .attr('stroke-linecap', 'round')

  // remove the non-dashed weird line
  svg.select('.x-axis .domain').remove()
}
