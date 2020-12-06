class Scatterplot {

    // only runs one time for each instance
    constructor(state, setGlobalState) {

        //  console.log("state data", state.week_1)
        this.width = 460,
            this.height = 280,
            this.margin = { top: 10, bottom: 10, left: 50, right: 0 }

        this.svg_b = d3
            .select("#scatterplot-container")
            .append("svg")
            .attr("viewBox", "0 0 540 320")
            .attr("transform", "translate(0,0)")
            .append("g")

        this.buttons2 = d3
            .selectAll("input_hhh")
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
            .range([2, 25]);
        // Add legend for zScale: circles from https://www.d3-graph-gallery.com/graph/bubble_template.html
        this.valuesToShow = [300000, 3000000, 8000000]

        this.svg_b
            .selectAll("legend")
            .data(this.valuesToShow)
            .enter()
            .append("circle")
            .attr("cx", 450)
            .attr("cy", d => this.height - 217 - this.zScale(d))
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

        this.keysCat = ["Total", "Age", "Sex", "Race", "Education", "Marital status", "Children", "Loss of employment", "Currently employed", "Income"]
        this.legendColor = d3.scaleOrdinal().domain([this.keysCat]).range(["#122a2d", "#455d61", "#16697A", "#23679A", "#758dc5", "#6251b2", "#792767", "#520122", "#cb3070", "#2f2461"])
        this.svg_b.selectAll("myrect")
            .data(this.keysCat)
            .enter()
            .append("rect")
            .attr("width", 80)
            .attr("height", 8)
            .attr("y", 280)
            .attr("x", (d, i) => 40 + i * 40)
            .style("fill", d => this.legendColor(d))
        // d => {
        //     if (d.category === "Age") return "#455d61";
        //     else if (d.category === "Sex") return "#16697A";
        //     else if (d.category === "Hispanic origin and Race") return "#23679A";
        //     else if (d.category === "Education") return "#758dc5";
        //     else if (d.category === "Total") return "#122a2d";
        //     else if (d.category === "Marital status") return "#6251b2";
        //     else if (d.category === "Presence of children under 18 years old") return "#792767";
        //     else if (d.category === "Respondent or household member experienced loss of employment income") return "#520122";
        //     else if (d.category === "Respondent currently employed") return "#cb3070";
        //     else if (d.category === "Income") return "#2f2461"
        // })

        //labels for category
        this.svg_b.selectAll("mylabels")
            .data(["Age", "Sex", "Race"])
            .enter()
            .append("text")
            .style("font-size", 8)
            .attr("y", 300)
            .attr("x", (d, i) => 50 + i * 40)
            .style("fill", "black")
            .text(d => d)
            .style("text-anchor", "right")

        this.svg_b.selectAll("mylabels")
            .data(["Education", "Marital status"])
            .enter()
            .append("text")
            .style("font-size", 8)
            .attr("y", 300)
            .attr("x", (d, i) => 162 + i * 36)
            .style("fill", "black")
            .text(d => d)
            .style("text-anchor", "right")


        this.svg_b.selectAll("mylabels")
            .data(["Children", "Loss of employment"])
            .enter()
            .append("text")
            .style("font-size", 8)
            .attr("y", 300)
            .attr("x", (d, i) => 245 + i * 42)
            .style("fill", "black")
            .text(d => d)
            .style("text-anchor", "right")

        this.svg_b.selectAll("mylabels")
            .data(["Income"])
            .enter()
            .append("text")
            .style("font-size", 8)
            .attr("y", 300)
            .attr("x", (d, i) => 430 + i * 40)
            .style("fill", "black")
            .text(d => d)
            .style("text-anchor", "right")
    }

    draw(state, setGlobalState) {
        //console.log("new barchart is drawing")

        this.updateData(state);

        this.xScale = d3
            .scaleBand()
            .domain(d3.map(this.data, d => d.characteristics))

            .range([this.margin.left, this.width - this.margin.right]);
        //console.log("x domain", this.xScale.domain())

        this.yScale = d3
            .scaleLinear()
            //.domain(d3.extent(this.data, d => d.noconf))
            .domain([60, 11500000])
            .range([this.height - this.margin.bottom, this.margin.top])

        // console.log("y domain", this.yScale.domain())

        // formatting numbers ( 1000 -> 1,000)
        this.formatNumber = d3.format(",")

        //formatting percentage ((".2%"): 0.0024 -> 0.24%, (".0%"): 0.12 -> 12%)
        this.formatPercentage = function (d) {
            if (d < 0.01)
                return d3.format(".2%")(d);
            else {
                return d3.format(".0%")(d);
            }
        }

        this.colorScale = d3.scaleOrdinal()
            .range(["#122a2d", "#455d61", "#16697A", "#23679A", "#758dc5", "#6251b2", "#792767", "#520122", "#cb3070", "#2f2461"])
            //.domain(d3.extent(this.data, d => d.noconf))
            .domain(["Total", "Age", "Sex", "Hispanic origin and Race", "Education", "Marital status", "Presence of children under 18 years old", "Respondent or household member experienced loss of employment income", "Respondent currently employed", "Income"])
        //.domain(this.data, d => d.category)
        //.range(["#C8E1E5", "#0e2629"])
        //console.log("colorDomain", this.colorScale.domain())

        this.div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.svg_b
            .selectAll("circle.circle")
            .data(this.data, d => d.noconf.toString())
            .join(
                enter => enter
                    //.append("g")
                    .append("circle")
                    .attr("class", "circle")
                    .attr("cx", d => this.xScale(d.characteristics))
                    .attr("cy", d => this.yScale(d.noconf))
                    .attr("r", d => this.zScale(d.noconf))
                    .attr("opacity", 0.7)
                    .attr("stroke", "black")
                    .attr("fill", d => this.colorScale(d.category))
                    // d => {
                    //     if (d.category === "Age") return "#455d61";
                    //     else if (d.category === "Sex") return "#16697A";
                    //     else if (d.category === "Hispanic origin and Race") return "#23679A";
                    //     else if (d.category === "Education") return "#758dc5";
                    //     else if (d.category === "Total") return "#122a2d";
                    //     else if (d.category === "Marital status") return "#6251b2";
                    //     else if (d.category === "Presence of children under 18 years old") return "#792767";
                    //     else if (d.category === "Respondent or household member experienced loss of employment income") return "#520122";
                    //     else if (d.category === "Respondent currently employed") return "#cb3070";
                    //     else return "#2f2461";
                    // })
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
                    }).call(enter => enter
                        //.transition()
                        ,
                        update => update
                            .attr("class", "circle")
                            .attr("cx", d => this.xScale(d.characteristics))
                            .attr("cy", d => this.yScale(d.noconf))
                            .attr("r", d => this.zScale(d.noconf))
                            .attr("opacity", 0.7)
                            .attr("stroke", "black")
                            .attr("fill", d => this.colorScale(d.category)).call(update =>
                                update // initialize transition
                                // .transition()
                                // .duration(250)
                                // .attr("stroke", "black")
                                // .transition()
                                // .duration(250)
                                // .attr("stroke", "lightgrey")
                            ),
                        exit => exit.remove()
                            .call(exit =>
                                // exit selections -- all the `.dot` element that no longer match to HTML elements
                                exit
                                    .transition()
                                    .delay(d => 50 * d.characteristics)
                                    .duration(1000)
                                    .attr("cx", width)
                                    .remove()
                            )
                    ))
        this.xAxis = d3.axisBottom(this.xScale).tickFormat("");//.ticks(state.week_1.length);
        this.yAxis = d3.axisLeft(this.yScale).tickFormat(d3.format('.2s'));

        // add the xAxis
        this.svg_b
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(this.xAxis)

        // add the yAxis
        this.svg_b
            .append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(this.yAxis)
        //     .append("text")
        //     .attr("class", "axis-label")
        //     .attr("y", "50%") //in the middle of line
        //     .attr("dx", "-4em")
        //     .attr("writing-mode", "vertical-rl")
        //     .text("Millions")
        //     .attr("fill", "black")

    }
    updateData(state) {
        const currentData = state.selection === "week_1" ? state.week_1 : state.week_2;

        this.data = currentData.filter(d => d.state === "US")

        //  console.log("data", this.data)
        this.grouppedData = d3.map(this.data, d => d.category)
    }
}
export { Scatterplot };

