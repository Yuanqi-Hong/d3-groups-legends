import * as d3 from 'd3'
import * as annotator from './annotator'

var margin = { top: 30, left: 50, right: 100, bottom: 30 }

var height = 300 - margin.top - margin.bottom
var width = 700 - margin.left - margin.right

var svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`)

let xPositionScale = d3
  .scaleLinear()
  .domain([0, 10])
  .range([0, width])
  
let yPositionScale = d3
  .scaleLinear()
  .domain([0, 1000])
  .range([height, 0])

// Read in files
d3.csv(require('./all-temps.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  svg
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('height', 1000)
    .attr('width', 1000)
    .attr('class', 'g-highlight')

  let circleData = [
    { name: 'first', xPos: 0, yPos: 0 },
    { name: 'second', xPos: 50, yPos: 100 },
    { name: 'third', xPos: 200, yPos: 50 }
  ]

  /* Draw circles and text elements */

  svg
    .selectAll('circle')
    .data(circleData)
    .enter()
    .append('circle')
    .attr('class', d => d.name)
    .attr('cx', d => d.xPos)
    .attr('cy', d => d.yPos)
    .attr('r', 7)

  svg
    .selectAll('text')
    .data(circleData)
    .enter()
    .append('text')
    .attr('class', d => `circle-coords ${d.name}`)
    .attr('x', d => d.xPos)
    .attr('y', d => d.yPos)
    .text(d => `(${d.xPos},${d.yPos})`)
    .attr('dx', 10)
    .attr('alignment-baseline', 'hanging')
    .attr('font-size', 12)

  /* Set up dragging */

  let draggable = d3.drag().on('drag', function(d) {
    // Update the circles with the new positions
    let circle = d3.select(this)
    circle.attr('cx', d3.event.x).attr('cy', d3.event.y)

    // Update the coordinates with the new positions
    let className = circle.attr('class')
    d3.select('text.' + className)
      .attr('x', d3.event.x)
      .attr('y', d3.event.y)
      .text(`${d3.event.x},${d3.event.y}`)
  })

  svg.selectAll('circle').call(draggable)

  annotator.addWidthLine(svg, width)
  annotator.addGroupRect(svg)
  svg.classed('circle-coords-hidden', true)

  d3.select('#toggle-coords-1')
    .on('click', function(d) {
      let hasClass = svg.classed('circle-coords-hidden')
      svg.classed('circle-coords-hidden', !hasClass)
    })

  /* Set up axes */
  var xAxis = d3.axisBottom(xPositionScale)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  var yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
}
