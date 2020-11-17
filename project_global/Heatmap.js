class Heatmap {

    // only runs one time for each instance

    // HEATMAP 

    constructor(state, setGlobalState) {
        this.width_h = 780,
            this.height_h = 130,
            this.margin_h = { top: 60, bottom: 90, left: 110, right: 40 }

        this.myGroups = [...new Set(state.heatmap.map(d => d.week))]
        this.myVars = [...new Set(state.heatmap.map(d => d.level))]

        console.log("myGroups", this.myGroups)
        console.log("myVars", this.myVars)

        this.formatTime = d3.format(",")
        this.formatPercentage = d3.format(".0%")

        this.xScale_h = d3.scaleBand()
            .domain(this.myGroups)
            .range([this.margin_h.left, this.width_h - this.margin_h.right])
            .padding(0.02);

        this.yScale_h = d3.scaleBand()
            .domain(this.myVars)
            .range([this.height_h, 0])
            .padding(0.02);
        console.log("heatdomain", this.yScale_h.domain())

        this.xAxis_h = d3.axisBottom(this.xScale_h).tickFormat("");


        this.yAxis_h = d3.axisLeft(this.yScale_h);

        this.svg_h = d3.select("#heatmap-container")
            .append("svg")
            .attr("viewBox", "0 0 800 220")
            .attr("transform", "translate(0,0)")
            .append("g")

        this.svg_h
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", "translate(0," + this.height_h + ")")
            .call(this.xAxis_h)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "23.5%")
            .text("May")
            .attr("font-size", "14")
            .attr("fill", "black")
            .attr("dy", "2em")

        this.svg_h
            .append("g")
            .attr("class", "axis x-axis2")
            .attr("transform", "translate(0," + this.height_h + ")")
            .call(this.xAxis_h)
            .append("text")
            .attr("class", "axis-label2")
            .attr("x", "43%")
            .text("June")
            .attr("font-size", "14")
            .attr("fill", "black")
            .attr("dy", "2em")
        this.svg_h
            .append("g")
            .attr("class", "axis x-axis3")
            .attr("transform", "translate(0," + this.height_h + ")")
            .call(this.xAxis_h)
            .append("text")
            .attr("class", "axis-label3")
            .attr("x", "58%")
            .text("July")
            .attr("font-size", "14")
            .attr("fill", "black")
            .attr("dy", "2em")
        this.svg_h
            .append("g")
            .attr("class", "axis x-axis4")
            .attr("transform", "translate(0," + this.height_h + ")")
            .call(this.xAxis_h)
            .append("text")
            .attr("class", "axis-label4")
            .attr("x", "72%")
            .text("August")
            .attr("font-size", "14")
            .attr("fill", "black")
            .attr("dy", "2em")
        this.svg_h
            .append("g")
            .attr("class", "axis x-axis5")
            .attr("transform", "translate(0," + this.height_h + ")")
            .call(this.xAxis_h)
            .append("text")
            .attr("class", "axis-label5")
            .attr("x", "80%")
            .text("September")
            .attr("font-size", "14")
            .attr("fill", "black")
            .attr("dy", "2em")
        this.svg_h
            .append("g")
            .attr("class", "axis x-axis5")
            .attr("transform", "translate(0," + this.height_h + ")")
            .call(this.xAxis_h)
            .append("text")
            .attr("class", "axis-label5")
            .attr("x", "88%")
            .text("October")
            .attr("font-size", "14")
            .attr("fill", "black")
            .attr("dy", "2em")

        this.svg_h
            .append("g")
            .attr("class", "axis y-axis")
            .call(this.yAxis_h)
            .attr("transform", `translate(${this.margin_h.left},0)`)
            .append("text")
            .attr("class", "axis-label")
            .attr("y", "50%") //in the middle of line
            .attr("dx", "-5em")
            .attr("writing-mode", "vertical-rl")
            .text("Confidence")
            .attr("font-size", "14")
            .attr("fill", "black")

        // color scale
        this.colors =
            ["#c4dde1",
                "#a4bdc1",
                "#8ca5a8",
                "#5b7377",
                "#455d61",
                "#3d5558",
                "#122a2d"]

        this.myColor = d3.scaleQuantile()
            // .interpolator(d3.interpolateBrBG(8))

            .range(this.colors)
            //GREEN//.range(["#E8F8F5", "#0E6251"])
            //.range(["#C8E1E5", "#0e2629"])
            //.domain(d3.extent(data, d => +d.count.split(",").join("")))
            .domain(d3.extent(state.heatmap, d => d.count));

        console.log("color", this.myColor.domain())


        this.svg_h
            .selectAll()
            .data(state.heatmap, function (d) { return d.level + ':' + d.week; })
            .enter()
            .append("rect")
            .attr("class", "rect")
            .attr("x", d => this.xScale_h(d.week))
            .attr("y", d => this.yScale_h(d.level))
            .attr("width", this.xScale_h.bandwidth())
            .attr("height", this.yScale_h.bandwidth())
            .style("fill", d => this.myColor(d.count))
            .on('mouseover', (event, d) => {
                //console.log("d for tooltips", d)
                this.div
                    .transition()
                    .duration(50)
                    .style('opacity', 1);
                this.div
                    .html(//formatTime = d3.format(",") //if value interpreted by number
                        "<strong>" + this.formatTime(d.count) + "</strong>" + '<br>' + " Americans " + '<br>'
                        + "had " + "<strong>" + d.level + "</strong>" + " confidence in paying rent next month by the week of " + '<br>'
                        + "<strong>" + d.week + "</strong>"
                    )
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on('mouseout', () => {
                this.div
                    .transition()//
                    .duration(100)
                    .style('opacity', 0);
            })


        this.div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        this.keys = ["7M", "12M", "14M", "16M", "20M", '26M', '30M']
        this.legendColor = d3.scaleOrdinal().domain(["7M", "12M", "14M", "16M", "20M", '26M', '30M']).range(["#c4dde1",
            "#a4bdc1",
            "#8ca5a8",
            "#5b7377",
            "#455d61",
            "#3d5558",
            "#122a2d"])
        this.svg_h.selectAll("myrect")
            .data(this.keys)
            .enter()
            .append("rect")
            .attr("width", 40)
            .attr("height", 10)
            .attr("y", 180)
            .attr("x", function (d, i) { return 460 + i * 40 })
            .style("fill", d => this.legendColor(d))

        this.svg_h.selectAll("mylabels")
            .data(this.keys)
            .enter()
            .append("text")
            .style("font-size", 12)
            .attr("y", 200)
            .attr("x", function (d, i) { return 470 + i * 40 })
            .style("fill", "black")
            .text(d => d)
            .style("text-anchor", "center")
            .style("alignment-baseline", "middle")

        // CALENDAR https://benclinkinbeard.com/d3tips/building-a-calendar-with-d3/?utm_content=bufferc1664&utm_medium=social&utm_source=twitter.com&utm_campaign=buffer

    }

    draw(state, setGlobalState) {

    }
}
export { Heatmap };