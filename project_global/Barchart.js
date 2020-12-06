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
            // .append("g")
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
            .attr("x", function (d, i) { return 50 + i * 50 })
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
            .attr("x", function (d, i) { return 165 + i * 35 })
            .style("fill", "black")
            .text(d => d) //"None", "Slight", "Moderate", "High")
            .style("text-anchor", "center")
            .style("alignment-baseline", "middle")
        this.yAxis = d3.tickFormat(this.formatPercentage);
        this.svg_b
            .append('g')
            .attr('class', 'grid')
            //.call(this.yAxisGrid)
            .attr("transform", `translate(${this.margin.left},0)`)


    }
    draw(state, setGlobalState) {
        this.updateData(state);
        //    console.log("new barchart is drawing")

        console.log("data_bar", this.data_bar)

        console.log("bar names", this.barNames)

        //////// filtering data by state; the structure of the data does not let me get state values without intercecting with Total US values
        /// in a file NewBarchart.js

        // let filteredData = this.barNames;

        // if (state.selectedState !== "US") {
        //     filteredData = this.barNames.find(d => d[0] === state.selectedState);
        // }

        //console.log("filtered weekly data: ", state.selectedState, state.selection, this.currentData)
        ////////////


        this.xScale = d3
            .scaleBand()
            .domain(this.barNames)
            .range([this.margin.left, this.width - this.margin.right])
            .paddingInner(this.paddingInner)
            .paddingOuter(this.paddingOuter);;

        this.yScale = d3
            .scaleLinear()
            .domain([0, 0.45])
            // .domain([0, d3.max(this.barNames)])
            .range([this.height, this.margin.top]);

        //console.log("x domain:", this.xScale.domain(), "y domain:", this.yScale.domain())

        this.formatPercentage = d3.format(".0%")
        this.yAxis = d3.axisLeft(this.yScale).tickFormat(this.formatPercentage);

        // this.yAxisGrid = d3.axisLeft(this.yScale).tickSize(- this.width).tickFormat('').ticks(10);

        // this.svg_b
        //     .append('g')
        //     .attr('class', 'grid')
        //     .call(this.yAxisGrid)
        //     .attr("transform", `translate(${this.margin.left},0)`)

        this.svg_b
            .selectAll(".bars")
            .data(this.barNames)
            .join(
                enter => enter
                    .append("g")
                    .append("rect")
                    .attr("class", "bars")
                    .attr("x", (d, i) => (15 + i * 50))
                    .attr("width", this.xScale.bandwidth())
                    .attr("y", d => this.yScale(d))
                    .attr("height", d => this.height - this.yScale(d))
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
                                + " of Americans who participated in survey had this level of confidence in paying rent next month"
                                // + "<strong>" + currentData + "</strong>"
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
                        .duration(3000))
                ,
                update =>
                    update.call(update =>
                        update.transition()
                            .duration(2000)
                            .attr("x", (d, i) => (15 + i * 50))
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

            )

        this.svg_b
            .selectAll(".text")
            //.data(this.formatPercentage(this.barNames))
            .data(this.barNames)
            .attr('opacity', 0)
            .join(
                enter => enter
                    .append("g")
                    .append("text")
                    .attr("class", "text")
                    .attr("x", (d, i) => (55 + i * 50))
                    .attr("width", this.xScale.bandwidth())
                    .attr("y", d => this.yScale(d) - 5)
                    .attr("height", d => this.height - this.yScale(d))
                    .attr("opacity", 1)

                    .attr("stroke-opacity", 1)
                    .attr("fill", "black")
                    .attr('opacity', .5)

                    .text(d => this.formatPercentage(d))
                    .call(enter => enter
                        .transition()
                        .duration(3000))
                ,
                update =>
                    update.call(update =>
                        update.transition()
                            .duration(2000)
                            .attr("x", (d, i) => (55 + i * 50))
                            .attr("width", this.xScale.bandwidth())
                            .attr('y', d => this.yScale(d) - 5)
                            .attr('height', d => this.height - this.yScale(d))
                            .attr("fill", "black")
                            .attr('opacity', .5)
                            .text(d => this.formatPercentage(d))
                    )
                // ,
                // exit =>
                //     exit
                // .call(exit =>
                //     exit
                //         .transition() // initialize transition
                //         .duration(2000)
                //     // .remove()
                // )
            )
        this.xAxis = d3.axisBottom(this.xScale).tickFormat("").tickValues([]);

        this.div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // add the xAxis
        this.svg_b
            // .append("g")
            .selectAll("class", "axis x-axis")
            .append("g")
            .attr("transform", `translate(0,${this.height})`)
            .call(this.xAxis)

        // add the yAxis
        this.svg_b
            //.append("g")
            .attr("class", "axis y-axis")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(this.yAxis)
            .append("text")
            .attr("class", "axis-label")
    }

    //creating new method
    updateData(state) {

        const currentData = state.selection === "week_1" ? state.week_1 : state.week_2;

        this.data_bar = currentData.filter(d => d.state === "US").find(r => r.category === "Total")

        console.log("data_bar", this.data_bar)

        this.barNames = [this.data_bar.noconf / this.data_bar.total, this.data_bar.slightconf / this.data_bar.total, this.data_bar.modconf / this.data_bar.total, this.data_bar.highconf / this.data_bar.total]



    }

}
export { Barchart };






//         this.data_bar = d3.groups(currentData, d => d.state)
//         // console.log("data_bar", this.data_bar)

//         // getting "No confidence" totals by state through the category "Total"
//         this.totalsByState2 = new Map(
//             this.data_bar
//                 .map(d => {
//                     this.totalObject2 = d[1].find(r => r.category === 'Total');
//                     return [d[0], this.totalObject2];
//                 })
//         )
//         //console.log("totalsByState", this.totalsByState2)

//         // GETTING ONE NEEDED VALUE OUT OF OBJECT -  % of noconf out of total responds
//         this.barNames_map = new Map(
//             this.data_bar.map(d => {
//                 this.totalObject2 = d[1].find(r => r.category === 'Total');
//                 return [d[0], [this.totalObject2.noconf / this.totalObject2.total, this.totalObject2.slightconf / this.totalObject2.total, this.totalObject2.modconf / this.totalObject2.total, this.totalObject2.highconf / this.totalObject2.total]];
//             })
//         )

//         this.barNames = Array.from(this.barNames_map)
//         //console.log("bar names map", this.barNames_map)
//         //console.log("bar names", this.barNames)
//         // console.log("bar names keys", this.barNames_map.keys())
//         // console.log("bar names values", this.barNames_map.values())

//     }


// }
// export { Barchart };

