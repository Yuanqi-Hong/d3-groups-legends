import * as d3 from 'd3'
import * as annotator from './annotator'

var margin = { top: 30, left: 30, right: 30, bottom: 30 }

var height = 300 - margin.top - margin.bottom
var width = 600 - margin.left - margin.right

// This time we're inserting multiple SVGs, so we
// have to build a container to hold them
var container = d3.select('#chart-5')

// Let's make some scales

var xPositionScale = d3
  .scaleLinear()
  .domain([5, 60])
  .range([0, width])

var yPositionScale = d3
  .scaleLinear()
  .domain([10, 65])
  .range([height, 0])


function ready(datapoints) {
}
