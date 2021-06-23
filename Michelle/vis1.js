const svgHeight = 465;
const svgWidth = 700;

const svg = d3.select('.vis1SVG');

var nameEdgeLeft = 100; // if names are on left axis
var nameEdgeBottom = 50; // CHANGED FOR THIS VIS BECAUSE SPACING
var numberEdge = 65; // CHANGED FOR THIS VIZ BECAUSE NUMBERS BIG

var margin = {
    top: 0, // top margin
    right: -40, // right margin
    left: numberEdge,
    bottom: nameEdgeBottom
}

var innerHeight = svgHeight - margin.top - margin.bottom;
var innerWidth = svgWidth - margin.right - margin.left;

// append the svg object to the body of the page
svg
    .attr("width", svgWidth + 150)
    .attr("height", svgHeight);

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

        var yAxisLabel1 = "AB"
        // Add X axis --> it is a date format
        var x1 = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, innerWidth - 5 ]);
        graph1.append("g")
            .attr("transform", "translate(0," + (innerHeight / 2 - 15) + ")");

        // Add Y axis
        var y1 = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.cases; })])
            .range([ innerHeight / 2 - 15, 0 ]);
        graph1.append("g")
            .call(d3.axisLeft(y1).ticks(4).tickFormat(d3.format(".1s")));
        graph1.append('text')
            .text(yAxisLabel1)
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', '-45')
            .attr('x', -innerHeight / 2 + 120);

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
            var focus = graph1.append("g")
                .attr("class", "focus")
                .style("opacity", 0);

            focus.append("circle")
                .attr("r", 5);

            focus.append("rect")
                .attr("class", "tooltip")
                .attr("width", 120)
                .attr("height", 50)
                .attr("x", 10)
                .attr("y", -2)
                .attr("rx", 4)
                .attr("ry", 4);

            focus.append("text")
                .attr("class", "tooltip-date")
                .attr("x", 18)
                .attr("y", 18);

            focus.append("text")
                .attr("x", 18)
                .attr("y", 38);

            focus.append("text")
                .attr("class", "tooltip-cases")
                .attr("x", 18)
                .attr("y", 38);

            graph1.append("rect")
                .attr("class", "overlay")
                .attr("width", innerWidth)
                .attr("height", innerHeight)
                .on("mouseover", function() { focus.style("opacity", 1); })
                .on("mouseout", function() { focus.style("opacity", 0); })
                .on("mousemove", mousemove);

            function mousemove() {
              var dateFormatter = d3.timeFormat('%b %d')
              var bisectDate = d3.bisector(function(d) { return d.date; }).left;
                var x0 = x1.invert(d3.pointer(event)[0]),//xScale.invert(d3.mouse(this)[0]), //<-- give me the date at the x mouse position
                closestElement = bisectDate(data, x0, 1), //<-- use the bisector to search the array for the closest point to the left and find that point given our mouse position
                d0 = data[closestElement - 1],
                d1 = data[closestElement],
                d = x0 - d0.date > d1.date - x0 ? d1 : d0;

                focus.attr("transform", "translate(" + x1(d.date) + "," + y1(d.cases) + ")");
                focus.select(".tooltip-date").text("Date: " + dateFormatter(d.date));
                focus.select(".tooltip-cases").text("Alberta Cases: " + d.cases);
            }
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
            .attr('transform', `translate(${margin.left}, ${innerHeight / 2 - 10})`);

        var xAxisLabel2 = "Date [2020]";
        var yAxisLabel2 = "Total"
        // Add X axis --> it is a date format
        var x2 = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date; }))
            .range([ 0, innerWidth - 5]);

        graph2.append("g")
            .attr("transform", "translate(0," + (innerHeight / 2 - 15) + ")")
            .call(d3.axisBottom(x2).ticks(8).tickFormat(d3.timeFormat("%b %d")));

        graph2.append('text')
            .text(xAxisLabel2)
            .attr('dominant-baseline', 'bottom')
            .attr('class', 'axis-label')
            .attr('y', innerHeight/ 2 + 40)
            .attr('x', innerWidth / 2);

        // Add Y axis
        var y2 = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.cases; })])
            .range([ innerHeight / 2 - 15, 0 ]);

        graph2.append("g")
            .call(d3.axisLeft(y2).ticks(4).tickFormat(d3.format(".1s")));

        graph2.append('text')
            .text(yAxisLabel2)
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', '-45')
            .attr('x', -innerHeight / 2 + 120);

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

        //TOOLTIP
        var focus = graph2.append("g")
            .attr("class", "focus")
            .style("opacity", 0);

        focus.append("circle")
            .attr("r", 5);

        focus.append("rect")
            .attr("class", "tooltip")
            .attr("width", 120)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -2)
            .attr("rx", 4)
            .attr("ry", 4);

        focus.append("text")
            .attr("class", "tooltip-date")
            .attr("x", 18)
            .attr("y", 18);

        focus.append("text")
            .attr("x", 18)
            .attr("y", 38);

        focus.append("text")
            .attr("class", "tooltip-cases")
            .attr("x", 18)
            .attr("y", 38);

        graph2.append("rect")
            .attr("class", "overlay")
            .attr("width", innerWidth)
            .attr("height", innerHeight)
            .on("mouseover", function() { focus.style("opacity", 1); })
            .on("mouseout", function() { focus.style("opacity", 0); })
            .on("mousemove", mousemove);

        function mousemove() {
          var dateFormatter = d3.timeFormat('%b %d')
          var bisectDate = d3.bisector(function(d) { return d.date; }).left;
            var x0 = x2.invert(d3.pointer(event)[0]),//xScale.invert(d3.mouse(this)[0]), //<-- give me the date at the x mouse position
            closestElement = bisectDate(data, x0, 1), //<-- use the bisector to search the array for the closest point to the left and find that point given our mouse position
            d0 = data[closestElement - 1],
            d1 = data[closestElement],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

            focus.attr("transform", "translate(" + x2(d.date) + "," + y2(d.cases) + ")");
            focus.select(".tooltip-date").text("Date: " + dateFormatter(d.date));
            focus.select(".tooltip-cases").text("Total Cases: " + d.cases);
        }

        });
