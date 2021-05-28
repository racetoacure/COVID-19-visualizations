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

//Read the data
d3.csv("Thomas_Cwintal.csv").then(function(data) {

  graph = svg.append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + 15 + ")");

  // List of subgroups = header of the csv files = soil condition here
  console.log(data)
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.Province_Territory)}).keys()

  yAxisLabel = "Value";
  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, innerWidth])
      .padding([0.2])
  graph.append("g")
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(d3.axisBottom(x).tickSize(0));

    var y = d3.scaleLinear()
      .domain([0, 2.6])
      .range([ innerHeight, 0 ]);
    graph.append("g")
      .call(d3.axisLeft(y));
    graph.append('text')
      .text(yAxisLabel)
      .attr('fill', 'black')
      .attr('class', 'axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('y', '-40')
      .attr('x', -innerHeight / 2 + 15)
      .style('text-anchor', 'middle');

    // Another scale for subgroup position?
    var xSubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05])

    // color palette = one color per subgroup
    var color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(colours.slice(2))

      graph.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.Province_Territory) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return innerHeight - y(d.value); })
      .attr("fill", function(d) { return color(d.key); });

})
