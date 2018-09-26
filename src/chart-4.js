import * as d3 from 'd3'
import * as annotator from './annotator'

var margin = { top: 40, left: 40, right: 40, bottom: 40 }

var height = 700 - margin.top - margin.bottom

var width = 700 - margin.left - margin.right

var svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create our scales
var xPositionScale = d3
  .scaleLinear()
  .domain([0, 2000])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([0, 2000])
  .range([height, 0])

var colorScale = d3
  .scaleOrdinal()
  .range([
    '#8dd3c7',
    '#fccde5',
    '#bebada',
    '#fb8072',
    '#80b1d3',
    '#fdb462',
    '#b3de69'
  ])

d3.csv(require('./weekly_earnings.csv'))
  .then(ready)
  .catch(err => console.log(err))

function ready(datapoints) {
  // group by categories, we got 5 <g> elements
  var nested = d3
    .nest()
    .key(d => d.category)
    .entries(datapoints)

  // make a <g> for each of those
  svg
    .selectAll('.job-category')
    .data(nested)
    .enter()
    .append('g')
    .attr('class', 'job-category')
    .each(function(d) {
      var g = d3.select(this)
      var datapoints = d.values

      // make a <circle> for each of the datapoints
      g.selectAll('.job')
        .data(datapoints)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', d => colorScale(d.category))
        .attr('cx', d => xPositionScale(d.weekly_earnings_m))
        .attr('cy', d => yPositionScale(d.weekly_earnings_f))
    })

  svg
    .append('line')
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('x1', xPositionScale(0))
    .attr('x2', xPositionScale(2000))
    .attr('y1', yPositionScale(0))
    .attr('y2', yPositionScale(2000))

  var differences = [0.9, 0.8, 0.7]
  svg
    .selectAll('.parity-line')
    .data(differences)
    .enter()
    .append('line')
    .attr('class', 'parity-line')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    .attr('x1', xPositionScale(0))
    .attr('x2', xPositionScale(2000))
    .attr('y1', yPositionScale(0))
    .attr('y2', d => yPositionScale(2000 * d))
    .attr('opacity', 0.5)

  svg
    .append('g')
    // make it rotate around ($0,$0)
    .attr('transform', `rotate(-45 0 ${height})`)
    .append('text')
    .attr('font-weight', 'bold')
    .attr('x', 500)
    .attr('y', height)
    .attr('dy', -3)
    .text('EQUAL WAGES')

  svg
    .append('g')
    .attr('transform', `rotate(-42 ${xPositionScale(0)} ${yPositionScale(0)})`)
    .append('text')
    .attr('y', height)
    .attr('x', 550)
    .attr('dy', -3)
    .text('Women make 10% less')

  svg
    .append('g')
    .attr('transform', `rotate(-39 ${xPositionScale(0)} ${yPositionScale(0)})`)
    .append('text')
    .attr('y', height)
    .attr('x', 550)
    .attr('dy', 0)
    .text('Women make 20% less')

  svg
    .append('g')
    .attr('transform', `rotate(-35 ${xPositionScale(0)} ${yPositionScale(0)})`)
    .append('text')
    .attr('y', height)
    .attr('x', 550)
    .attr('dy', -2)
    .text('Women make 30% less')

  let legend = svg.append('g').attr('transform','translate(50,50)')

  legend
    .selectAll('.legend-entry')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0,${i * 20})`)
    .attr('class', 'legend-entry')
    .each(function(d) {
      let g = d3.select(this)

      g.append('circle')
        .attr('r', 5)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('fill', colorScale(d.key))

      g.append('text')
        .text(d.key)
        .attr('dx', 10)
        .attr('alignment-baseline','middle')

      g.append('rect')
        .attr('x', -8)
        .attr('y', -9)
        .attr('width', 370)
        .attr('height', 14)
        .attr('fill', '#fcfcfc')
        .lower()

    })

  /* Add axes */
  var xAxis = d3
    .axisBottom(xPositionScale)
    .tickSize(-height)
    .tickFormat(d => '$' + d)

  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.selectAll('.x-axis path').remove()

  var yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .tickFormat(d => '$' + d)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg.selectAll('.domain').remove()

  // make the axis lines dashed
  svg
    .selectAll('.axis')
    .attr('stroke-dasharray', '3 5')
    .attr('stroke-linecap', 'round')
}
