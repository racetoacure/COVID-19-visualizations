const svgHeight = 500;
const svgWidth = 700;

const svg = d3.select('.visSVG');

var nameEdgeLeft = 250; // if names are on left axis
var nameEdgeBottom = 70; // if names are on bottom axis
var numberEdge = 50;

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

// import the data -> upload the data spreadsheet to github gist
d3.csv("Thomas_Cwintal.csv").then(
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
            BedsThou: +row.btp,
            DeathsThou: +row.dtp,
        }
        rowNumber = rowNumber+1;
    })
    render(data);
}

const render = function(data) {
    graph = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + 15 + ")");

    var subgroups = ["BedsThou", "DeathsThou"];
    var groups = ["AB", "BC", "MB", "NB", "NL", "NS", "NWT", "ON", "PEI", "SK", "YT"]

    var names = [
        ["AB", "Alberta"],
        ["BC", "British Columbia"],
        ["MB", "Manitoba"],
        ["NB", "New Brunswick"],
        ["NL", "Newfoundland and Labrador"],
        ["NS", "Nova Scotia"],
        ["NWT", "Northwest Territories"],
        ["ON", "Ontario"],
        ["PEI", "Prince Edward Island"],
        ["SK", "Saskatchewan"],
        ["YT", "Yukon Territories"]
    ]
    console.log(names);

    // Y AXIS

    const yAxisLabel = "Value"

    const yScale = d3.scaleLinear()
        .domain([0, 2.6])
        .range([ innerHeight, 0 ]);

    graph.append('g')
        .call(d3.axisLeft(yScale))
        .append('text')
            .text(yAxisLabel)
            .attr('class', 'axis-label')
            .attr('transform', 'rotate(-90)')
            .attr('y', '-40')
            .attr('x', -innerHeight / 2 + 15)


    // X AXIS

    const xAxisLabel = "Provinces";

    const xScale = d3.scaleBand()
        .domain(groups)
        .range([0, innerWidth])
        .padding([0.2])
    graph.append("g")
        .attr("transform", "translate(0," + innerHeight + ")")
        .call(d3.axisBottom(xScale))
        .append('text')
            .text(xAxisLabel)
            .attr('class', 'axis-label')
            .attr('y', 50)
            .attr('x', innerWidth/2);



    // SUBGROUP SCALE

    var xSubgroup = d3.scaleBand()
        .domain(subgroups)
        .range([0, xScale.bandwidth()])
        .padding([0.05]);

    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(colours.slice(2));


    // TOOLTIP & HOVER FEATURE

    var tooltip = d3.select(".vis")
        .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")

    var mouseover = function(d) {
        console.log(d);
        var selectedLocation = "";
        var type = d.target.__data__.key;
        var fullType = "";
        var number = d.target.__data__.value;

        const check = function (d) {
            console.log("hellllo")
            data.forEach(function (location) {
                console.log(location)
                if (type === "BedsThou") {
                    if (number === location.BedsThou) {
                        selectedLocation = location.Province;
                        fullType = "Beds per Thousand Population"
                    }
                } else if (type === "DeathsThou") {
                    if (number === location.DeathsThou) {
                        selectedLocation = location.Province;
                        fullType = "Deaths per Thousand Population"
                    }
                };
            })

            for (var i = 0; i < 11; i++) {
                console.log(names);
                console.log(selectedLocation);
                if (names[i][0] == selectedLocation) {
                    selectedLocation = names[i][1];
                }
            }
        }
        check(d);

        tooltip
            .html("Location: " + selectedLocation +
                "<br>" + "Type: " + fullType +
                "<br>" + "Value: ~" + d3.format(".3")(d.target.__data__.value))
            .style("opacity", 1);
        d3.selectAll('.myRect').style("opacity", 0.4);

        d3.selectAll('.'+d.target.__data__.key).style("opacity", 1);
    }

    var mousemove = function(d) {
        tooltip
            .style("left", (d.clientX+ 10) + "px")
            .style("top", (d.clientY - 100) + "px")
    }

    var mouseleave = function(d) {
        tooltip.style("opacity", 0)

        d3.selectAll('.myRect').style("opacity", 1);
    }


    // LINES

    function lines() {
        lineGroup = graph.append('g')
            .attr('class', 'separateLine')
        var spacing = 5;
        for (var i = 0; i < 11; i++) {
            spacing = spacing + (innerWidth/11 - 10/11)
            if (i == 10) {
                spacing = innerWidth;
            }
            lineGroup.append('line')
                .attr('y1', 0.5)
                .attr('y2', innerHeight)
                .attr('x1', spacing)
                .attr('x2', spacing)
        }
        lineGroup.append('line')
            .attr('y1', 0.5)
            .attr('y2', 0.5)
            .attr('x1', 0)
            .attr('x2', innerWidth+0.5)
    }
    lines();



    // BARS

    graph.append("g")
        .selectAll("g")
        .data(data).enter().append("g")
            .attr("transform", function(d) { return "translate(" + xScale(d.Province) + ",0)"; })
        .selectAll("rect")
            .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
            .enter().append("rect")
                .attr('class', function(d) {return 'myRect '+d.key})
                .attr("x", function(d) { return xSubgroup(d.key); })
                .attr("y", function(d) { return yScale(d.value); })
                .attr("width", xSubgroup.bandwidth())
                .attr("height", function(d) { return innerHeight - yScale(d.value); })
                .attr("fill", function(d) { return color(d.key); })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);



}
