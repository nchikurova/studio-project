class Barchart {

    // only runs one time for each instance
    constructor(state, setGlobalState) {

        //  console.log("state data", state.week_1)
        this.margin = { top: 20, bottom: 100, left: 50, right: 40 }
        this.width = 300,
            this.height = 300 - this.margin.bottom,

            this.paddingInner = 0.2,
            this.paddingOuter = 0.2,

            this.svg_b = d3
                .select("#barchart-container")
                .append("svg")
                .attr("viewBox", "0 0 300 260")
                .attr("transform", "translate(0,0)")
                .append("g")

        this.colorScale = d3.scaleLinear()
            //.range(["#e7eff0", "#C8E1E5", "#B7D0D0", "#82C0CC", "#458A93", "#16697A", "#1C474D", "#0e2629"])//"#1C474D"])
            .domain([0.05, 0.5])
            .range(["#C8E1E5", "#0e2629"])

        // this.buttons2 = d3
        //     .selectAll("input")
        //     .on("change",
        //         function () {
        //             console.log("button changed to", this.value)

        //             setGlobalState({
        //                 selection1: this.value
        //             })
        //         })

        this.svg_b.selectAll("mylabels")
            .data(["None", "Slight"])
            .enter()
            .append("text")
            .style("font-size", 13)
            .attr("y", 220)
            .attr("x", function (d, i) { return 64 + i * 46 })
            .style("fill", "black")
            .text(d => d) //"None", "Slight", "Moderate", "High")
            .style("text-anchor", "center")
            .style("alignment-baseline", "middle")

        this.svg_b.selectAll("mylabels")
            .data(["Moderate", "High"])
            .enter()
            .append("text")
            .style("font-size", 13)
            .attr("y", 220)
            .attr("x", function (d, i) { return 157 + i * 60 })
            .style("fill", "black")
            .text(d => d) //"None", "Slight", "Moderate", "High")
            .style("text-anchor", "center")
            .style("alignment-baseline", "middle")
    }
    draw(state, setGlobalState) {
        //    console.log("new barchart is drawing")


        this.updateData2(state);
        console.log("filtered weekly data", state.selection1, this.currentData2)
        // this.data_bar = currentData.filter(d => d.state === "US").find(r => r.category === "Total")
        // console.log("data_bar", this.data_bar)
        // this.barNames = [this.data_bar.noconf / this.data_bar.total, this.data_bar.slightconf / this.data_bar.total, this.data_bar.modconf / this.data_bar.total, this.data_bar.highconf / this.data_bar.total]

        console.log("bar names", this.barNames)

        this.xScale = d3
            .scaleBand()
            .domain(this.barNames)
            .range([this.margin.left, this.width - this.margin.right])
            .paddingInner(this.paddingInner)
            .paddingOuter(this.paddingOuter);;
        //  console.log("x domain", this.xScale.domain())

        this.yScale = d3
            .scaleLinear()
            .domain([0, 0.45])
            .range([this.height, this.margin.top]);
        console.log("y domain", this.yScale.domain())

        this.formatPercentage = d3.format(".0%")

        this.div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.svg_b
            .selectAll(".bars")
            // .data(filteredData, d => d.noconf)
            .data(this.barNames)
            .join(
                enter => enter
                    .append("g")
                    .append("rect")
                    .attr("class", "bars")
                    .attr("x", (d, i) => (60 + i * 50))
                    .attr("width", this.xScale.bandwidth())
                    .attr("y", d => this.yScale(d))
                    .attr("height", d => this.height - this.yScale(d))
                    .attr("opacity", 1)
                    .attr("stroke", "black")
                    .attr("stroke-width", "1px")
                    .attr("stroke-opacity", 1)
                    .attr("fill", "#1C474D")
                    .on('mouseover', (event, d) => {
                        //console.log("d for tooltips", d)
                        this.div
                            .transition()
                            .duration(50)
                            .style('opacity', 1);
                        this.div
                            .html("<strong>" + this.formatPercentage(d) + " " + "</strong>" + "<br>"
                                + " of Americans who participated in survey had this level of confidence in paying rent next month"
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
                        .transition()
                        .duration(3000)),
                update =>
                    update.call(update =>
                        update.transition()
                            .duration(2000)
                            .attr("x", (d, i) => (60 + i * 50))
                            .attr("width", this.xScale.bandwidth())
                            .attr('y', d => this.yScale(d))
                            .attr('height', d => this.height - this.yScale(d))
                            .attr("fill", "#1C474D")
                    )
                ,
                exit =>
                    exit.call(exit =>
                        exit
                            .transition() // initialize transition
                            .duration(2000)
                            .remove()

                    )
                // })
                // }).attr("height", d => this.yScale(0) - this.yScale(d))
                // .attr("fill", "#455d61")
                // .call(
                //     selection =>
                //         selection
                //             .transition() // initialize transition
                //             .duration(3000))
            )

        this.xAxis = d3.axisBottom(this.xScale).tickFormat("").tickValues([]);
        this.yAxis = d3.axisLeft(this.yScale)//.tickFormat(d3.format('.2s'))
            ;

        // add the xAxis
        this.svg_b
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${this.height})`)
            .call(this.xAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "40%")
            .attr("dy", "4em")
            .text("Confidence")
            .attr("font-size", 14)
            //.attr("font-weight", 100)


            .attr("fill", "black");

        // add the yAxis
        this.svg_b
            .append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(this.yAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("y", "50%") //in the middle of line
            .attr("dx", "-4em")
            .attr("writing-mode", "vertical-rl")
        // .text("Millions")
        // .attr("fill", "black")
    }

    //creating new method
    updateData2(state) {

        const currentData2 = state.selection1 === "week_1" ? state.week_1 : state.week_2;

        this.data_bar = currentData2.filter(d => d.state === "US").find(r => r.category === "Total")

        console.log("data_bar", this.data_bar)

        this.barNames = [this.data_bar.noconf / this.data_bar.total, this.data_bar.slightconf / this.data_bar.total, this.data_bar.modconf / this.data_bar.total, this.data_bar.highconf / this.data_bar.total]



    }

}
export { Barchart };

