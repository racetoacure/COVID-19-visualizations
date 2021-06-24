const svgHeight2 = 420;
const svgWidth2 = 700;

const svg2 = d3.select('.vis2SVG');

var nameEdgeLeft1 = 120; // if names are on left axis
var nameEdgeBottom = 70; // if names are on bottom axis
var numberEdge1 = 100;

var margin1 = {
    top: 0, // top margin
    right: 15, // right margin
    left: nameEdgeLeft1,
    bottom: numberEdge1
}

var innerHeight2 = svgHeight2 - margin1.top - margin1.bottom;
var innerWidth2 = svgWidth2 - margin1.right - margin1.left;

// append the svg object to the body of the page
svg2
    .attr("width", svgWidth2)
    .attr("height", svgHeight2)

// import the data
d3.csv("Michelle_Lam3.csv").then(
    function(beforeData) {
        convert(beforeData);
    }
);

function convert(beforeData) {
    var data = [];
    var rowNumber = 0;
    beforeData.forEach(function (row) {
        data[rowNumber] = {
            Type: row.type,
            TypeNoSpace: row.typenospace,
            NorthernAlberta: +row.northAB,
            Edmonton: +row.edmonton,
            Calgary: +row.calgary,
            CentralAlberta: +row.centreAB,
            SouthernAlberta: +row.southernAB,
            Total: +row.total
        }
        rowNumber++;
    })
    render(data);
}

const render = function(data) {

        graph = svg2.append("g");
        graph.attr("transform", "translate(" + margin1.left + "," + margin1.top + 15+ ")");
        var colorIndex = 0;
        const spaceFromXAxis = 40; // for the specific locations


        // LINES FOR BETWEEN THE LOCATIONS

        function lines() {
            var spacing = 0;
            for (var i = 0; i !==7; i++ ) {
                graph.append('line')
                    .attr('class', 'separateLine')
                    .attr('y1', 0)
                    .attr('y2', innerHeight2)
                    .attr('x1', spacing+0.5)
                    .attr('x2', spacing+0.5);
                spacing = spacing+(innerWidth2/6);
            }
            graph.append('line')
                .attr('class', 'separateLine')
                .attr('y1', 0.5)
                .attr('y2', 0.5)
                .attr('x1', 0)
                .attr('x2', innerWidth2+1);
        }
        lines();


        // TOOLTIP & HOVER FEATURE

        var tooltip = d3.select(".vis")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")

        var mouseover = function(d) {
            tooltip
                .html("Acute Care Service: " + d.target.__data__.Type +
                        "<br>" + "North: " + d.target.__data__.NorthernAlberta +
                        "<br>" + "Edmonton: " + d.target.__data__.Edmonton +
                        "<br>" + "Calgary: " + d.target.__data__.Calgary +
                        "<br>" + "Central: " + d.target.__data__.CentralAlberta +
                        "<br>" + "South: " + d.target.__data__.SouthernAlberta +
                        "<br>" + "Total: " + d.target.__data__.Total)
                .style("opacity", 1);
            d3.selectAll('.myRect').style("opacity", 0.4);

            d3.selectAll('.'+d.target.__data__.TypeNoSpace).style("opacity", 1);
        }

        var mousemove = function(d) {
            tooltip
                .style("left", (d.clientX+ 10) + "px")
                .style("top", (d.clientY - 340) + "px")
        }

        var mouseleave = function(d) {
            tooltip.style("opacity", 0)

            d3.selectAll('.myRect').style("opacity", 1);
        }


        // Y AXIS & XAXIS LOCATION LABEL

        const subgroups = ["Hospital Beds", "Hospitals", "ICU Beds", "Ventilators"];

        const yScale = d3.scaleBand()
            .domain(subgroups)
            .range([0, innerHeight2])
            .padding(0.2)

        const callyScale = graph.append('g')
            .call(d3.axisLeft(yScale))
            .attr('class', 'graphTicks')
            .append('text')
                .attr('class', 'axis-label')
                .attr('dominant-baseline', 'top')
                .attr('transform', `rotate(-90)`)
                .attr('y', -(margin1.left / 2) - 40)
                .attr('x', -(innerHeight2 / 2))
                .text('Provinces');

        graph.append('text')
            .attr('class', 'axis-label')
            .attr('dominant-baseline', 'bottom')
            .attr('x', innerWidth2/2)
            .attr('y', innerHeight2+70)
            .text('Location')


        // NORTH XAXIS and BARS

        const northGraph = graph.append("g");

        const northX = d3.scaleLinear()
            .domain([0, 1250])
            .range([0, innerWidth2/6]);

        const callNorthX = northGraph.append('g')
            .call(d3.axisBottom(northX)
                .ticks(2)
                .tickFormat(function(d) { return(d/1000 + "K") }))
            .attr('class', 'graphTicks')
            .attr('transform', `translate(0, ${innerHeight2})`)
            .append('text')
                .attr('dominant-baseline', 'bottom')
                .attr('text-anchor', 'middle')
                .attr('fill', 'black')
                .attr('x', innerWidth2 / 12)
                .attr('y', spaceFromXAxis)
                .text('North');

        const northBars = northGraph.selectAll('rect')
            .data(data).enter().append('rect')
                .attr('class', function(d) {return 'myRect ' + d.TypeNoSpace})
                .attr('y', (function(d) { return yScale(d.Type)}))
                .attr('width', function(d) { return northX(d.NorthernAlberta)})
                .attr('height', yScale.bandwidth())
                .attr('fill', colours[colorIndex])
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        colorIndex++;


        // EDMONTON X AXIS and BARS

        const edmontonGraph = graph.append("g");

        const edmontonX = d3.scaleLinear()
            .domain([0, 3900])
            .range([0, innerWidth2/6]);

        const callEdmontonX = edmontonGraph.append('g')
            .call(d3.axisBottom(edmontonX)
                .ticks(2)
                .tickFormat(function(d) { return(d/1000 + "K") }))
            .attr('class', 'graphTicks')
            .attr('transform', `translate(${innerWidth2/6}, ${innerHeight2})`)
            .append('text')
                .attr('dominant-baseline', 'bottom')
                .attr('text-anchor', 'middle')
                .attr('fill', 'black')
                .attr('x', innerWidth2 / 12)
                .attr('y', spaceFromXAxis)
                .text('Edmonton');

        const edmontonBars = edmontonGraph.selectAll('rect')
            .data(data).enter().append('rect')
                .attr('class', function(d) {return 'myRect ' + d.TypeNoSpace})
                .attr('y', (function(d) { return yScale(d.Type)}))
                .attr('width', function(d) { return edmontonX(d.Edmonton)})
                .attr('height', yScale.bandwidth())
                .attr('fill', colours[colorIndex])
                .attr('transform', `translate(${innerWidth2/6}, 0)`)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        colorIndex++;


        // CALGARY X AXIS and BARS

        const calgaryGraph = graph.append("g");

        const calgaryX = d3.scaleLinear()
            .domain([0, 3000])
            .range([0, innerWidth2/6]);

        const callcalgaryX = calgaryGraph.append('g')
            .call(d3.axisBottom(calgaryX)
                .ticks(2)
                .tickFormat(function(d) { return(d/1000 + "K") }))
            .attr('class', 'graphTicks')
            .attr('transform', `translate(${innerWidth2/3}, ${innerHeight2})`)
            .append('text')
                .attr('dominant-baseline', 'bottom')
                .attr('text-anchor', 'middle')
                .attr('fill', 'black')
                .attr('x', innerWidth2 / 12)
                .attr('y', spaceFromXAxis)
                .text('Calgary');

        const calgaryBars = calgaryGraph.selectAll('rect')
            .data(data).enter().append('rect')
                .attr('class', function(d) {return 'myRect ' + d.TypeNoSpace})
                .attr('y', (function(d) { return yScale(d.Type)}))
                .attr('width', function(d) { return calgaryX(d.Calgary)})
                .attr('height', yScale.bandwidth())
                .attr('fill', colours[colorIndex])
                .attr('transform', `translate(${innerWidth2/3}, 0)`)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        colorIndex++;


        // CENTRE BARS, X AXIS

        const centreGraph = graph.append("g");

        const centreX = d3.scaleLinear()
            .domain([0, 1500])
            .range([0, innerWidth2/6]);

        const callCentreX = centreGraph.append('g')
            .call(d3.axisBottom(centreX)
                .ticks(2)
                .tickFormat(function(d) { return(d/1000 + "K") }))
            .attr('class', 'graphTicks')
            .attr('transform', `translate(${innerWidth2/2}, ${innerHeight2})`)
            .append('text')
                .attr('dominant-baseline', 'bottom')
                .attr('text-anchor', 'middle')
                .attr('fill', 'black')
                .attr('x', innerWidth2 / 12)
                .attr('y', spaceFromXAxis)
                .text('Centre');

        const centreBars = centreGraph.selectAll('rect')
            .data(data).enter().append('rect')
                .attr('class', function(d) {return 'myRect ' + d.TypeNoSpace})
                .attr('y', (function(d) { return yScale(d.Type)}))
                .attr('width', function(d) { return centreX(d.CentralAlberta)})
                .attr('height', yScale.bandwidth())
                .attr('fill', colours[colorIndex])
                .attr('transform', `translate(${innerWidth2/2}, 0)`)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        colorIndex++;


        // SOUTH BARS, X AXIS

        const southGraph = graph.append("g");

        const southX = d3.scaleLinear()
            .domain([0, 800])
            .range([0, innerWidth2/6]);

        const callSouthX = southGraph.append('g')
            .call(d3.axisBottom(southX)
                .ticks(2))
            .attr('class', 'graphTicks')
            .attr('transform', `translate(${2*innerWidth2/3}, ${innerHeight2})`)
            .append('text')
                .attr('dominant-baseline', 'bottom')
                .attr('text-anchor', 'middle')
                .attr('fill', 'black')
                .attr('x', innerWidth2 / 12)
                .attr('y', spaceFromXAxis)
                .text('South');

        const southBars = southGraph.selectAll('rect')
            .data(data).enter().append('rect')
                .attr('class', function(d) {return 'myRect ' + d.TypeNoSpace})
                .attr('y', (function(d) { return yScale(d.Type)}))
                .attr('width', function(d) { return southX(d.SouthernAlberta)})
                .attr('height', yScale.bandwidth())
                .attr('fill', colours[colorIndex])
                .attr('transform', `translate(${2*innerWidth2/3}, 0)`)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

        colorIndex++;


        // TOTAL BARS, X AXIS

        const totalGraph = graph.append("g");

        const totalX = d3.scaleLinear()
            .domain([0, 10000])
            .range([0, innerWidth2/6]);

        const callTotalX = totalGraph.append('g')
            .call(d3.axisBottom(totalX)
                .ticks(2)
                .tickFormat(function(d) { return(d/1000 + "K") }))
            .attr('class', 'graphTicks')
            .attr('transform', `translate(${5*innerWidth2/6}, ${innerHeight2})`)
            .append('text')
                .attr('dominant-baseline', 'bottom')
                .attr('text-anchor', 'middle')
                .attr('fill', 'black')
                .attr('x', innerWidth2 / 12)
                .attr('y', spaceFromXAxis)
                .text('Total');

        const totalBars = totalGraph.selectAll('rect')
            .data(data).enter().append('rect')
                .attr('class', function(d) {return 'myRect ' + d.TypeNoSpace})
                .attr('y', (function(d) { return yScale(d.Type)}))
                .attr('width', function(d) { return totalX(d.Total)})
                .attr('height', yScale.bandwidth())
                .attr('fill', colours[colorIndex])
                .attr('transform', `translate(${5*innerWidth2/6}, 0)`)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave);

};
