const svgHeight = 500;
const svgWidth = 700;

const svg = d3.select('.visSVG');

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
d3.csv("Palak_Agarwal.csv").then(function(data){convert(data)});

function convert(beforeData) {
  var data = [];
  beforeData.forEach(function(row) {
    var rowOttawa = {
      date: new Date(row.Date),
      location: "Ottawa",
      cases: +row.Ottawa
    }
    var rowQuebec = {
      date: new Date(row.Date),
      location: "Quebec",
      cases: +row.Quebec
    }
    var rowAlberta = {
      date: new Date(row.Date),
      location: "Alberta",
      cases: +row.Alberta
    }
    var rowManitoba = {
      date: new Date(row.Date),
      location: "Manitoba",
      cases: +row.Manitoba
    }
    data.push(rowOttawa,rowQuebec,rowAlberta,rowManitoba);
  })
  render(data);
  console.log(data);
}

function render(data) {

  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.location;})
    .entries(data);

  const graph = svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`);

  var xAxisLabel = "Date [2020]";
  var yAxisLabel = "Current Hospitalizations"
  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([ 0, innerWidth ]);
  graph.append("g")
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(d3.axisBottom(x).ticks(10).tickFormat(d3.timeFormat("%b %d")));
  graph.append('text')
    .text(xAxisLabel)
    .attr('fill', 'black')
    .attr('class', 'axis-label')
    .attr('y', innerHeight + 60)
    .attr('x', innerWidth / 2 );

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.cases; })])
    .range([ innerHeight, 0 ]);
  graph.append("g")
    .call(d3.axisLeft(y));
  graph.append('text')
    .text(yAxisLabel)
    .attr('fill', 'black')
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('y', '-50')
    .attr('x', -innerHeight / 2)
    .style('text-anchor', 'middle');
  // color palette
  var res = sumstat.map(function(d){ return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(colours)

  // Draw the line
  graph.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
        .attr("fill", "none")
        .classed("line", "true")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 2.5)
        .attr('d', function(d) {
          return d3.line()
            .defined(function(d) { return d.cases != 0; })
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.cases); })
          (d.values)
        })

}
