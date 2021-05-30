var legend = d3.select(".legendSVG");

// create a list of keys
var keys = ["Beds per Thousand", "Population","COVID Deaths per","Thousand Population"];
//replace this with your keys

var color = d3.scaleOrdinal()
    .domain(keys)
    .range([colours[2],colours[2],colours[3],colours[3]]);

var offset = 200;

var offset1 = i => offset + i*60;
var offset2 = i => offset + i*30;
//Add one dot in the legend for each name.
legend.selectAll("circle")
    .data([keys[0],keys[2]])
    .enter()
    .append("circle")
        .attr("cx", 10)
        .attr("cy", function(d,i){ return offset1(i)}) // 10 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return color(d)})

// Add names
legend.selectAll("legend")
    .data(keys)
    .enter()
    .append("text")
        .attr("x", 30)
        .attr("class", "legend")
        .attr("y", function(d,i){ return offset2(i)})
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
