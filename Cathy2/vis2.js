(function () {
    const svgHeight = 350;
    const svgWidth = 700;

    const svg = d3.select('#vis2')
        .attr('height', svgHeight);

    var nameEdgeLeft = 175;
    var numberEdge = 70;

    var margin = {
        top: 0, // top margin
        right: 15, // right margin
        left: nameEdgeLeft, // left margin
        bottom: numberEdge // bottom margin
    }

    var innerHeight = svgHeight - margin.top - margin.bottom;
    var innerWidth = svgWidth - margin.right - margin.left;

    // import the data -> upload the data spreadsheet to github gist
    d3.csv("Cathy_Jian2.csv").then(
        function(beforeData) {
            convert(beforeData);
        }
    );

    function convert(beforeData) {
        var data = [];
        var rowNumber = 0;
        beforeData.forEach(function (row) {
            data[rowNumber] = {
                Province: row.province,
                Recovered: +row.recovered,
                Active: +row.active,
                Confirmed: +row.confirmed,
                Total: +row.total
            }
            rowNumber = rowNumber+1;
        })
        console.log(data);
        render1(data); // top graph with recovered, active, confirmed
        render2(data); // bottom graph with total
    }

    const render1 = function(data) {

        // shifts the entire INNER visualization over
        const graph = svg.append('g')
            .attr('transform', `translate(${margin.left}, 0)`);

        var subgroups = ["Total"];
        console.log(subgroups);

        var groups = ["Alberta", "Saskatchewan", "British Columbia"];
        console.log(groups);

        var xScale = d3.scaleLinear()
            .domain([0, 2550000])
            .range([0, innerWidth]);

        var xAxis = d3.axisBottom(xScale)
            .tickFormat(
                function(d) {
                    return(d/1000000 + "M")
                }
            );

        var callxAxis = graph.append('g')
            .call(xAxis)
            .attr('class', 'graphTicks')
            .attr('transform', `translate(0, ${innerHeight})`);
        callxAxis.append('text')
            .attr('class', 'axis-label')
            .attr('dominant-baseline', 'bottom')
            .attr('x', (innerWidth / 2))
            .attr('y', 55)
            .text('Total Tests Completed [2020]');

        var yScale = d3.scaleBand()
            .domain(groups)
            .range([0, innerHeight])
            .padding(0.2);

        var yAxis = d3.axisLeft(yScale);

        var callyAxis = graph.append('g')
            .call(yAxis)
            .attr('class', 'graphTicks');
        callyAxis.append('text')
            .attr('class', 'axis-label')
            .attr('dominant-baseline', 'top')
            .attr('transform', `rotate(-90)`)
            .attr('y', -(margin.left / 2) - 50)
            .attr('x', -(innerHeight / 2))
            .text('Provinces');

        var color = d3.scaleOrdinal()
            .domain(subgroups)
            .range(["#f6b737"]);

        var stackedData = d3.stack()
            .keys(subgroups)
            (data);

        var tooltip = d3.select(".vis")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")

        // Three function that change the tooltip when user hover / move / leave a cell
        var mouseover = function(d) {
            var subgroupName = d3.select(this.parentNode).datum().key;

            var subgroupValue = d.target.__data__[1] - d.target.__data__[0];
            tooltip
                .html("Category: " + subgroupName + "<br>" + "Cases: " + subgroupValue)
                .style("opacity", 1)
        }

        var mousemove = function(d) {
            tooltip
            .style("left", (d.clientX+ 10) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (d.clientY - 60) + "px")
        }

        var mouseleave = function(d) {
            tooltip
                .style("opacity", 0)
        }

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
                    .attr("y", function(d) { return yScale(d.data.Province);})
                    .attr("x", function(d) { return xScale(d[0]); })
                    .attr("width", function(d) { return xScale(d[1]) - xScale(d[0]); })
                    .attr("height", yScale.bandwidth())
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)
    }
} (d3));
