var legend = d3.select("#legend2");

// create a list of keys
var keys = ["Total"];
//replace this with your keys

var color = d3.scaleOrdinal()
  .domain(keys)
  .range(["#f6b737"]);

var offset = i => 140+i*30;
//Add one dot in the legend for each name.
legend.selectAll("circle")
  .data(keys)
  .enter()
  .append("circle")
    .attr("cx", 10)
    .attr("cy", function(d,i){ return offset(i)}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function(d){ return color(d)})

// Add names
legend.selectAll("legend")
  .data(keys)
  .enter()
  .append("text")
    .attr("x", 30)
    .attr("class", "legend")
    .attr("y", function(d,i){ return offset(i)})
    .style("fill", function(d){ return color(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
