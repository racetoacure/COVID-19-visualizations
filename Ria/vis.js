const svgHeight = 500;
const svgWidth = 700;

const svg = d3.select('.visSVG');

var nameEdgeLeft = 250; // if names are on left axis
var nameEdgeBottom = 50; // if names are on bottom axis
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
d3.csv("Ria_Patel.csv").then(function(data){convert(data)});

function convert(beforeData) {
  var data = [];
  beforeData.forEach(function(row) {
    var rowOttawa = {
      date: new Date(row.date),
      location: "Ottawa",
      tests: +row.daily_tests_Ottawa,
      cases: +row.daily_cases_Ottawa
    }
    var rowQuebec = {
      date: new Date(row.date),
      location: "Quebec",
      tests: +row.daily_tests_Quebec,
      cases: +row.daily_cases_Quebec
    }
    var rowBC = {
      date: new Date(row.date),
      location: "BC",
      tests: +row.daily_tests_BC,
      cases: +row.daily_cases_BC
    }
    var rowAlberta = {
      date: new Date(row.date),
      location: "Alberta",
      tests: +row.daily_tests_Alberta,
      cases: +row.daily_cases_Alberta
    }
    var rowManitoba = {
      date: new Date(row.date),
      location: "Manitoba",
      tests: +row.daily_tests_Manitoba,
      cases: +row.daily_cases_Manitoba
    }
    data.push(rowOttawa,rowQuebec,rowBC,rowAlberta,rowManitoba);
  })
  render(data);
}

function render(data) {

  // group the data: I want to draw one line per group
  var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.location;})
    .entries(data);

  const graph1 = svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`);

  var xAxisLabel1 = "";
  var yAxisLabel1 = "Cases"
  // Add X axis --> it is a date format
  var x1 = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([ 0, innerWidth ]);
  graph1.append("g")
    .attr("transform", "translate(0," + (innerHeight / 2 - 15) + ")")
    .call(d3.axisBottom(x1).ticks(10).tickFormat(d3.timeFormat("%b %d")));
  graph1.append('text')
    .text(xAxisLabel1)
    .attr('class', 'axis-label')
    .attr('y', innerHeight/2 + 50)
    .attr('x', innerWidth / 2 - 30 );

  // Add Y axis
  var y1 = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.cases; })])
    .range([ innerHeight / 2 - 15, 0 ]);
  graph1.append("g")
    .call(d3.axisLeft(y1).ticks(3).tickFormat(d3.format(".1s")));
  graph1.append('text')
    .text(yAxisLabel1)
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('y', '-50')
    .attr('x', -innerHeight / 4 + 15);
  // color palette
  var res = sumstat.map(function(d){ return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(colours)

  // Draw the line
  graph1.selectAll(".line")
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
            .x(function(d) { return x1(d.date); })
            .y(function(d) { return y1(d.cases); })
          (d.values)
        })

  const graph2 = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${innerHeight / 2 + 15})`);

  var xAxisLabel2 = "Date [2020]";
  var yAxisLabel2 = "Tests"
  // Add X axis --> it is a date format
  var x2 = d3.scaleTime()
    .domain(d3.extent(data, function(d) { return d.date; }))
    .range([ 0, innerWidth ]);
  graph2.append("g")
    .attr("transform", "translate(0,0)")
    .call(d3.axisBottom(x2).ticks(0).tickFormat(d3.timeFormat("%b %d")));
  graph2.append('text')
    .text(xAxisLabel2)
    .attr('class', 'axis-label')
    .attr('y', innerHeight/2+10)
    .attr('x', innerWidth / 2 - 30 );

  // Add Y axis
  var y2 = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.tests; })])
    .range([ 0, innerHeight / 2 - 15]);
  graph2.append("g")
    .call(d3.axisLeft(y2).ticks(3).tickFormat(d3.format(".1s")));
  graph2.append('text')
    .text(yAxisLabel2)
    .attr('class', 'axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('y', '-50')
    .attr('x', -innerHeight / 4 + 15);
  // color palette
  var res = sumstat.map(function(d){ return d.key }) // list of group names
  var color = d3.scaleOrdinal()
    .domain(res)
    .range(colours)

  // Draw the line
  graph2.selectAll(".line")
      .data(sumstat)
      .enter()
      .append("path")
        .attr("fill", "none")
        .classed("line", "true")
        .attr("stroke", function(d){ return color(d.key) })
        .attr("stroke-width", 2.5)
        .attr('d', function(d) {
          return d3.line()
            .defined(function(d) { return d.tests != 0; })
            .x(function(d) { return x2(d.date); })
            .y(function(d) { return y2(d.tests); })
          (d.values)
        })

}
