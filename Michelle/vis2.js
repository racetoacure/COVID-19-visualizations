const svgHeight2 = 500;
const svgWidth2 = 700;

const svg2 = d3.select('.vis2SVG');

var nameEdgeLeft = 250; // if names are on left axis
var nameEdgeBottom = 70; // if names are on bottom axis
var numberEdge = 70;

var margin = {
    top: 0, // top margin
    right: 15, // right margin
    left: numberEdge,
    bottom: nameEdgeBottom
}

var innerHeight2 = svgHeight2 - margin.top - margin.bottom;
var innerWidth2 = svgWidth2 - margin.right - margin.left;

// append the svg object to the body of the page
svg2
  .attr("width", svgWidth2)
  .attr("height", svgHeight2)

//Read the data
d3.csv("http://127.0.0.1:5500/Michelle/Michelle_Lam3.csv").then(

function(data) {

  graph = svg2.append("g");
  graph.attr("transform",
        "translate(" + margin.left + "," + margin.top + 15+ ")");
  var subgroups = data.columns.slice(1);
  var groups = d3.map(data, function(d){return(d.group)}).keys();

  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, innerWidth2])
      .padding([0.2])
  graph.append("g")
    .attr("transform", "translate(0," + innerHeight + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 10000])
    .range([ innerHeight2, 0 ]);
  graph.append("g")
    .call(d3.axisLeft(y).tickSizeOuter(0));

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(colours.slice(2))

  //stack the data? --> stack per subgroup
  var stackedData = d3.stack()
    .keys(subgroups)
    (data)

    console.log(stackedData)

    graph.append("g")
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { return d; })
        .enter().append("rect")
          .attr("x", function(d) { return x(d.data.group); })
          .attr("y", function(d) { return y(d[1]); })
          .attr("height", function(d) { return y(d[0]) - y(d[1]); })
          .attr("width",x.bandwidth())

});
