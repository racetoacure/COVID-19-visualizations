const svgHeight = 500;
const svgWidth = 700;

const svg = d3.select('.vis1SVG');

var nameEdgeLeft = 250; // if names are on left axis
var nameEdgeBottom = 70; // if names are on bottom axis
var numberEdge = 70;

var margin = {
    top: 0, // top margin
    right: 15, // right margin
    left: numberEdge,
    bottom: nameEdgeBottom
}

var innerHeight = svgHeight - margin.top - margin.bottom;
var innerWidth = svgWidth - margin.right - margin.left;

// append the svg object to the body of the page
svg
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("Michelle_Lam1.csv",
  function(d){
    return {
      date: new Date(d.Date),
      cases: +d.Cases
    };
  }).then(

function(data) {
  cutoffDateMin = new Date('09/23/2020');
  cutoffDateMax = new Date('11/18/2020');
  data = data.filter(function(d) {
    return (d.date > cutoffDateMin && d.date < cutoffDateMax);
  });

  const graph1 = svg.append('g')
      .attr('transform', `translate(${margin.left}, 5)`);

  var xAxisLabel1 = "";
  var yAxisLabel1 = "AB"
  // Add X axis --> it is a date format
  var x1 = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, innerWidth ]);
  graph1.append("g")
    .attr("transform", "translate(0," + (innerHeight / 2 - 15) + ")")
    .call(d3.axisBottom(x1).ticks(8).tickFormat(d3.timeFormat("%b %d")));
  graph1.append('text')
    .text(xAxisLabel1)
    .attr('fill', 'black')
    .attr('class', 'axis-label')
    .attr('y', innerHeight/ 2 + 50)
    .attr('x', innerWidth / 2 - 30 );

  // Add Y axis
  var y1 = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.cases; })])
    .range([ innerHeight / 2 - 15, 0 ]);
  graph1.append("g")
    .call(d3.axisLeft(y1).ticks(4).tickFormat(d3.format(".1s")));
  graph1.append('text')
    .text(yAxisLabel1)
    .attr('fill', 'black')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('y', '-30')
    .attr('x', -innerHeight / 2 + 120)
    .style('text-anchor', 'middle');

  // Draw the line
  graph1
    .append("path")
    .datum(data)
    .attr("fill", colours[10])
    .attr("stroke", colours[0])
    .attr("stroke-width", 1.5)
    .attr("d", d3.area()
      .x(function(d) { return x1(d.date) })
      .y0(y1(0))
      .y1(function(d) { return y1(d.cases) })
      )

});

d3.csv("Michelle_Lam2.csv",
  function(d){
    return {
      date: new Date(d.Date),
      cases: +d.total
    };
  }).then(

function(data) {
  cutoffDateMin = new Date('09/23/2020');
  cutoffDateMax = new Date('11/18/2020');
  data = data.filter(function(d) {
    return (d.date > cutoffDateMin && d.date < cutoffDateMax);
  });

  const graph2 = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${innerHeight / 2+5})`);

  var xAxisLabel2 = "";
  var yAxisLabel2 = "Total"
  // Add X axis --> it is a date format
  var x2 = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, innerWidth ]);
  graph2.append("g")
    .attr("transform", "translate(0," + (innerHeight / 2 - 15) + ")")
    .call(d3.axisBottom(x2).ticks(8).tickFormat(d3.timeFormat("%b %d")));
  graph2.append('text')
    .text(xAxisLabel2)
    .attr('fill', 'black')
    .attr('class', 'axis-label')
    .attr('y', innerHeight/ 2 + 50)
    .attr('x', innerWidth / 2 - 30 );

  // Add Y axis
  var y2 = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.cases; })])
    .range([ innerHeight / 2 - 15, 0 ]);
  graph2.append("g")
    .call(d3.axisLeft(y2).ticks(4).tickFormat(d3.format(".1s")));
  graph2.append('text')
    .text(yAxisLabel2)
    .attr('fill', 'black')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('y', '-30')
    .attr('x', -innerHeight / 2 + 120)
    .style('text-anchor', 'middle');

  // Draw the line
  graph2
    .append("path")
    .datum(data)
    .attr("fill", colours[5])
    .attr("stroke", colours[7])
    .attr("stroke-width", 1.5)
    .attr("d", d3.area()
      .x(function(d) { return x2(d.date) })
      .y0(y2(0))
      .y1(function(d) { return y2(d.cases) })
      )

});
