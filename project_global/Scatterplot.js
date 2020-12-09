class Scatterplot {

    // only runs one time for each instance
    constructor(state, setGlobalState) {

        //console.log("state data", state.week_1)

        this.width = 460,
            this.height = 280,
            this.margin = { top: 10, bottom: 10, left: 50, right: 0 }
        this.paddingInner = 1.5,
            this.paddingOuter = 0.2,
            this.svg_b = d3
                .select("#scatterplot-container")
                .append("svg")
                .attr("viewBox", "0 0 540 320")
                .attr("transform", "translate(0,0)")
                .append("g")

        //If i want to use transition        
        // this.t = d3.transition()
        //     .duration(750)
        //     .ease(d3.easeLinear);

        this.buttons2 = d3
            .selectAll("#week_s")//("input")
            .on("change",
                function () {
                    // console.log("button changed to", this.value)
                    setGlobalState({
                        selection2: this.value,
                    })
                })

        // Add a scale for bubble size
        this.zScale = d3.scaleSqrt()
            .domain([59, 7500000])
            .range([2, 22]);
        // Add legend for zScale: circles from https://www.d3-graph-gallery.com/graph/bubble_template.html
        this.valuesToShow = [300000, 3000000, 8000000]

        this.svg_b
            .selectAll("legend")
            .data(this.valuesToShow)
            .enter()
            .append("circle")
            .attr("cx", 450)
            .attr("cy", d => this.height - 220 - this.zScale(d))
            .attr("r", d => this.zScale(d))
            .style("fill", "none")
            .attr("stroke", "black")

        // Add legend: labels
        this.svg_b
            .selectAll("legend")
            .data(this.valuesToShow)
            .enter()
            .append("text")
            .attr('x', 450)
            .attr("y", (d, i) => this.height - (235 + i * 19))
            .text(d => d / 1000000)
            .style("font-size", 9)
            .style('alignment-baseline', 'middle')
            .style("text-anchor", "middle")

        // Legend title
        this.svg_b.append("text")
            .attr("font-size", 9)
            .attr('x', 445)
            .attr("y", this.height - 210)
            .text("Number of people (M)")
            .style('alignment-baseline', 'middle')
            .attr("text-anchor", "middle")

        //Add legends for Categories

        // this.keysCat = ["Total", "Age", "Sex", "Race", "Education", "Marital status", "Children", "Loss of employment", "Currently employed", "Income"]
        // this.legendColor = d3.scaleOrdinal()
        //     .domain([this.keysCat])
        //     .range(["#122a2d", "#455d61", "#16697A", "#23679A", "#758dc5", "#6251b2", "#792767", "#520122", "#cb3070", "#2f2461"])

        this.svg_b.selectAll("myrect")
            .data(["Total", "Age", "Sex", "Race", "Education", "Marital status", "Children", "Loss of employment", "Currently employed", "Income"])
            .enter()
            .append("rect")
            .attr("width", 45)
            .attr("height", 8)
            .attr("y", 280)
            .attr("x", (d, i) => 20 + i * 50)
            .style("fill",
                //d => this.legendColor(d))
                d => {
                    if (d === "Total") return "#122a2d";
                    else if (d === "Age") return "#455d61";
                    else if (d === "Sex") return "#16697A";
                    else if (d === "Race") return "#23679A";
                    else if (d === "Education") return "#a1bacb"//"#8a86c1";//"#758dc5";
                    else if (d === "Marital status") return "#c1a4c2";//"#6251b2";
                    else if (d === "Children") return "#815d9d";//"#792767";
                    else if (d === "Loss of employment") return "#6c3c6e";//"#520122";
                    else if (d === "Currently employed") return "#2f2461";//"#cb3070";
                    else if (d === "Income") return "#122a2d";//"#2f2461"
                })
        // colors "#2f2461","#815d9d","#6c3c6e","#956f96","#c1a4c2","#8a86c1"
        //labels for category
        this.svg_b.selectAll(".mylabels")
            .attr("class", "mylabels_legends")
            .data(["Total"])
            .enter()
            .append("text")
            .style("font-size", 10)
            .attr("y", 300)
            .attr("x", (d, i) => 30 + i * 40)
            .style("fill", "#122a2d")
            .text(d => d)
            .style("text-anchor", "right")

        this.svg_b.selectAll("mylabels")
            .data(["Age"])
            .enter()
            .append("text")
            .style("font-size", 10)
            .attr("y", 300)
            .attr("x", (d, i) => 85 + i * 40)
            .style("fill", "#455d61")
            .text(d => d)
            .style("text-anchor", "right")

        this.svg_b.selectAll("mylabels")
            .data(["Sex"])
            .enter()
            .append("text")
            .style("font-size", 10)
            .attr("y", 300)
            .attr("x", (d, i) => 135 + i * 40)
            .style("fill", "#16697A")
            .text(d => d)
            .style("text-anchor", "right")

        this.svg_b.selectAll("mylabels")
            .data(["Race"])
            .enter()
            .append("text")
            .style("font-size", 10)
            .attr("y", 300)
            .attr("x", (d, i) => 180 + i * 40)
            .style("fill", "#23679A")
            .text(d => d)
            .style("text-anchor", "right")

        this.svg_b.selectAll("mylabels")
            .data(["Education"])
            .enter()
            .append("text")
            .style("font-size", 10)
            .attr("y", 300)
            .attr("x", (d, i) => 222 + i * 36)
            .style("fill", "#678090")//"#a1bacb")
            .text(d => d)
            .style("text-anchor", "right")

        this.svg_b.selectAll("mylabels")
            .data(["Marital status"])
            .enter()
            .append("text")
            .style("font-size", 8)
            .attr("y", 300)
            .attr("x", (d, i) => 273 + i * 36)
            .style("fill", "#9a6c98")// "#c1a4c2")
            .text(d => d)
            .style("text-anchor", "right")

        this.svg_b.selectAll("mylabels")
            .data(["Children"])
            .enter()
            .append("text")
            .style("font-size", 10)
            .attr("y", 300)
            .attr("x", (d, i) => 325 + i * 42)
            .style("fill", "#815d9d")
            .text(d => d)
            .style("text-anchor", "right")

        this.svg_b.selectAll("mylabels")
            .data(["(Un)Employment"])
            .enter()
            .append("text")
            .style("font-size", 10)
            .attr("y", 300)
            .attr("x", (d, i) => 380 + i * 42)
            .style("fill", "#2f2461")
            .text(d => d)
            .style("text-anchor", "right")

        this.svg_b.selectAll("mylabels")
            .data(["Income"])
            .enter()
            .append("text")
            .style("font-size", 10)
            .attr("y", 300)
            .attr("x", (d, i) => 475 + i * 40)
            .style("fill", "#122a2d")
            .text(d => d)
            .style("text-anchor", "right")

        this.svg_b
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
        // .append("text")
        // .attr("opacity", 0.8)
        // .attr("class", "axis-label")
        // .attr("y", "5%")
        // .attr("dx", "50%")
        // .text("Category")
        // .attr("fill", "black")
        // .attr("font-size", 13)

        this.svg_b
            .append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${this.margin.left},0)`)
            .append("text")
            .attr("opacity", 0.8)
            .attr("class", "axis-label")
            .attr("y", "35%")
            .attr("dx", "-3em")
            .attr("writing-mode", "vertical-rl")
            .text("Millions")
            .attr("fill", "black")
            .attr("font-size", 13)
    }

    draw(state, setGlobalState) {
        //console.log("new barchart is drawing")

        this.updateData(state);

        // SCALES
        this.xScale = d3
            .scaleBand()
            .domain(d3.map(this.data, d => d.category))
            .range([this.margin.left, this.width + 80])

        this.yScale = d3
            .scaleLinear()
            .domain([60, 11500000])
            .range([this.height - this.margin.bottom, this.margin.top])

        // console.log("x domain:", this.xScale.domain(),"y domain:", this.yScale.domain())

        // Formatting numbers ( 1000 -> 1,000)
        this.formatNumber = d3.format(",")

        // Formatting percentage ((".2%"): 0.0024 -> 0.24%, (".0%"): 0.12 -> 12%)
        this.formatPercentage = function (d) {
            if (d < 0.01)
                return d3.format(".2%")(d);
            else {
                return d3.format(".0%")(d);
            }
        }

        this.colorScale = d3.scaleOrdinal()
            .range(["#122a2d", "#455d61", "#16697A", "#23679A", "#a1bacb", "#c1a4c2", "#815d9d", "#6c3c6e", "#2f2461", "#8a86c1"])
            //previous version colors
            // .range(["#122a2d", "#455d61", "#16697A", "#23679A", "#758dc5", "#6251b2", "#792767", "#520122", "#cb3070", "#2f2461"])

            .domain(["Total", "Age", "Sex", "Hispanic origin and Race", "Education", "Marital status", "Presence of children under 18 years old", "Respondent or household member experienced loss of employment income", "Respondent currently employed", "Income"])

        //console.log("colorDomain", this.colorScale.domain())

        this.div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.svg_b
            .selectAll("circle.circle")
            .data(this.data, d => d.noconf)
            .join(
                enter => enter
                    .append("circle")
                    .attr("class", "circle")
                    //.attr("cx", d => this.xScale(d.characteristics))
                    .attr("cx", (d, i) => 55 + i * 13)
                    .attr("cy", d => this.yScale(d.noconf))
                    .attr("r", d => this.zScale(d.noconf))
                    .attr("opacity", 0.7)
                    .attr("stroke", "black")
                    .attr("fill", d => this.colorScale(d.category))
                    .on('mouseover', (event, d) => {
                        this.div
                            .transition()
                            .duration(50)
                            .style('opacity', 1);
                        this.div
                            .html("<strong>" + this.formatNumber(d.noconf) + " or " + this.formatPercentage(d.noconf / '75266101') + " " + "</strong>"
                                + " of Americans who participated in survey had " + "<strong>" + "No confidence " + "</strong>" + "in paying rent next month in " + '<br>'
                                + "<strong>" + d.category + ": " + d.characteristics + "</strong>"
                            )
                            .style("left", (event.pageX + 10) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on('mouseout', () => {
                        this.div
                            .transition()//
                            .duration(100)
                            .style('opacity', 0);
                    })
                    .call(enter => enter
                        .transition()
                    )
                ,
                update => update
                    .call(update =>
                        update
                            .transition()
                            .duration(3000)
                            .attr("class", "circle")
                            //.attr("cx", d => this.xScale(d.characteristics))
                            .attr("cx", (d, i) => 55 + i * 13)
                            .attr("cy", d => this.yScale(d.noconf))
                            .attr("r", d => this.zScale(d.noconf))
                            .attr("opacity", 0.7)
                            .attr("stroke", "black")
                            .attr("fill", d => this.colorScale(d.category))

                    ),
                exit => exit
                    // .transition()
                    //     .remove()
                    .call(exit =>
                        // exit selections -- all the `.dot` element that no longer match to HTML elements
                        exit
                            // .transition(this.t)
                            //.duration(500)

                            .remove()
                    )
            )



        this.xAxis = d3.axisBottom(this.xScale).tickValues([])//.tickFormat("");
        this.yAxis = d3.axisLeft(this.yScale).tickFormat(d3.format('.2s'));

        // add the xAxis
        this.svg_b
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(this.xAxis)
            .append("text")
            .attr("class", "axis-label")

        // add the yAxis
        this.svg_b
            .select("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(this.yAxis)
            .append("text")
            .attr("class", "axis-label")


    }
    updateData(state) {
        const currentData2 = state.selection2 === "week_1" ? state.week_1 : state.week_2;

        this.data = currentData2.filter(d => d.state === "US")

        //  console.log("data", this.data)
        this.grouppedData = d3.map(this.data, d => d.category)
        // console.log("categories", this.grouppedData)

        this.grouppedCategories = d3.groups(this.data, d => d.category)

        console.log("categories groupped", this.grouppedCategories)
    }
}
export { Scatterplot };

