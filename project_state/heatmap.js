d3.csv("../data/totalw.csv", d => ({
    ...d,
    count: +d.count.split(",").join(""),
    category: d.category,
    //week: +d.week,
})).then(data => {

    console.log("heat", data);
    let margin_h = { top: 40, right: 0, bottom: 40, left: 50 };
    // width_h = 440 - margin_h.left - margin_h.right;
    // height_h = 380 - margin_h.bottom - margin_h.top;
    let width_h = 440;
    let height_h = 200;

    const myGroups = [...new Set(data.map(d => d.week))]
    const myVars = [...new Set(data.map(d => d.category))]

    console.log("myGroups", myGroups)
    console.log("myVars", myVars)

    const xScale_h = d3.scaleBand()
        .domain(myGroups)
        .range([margin_h.left, width_h - margin_h.right])
        .padding(0.02);

    const yScale_h = d3.scaleBand()
        .domain(myVars)
        .range([height_h, 0])
        .padding(0.02);
    console.log("heatdomain", yScale_h.domain())

    const xAxis_h = d3.axisBottom(xScale_h);

    const yAxis_h = d3.axisLeft(yScale_h);

    svg_h = d3.select("#heatmap-container")
        .append("svg")
        .attr("viewBox", "0 0 400 300")
        .attr("transform", "translate(0,0)")
        // .attr("width", width_h + margin_h.left + margin_h.right)
        // .attr("height", height + margin_h.bottom + margin_h.top)
        .append("g")
    //.attr("transform",
    //"translate(" + margin_h.left + "," + margin_h.top + ")");
    svg_h
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height_h + ")")
        .call(xAxis_h)
        .append("text")
        .attr("class", "axis-label")
        .attr("x", "50%")
        .attr("dy", "3em")
        .text("Weeks")
        .attr("font-size", "12")
        .attr("fill", "black")

    svg_h
        .append("g")
        .attr("class", "axis y-axis")
        .call(yAxis_h)
        .attr("transform", `translate(${margin_h.left},0)`)
        .append("text")
        .attr("class", "axis-label")
        .attr("y", "50%") //in the middle of line
        .attr("dx", "-3em")
        .attr("writing-mode", "vertical-rl")
        // .text("Confidence level")
        .attr("font-size", "12")
        .attr("fill", "black")

    // color scale
    const colors =
        // ["#82C0CC",
        //     , "#458A93"
        //     , "#16697A"
        //     , "#1C474D"
        //     , "#23679A"
        // , "#0e2629"]
        ["#c4dde1",
            "#a4bdc1",
            "#8ca5a8",
            "#5b7377",
            "#455d61",
            "#3d5558",
            "#122a2d"]

    const myColor = d3.scaleQuantile()
        // .interpolator(d3.interpolateBrBG(8))

        .range(colors)
        //GREEN//.range(["#E8F8F5", "#0E6251"])
        //.range(["#C8E1E5", "#0e2629"])
        //.domain(d3.extent(data, d => +d.count.split(",").join("")))
        .domain(d3.extent(data, d => d.count));
    console.log("color", myColor.domain())

    svg_h
        .selectAll()
        .data(data, function (d) { return d.week + ':' + d.category; })
        .enter()
        .append("rect")
        .attr("x", d => xScale_h(d.week))
        .attr("y", d => yScale_h(d.category))
        .attr("width", xScale_h.bandwidth())
        .attr("height", yScale_h.bandwidth())
        .style("fill", d => myColor(d.count))

})
