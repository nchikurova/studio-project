

/**
 * LOAD DATA
 * */
d3.csv("../data/weekly_totals_old_new.csv",
    d => ({
        count: +d.count.split(",").join(""),
        week: +d.week,
        level: d.level,
    })
).then(data => {

    console.log("data", data)
    let width_line = 360;
    let height_line = 300;
    let margin_line = { top: 20, left: 60, bottom: 60, top: 20 }

    grouppedData = d3.nest()
        .key(d => d.level).entries(data)
    //grouppedData = d3.groups(data, d => d.level)
    console.log("grdata", grouppedData)

    // SCALES
    xScale_line = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.week))
        //.range([margin_line.left, width_line - margin_line.right]);
        .range([margin_line.left, width_line])
    console.log("xdomain", xScale_line.domain())
    console.log("xrange", xScale_line.range())

    yScale_line = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.count))
        .range([height_line - margin_line.bottom, margin_line.top]);

    console.log("domain", yScale_line.domain())
    // AXES
    const xAxis_line = d3.axisBottom(xScale_line);

    const yAxis_line = d3.axisLeft(yScale_line);

    var allKeys = grouppedData.map(d => d.key) // list of group names
    var color = d3.scaleOrdinal()
        .domain(allKeys)

        .range(["#c4dde1",
            "#a4bdc1",
            "#8ca5a8",
            "#5b7377",
            "#455d61",
            "#3d5558",
            "#122a2d"])

    svg_line = d3
        .select("#linechart-container")
        .append("svg")
        .attr("viewBox", "0 0 400 300")
        .append("g")
        .attr("transform", "translate(0,0)")
    // .attr("width", width_line)
    // .attr("height", height_line);

    // add the xAxis
    svg_line
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height_line - margin_line.bottom})`)
        .call(xAxis_line)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", "50%")
        .attr("dy", "3em")
        .text("Week");

    div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    // add the yAxis
    svg_line
        .append("g")
        .attr("class", "axis y-axis")
        .attr("transform", `translate(${margin_line.left},0)`)
        .call(yAxis_line)
        .append("text")
        .attr("class", "axis-label")
        .attr("y", "50%")
        .attr("dx", "-3em")
        .attr("writing-mode", "vertical-rl")
        .text("Count");

    const line = d3.line()
        .x(d => xScale_line(d.week))
        .y(d => yScale_line(d.count));

    svg_line
        .selectAll(".line")
        .data(grouppedData)
        // .enter()
        // .append("g")
        .join("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", d => color(d.key))
        .attr("stroke-width", 3)
        .attr("d", d => line(d.values))
        .append("text")
        .attr("class", "label")
        .data("text", d => d.key)
        .on('mouseover', (event, d) => {
            console.log("d for tooltips", d)
            this.div
                .transition()
                .duration(50)
                .style('opacity', 1);
            this.div
                .html("<strong>" + d + " " + "</strong>" + "<br>"
                    + " of Americans who participated in survey had this level of confidence in paying rent next month in " +
                    "<strong>" + d + "</strong>"
                )
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");

            //add d.state to tooltip -> move to the corner?
        })
        .on('mouseout', () => {
            this.div
                .transition()//
                .duration(100)
                .style('opacity', 0);

        })
})