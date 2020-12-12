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

        // this.colorScale = d3.scaleLinear()
        //     //.range(["#e7eff0", "#C8E1E5", "#B7D0D0", "#82C0CC", "#458A93", "#16697A", "#1C474D", "#0e2629"])//"#1C474D"])
        //     .domain(this.barNames)
        //     .range(["#C8E1E5", "#0e2629"])
        this.svg_b
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${this.height})`)
            //.call(this.xAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "50%")
            .attr("dy", "4em")
            .text("Confidence")
            .attr("font-size", 14)
            .attr("fill", "black");

        // add the yAxis
        this.svg_b
            .append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${this.margin.left},0)`)
            //.call(this.yAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("y", "50%") //in the middle of line
            .attr("dx", "-4em")
            .attr("writing-mode", "vertical-rl")


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
        this.updateData(state);
        //    console.log("new barchart is drawing")
        let filteredData = this.barNames//.keys();

        if (state.selectedState !== "US") {
            filteredData = this.barNames.find(d => d[0] === state.selectedState);
        }
        // if (state.selectedState !== "US") {
        //     filteredData = this.data_bar.filter(d => d.state === state.selectedState);
        // }

        console.log("filtered weekly data: ", state.selectedState, state.selection, this.currentData)

        //console.log("bar names", this.barNames)

        this.xScale = d3
            .scaleBand()
            //.domain(this.barNames)
            .domain(this.barNames)
            .range([this.margin.left, this.width - this.margin.right])
            .paddingInner(this.paddingInner)
            .paddingOuter(this.paddingOuter);;
        //  console.log("x domain", this.xScale.domain())

        this.yScale = d3
            .scaleLinear()
            .domain([0, 0.8])
            .range([this.height, this.margin.top]);
        //console.log("y domain", this.yScale.domain())

        this.formatPercentage = d3.format(".0%")

        this.div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.xAxis = d3.axisBottom(this.xScale).tickFormat("").tickValues([]);
        this.yAxis = d3.axisLeft(this.yScale).tickFormat(this.formatPercentage)//.tickFormat(d3.format('.2s'));

        // add the xAxis
        this.svg_b
            // .append("g")
            .selectAll("class", "axis x-axis")
            .append("g")
            .attr("transform", `translate(0,${this.height})`)
            .call(this.xAxis)
        // .append("text")
        // .attr("class", "axis-label")


        // add the yAxis
        this.svg_b
            .append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${this.margin.left},0)`)
        // .call(this.yAxis)
        // .append("text")
        // .attr("class", "axis-label")


        this.yAxisGrid = d3.axisLeft(this.yScale).tickSize(- this.width).tickFormat('').ticks(10);
        this.svg_b.append('g')
            .attr('class', 'grid')
            .call(this.yAxisGrid)
            .attr("transform", `translate(${this.margin.left},0)`)


        console.log("filtData", filteredData, filteredData[1])
        this.svg_b
            .selectAll(".bars")
            .data(filteredData[1])
            //.data(this.barNames[1])
            .join(
                enter => enter
                    // .append("g")
                    .append("rect")
                    .attr("class", "bars")
                    .attr("x", (d, i) => (60 + i * 50))
                    .attr("width", this.xScale.bandwidth())
                    .attr("y", this.height - this.margin.bottom)//d => this.yScale(d))
                    .attr("height", this.height)//d => this.height - this.yScale(d))
                    .attr("opacity", 1)
                    .attr("stroke", "black")
                    .attr("stroke-width", "1px")
                    .attr("stroke-opacity", 1)
                    .attr("fill", "#1C474D")
                    .on('mouseover', (event, d) => {
                        console.log("d for tooltips", d)
                        this.div
                            .transition()
                            .duration(50)
                            .style('opacity', 1);
                        this.div
                            .html("<strong>" + this.formatPercentage(d) + " " + "</strong>" + "<br>"
                                + " of Americans who participated in survey had this level of confidence in paying rent next month in "
                                // +"<strong>" + filteredData[0] + "</strong>"
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


                    .call(enter => enter
                        .transition()
                        .duration(3000))
                ,
                update =>
                    update.call(update =>
                        update.transition()
                            .duration(2000)
                            .attr("x", (d, i) => (60 + i * 50))
                            .attr("width", this.xScale.bandwidth())
                            .attr('y', this.height - this.margin.bottom)//d => this.yScale(d))
                            .attr('height', this.height)//d => this.height - this.yScale(d))
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

            )

    }

    //creating new method
    updateData(state) {

        const currentData = state.selection === "week_1" ? state.week_1 : state.week_2;

        this.data_bar = d3.groups(currentData, d => d.state)
        // console.log("data_bar", this.data_bar)

        // getting "No confidence" totals by state through the category "Total"
        this.totalsByState2 = new Map(
            this.data_bar
                .map(d => {
                    this.totalObject2 = d[1].find(r => r.category === 'Total');
                    return [d[0], this.totalObject2];
                })
        )
        //console.log("totalsByState", this.totalsByState2)

        // GETTING ONE NEEDED VALUE OUT OF OBJECT -  % of noconf out of total responds
        this.barNames_map = new Map(
            this.data_bar.map(d => {
                this.totalObject2 = d[1].find(r => r.category === 'Total');
                return [d[0], [this.totalObject2.noconf / this.totalObject2.total, this.totalObject2.slightconf / this.totalObject2.total, this.totalObject2.modconf / this.totalObject2.total, this.totalObject2.highconf / this.totalObject2.total]];
            })
        )

        this.barNames = Array.from(this.barNames_map)
        //console.log("bar names map", this.barNames_map)
        //console.log("bar names", this.barNames)
        // console.log("bar names keys", this.barNames_map.keys())
        // console.log("bar names values", this.barNames_map.values())

    }

}
export { Barchart };

