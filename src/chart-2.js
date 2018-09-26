import * as d3 from 'd3'
import * as annotator from './annotator'

var margin = { top: 30, left: 50, right: 100, bottom: 30 }

var height = 300 - margin.top - margin.bottom
var width = 700 - margin.left - margin.right

var svg = d3
  .select('#chart-2')
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
  let circleData = [
    { name: 'first', xPos: 0, yPos: 0 },
    { name: 'second', xPos: 50, yPos: 100 },
    { name: 'third', xPos: 200, yPos: 50 }
  ]

  /* Draw circles and text elements */
  svg
    .selectAll('g')
    .data(circleData)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.xPos},${d.yPos})`)
    .each(function(d) {
      let g = d3.select(this)
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 7)
    })

  annotator.drawAnnotations(svg, width)

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
