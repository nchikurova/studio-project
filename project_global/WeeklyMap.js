class WeeklyMap {

    // only runs one time for each instance
    constructor(state, setGlobalState) {

        this.width = 360;
        this.height = 300;
        this.margin = { top: 60, bottom: 50, left: 40, right: 40 };

        this.projection = d3.geoAlbersUsa().fitSize([this.width, this.height], state.geojson);
        this.path = d3.geoPath().projection(this.projection);

        this.svg = d3
            .select("#map-container")
            .append("svg")
            .attr("viewBox", "0 0 400 320")
            .append("g")
            .attr("transform", "translate(0,0)")

        this.colorScale = d3.scaleLinear()
            //.range(["#e7eff0", "#C8E1E5", "#B7D0D0", "#82C0CC", "#458A93", "#16697A", "#1C474D", "#0e2629"])//"#1C474D"])
            .domain([0.05, 0.2])
            .range(["#C8E1E5", "#0e2629"])
        //console.log("colorDomain", this.colorScale.domain())

        //formatTime = d3.format(",") //if value interpreted by number
        this.formatPercentage = d3.format(".0%")


        this.buttons = d3
            .selectAll("input")
            .on("change",
                function () {
                    // console.log("button changed to", this.value)

                    setGlobalState({
                        selection: this.value
                    })
                })


        this.div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // LEGENDS
        this.keys = ["3%", "5%", "8%", "12%", "14%", "16%", "19%"]
        this.legendColor = d3.scaleOrdinal().domain(["3%", "5%", "8%", "12%", "14%", "16%", "19%"]).range(["#c4dde1",
            "#a4bdc1",
            "#8ca5a8",
            "#5b7377",
            "#455d61",
            "#3d5558",
            "#122a2d"])
        this.svg.selectAll("myrect")
            .data(this.keys)
            .enter()
            .append("rect")
            .attr("width", 30)
            .attr("height", 10)
            .attr("y", 280)
            .attr("x", function (d, i) { return 140 + i * 30 })
            .style("fill", d => this.legendColor(d))

        this.svg.selectAll("mylabels")
            .data(this.keys)
            .enter()
            .append("text")
            .style("font-size", 12)
            .attr("y", 300)
            .attr("x", function (d, i) { return 150 + i * 30 })
            .style("fill", "black")
            .text(d => d)
            .style("text-anchor", "center")
            .style("alignment-baseline", "middle")


    }
    // called every times state is updated

    draw(state, setGlobalState) {
        // let currentData; 

        // console.log("filtered weekly data", state.selection, this.currentData)

        this.updateData(state);

        this.svg
            .selectAll(".state")
            // all of the features of the geojson, meaning all the states as individuals
            .data(state.geojson.features)
            .join(
                enter => enter.append("path")
                    .attr("d", this.path)
                    .attr("class", "state")
                    .style("stroke", "black")
                    .attr("fill", d => {
                        // console.log("d", d)
                        let value = this.noconfByState.get(d.properties.STUSPS);
                        return (value != 0 ? this.colorScale(value) : "grey")

                    })
                    .on('mouseover', (event, d) => {
                        //console.log("d for tooltips", d)
                        this.div
                            .transition()
                            .duration(50)
                            .style('opacity', 1);
                        this.div
                            .html("<strong>" + this.formatPercentage(this.noconfByState.get(d.properties.STUSPS)) + "</strong>"
                                + " of survey participants had no confidence in paying rent next month in " + '<br>'
                                + "<strong>" + d.properties.NAME + "</strong>"
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

                update => update
                    .attr("fill", d => {
                        let value = this.noconfByState.get(d.properties.STUSPS);
                        return (value != 0 ? this.colorScale(value) : "grey")

                    }),
                exit => exit.call(exit =>
                    // exit selections -- all the `.dot` element that no longer match to HTML elements
                    exit
                        .transition()
                        .duration(3000)
                        .remove()
                ).call(
                    selection =>
                        selection
                            .transition() // initialize transition
                            .duration(3000))

            )


    }
    //creating new method
    updateData(state) {
        const currentData = state.selection === "week_1" ? state.week_1 : state.week_2;

        this.cleanData = d3.groups(currentData, d => d.state)

        // getting "No confidence" totals by state through the category "Total"
        this.totalsByState = new Map(
            this.cleanData
                .map(d => {
                    this.totalObject = d[1].find(r => r.category === 'Total');
                    return [d[0], this.totalObject];
                })
        )
        // console.log("totalsByState", this.totalsByState)

        // GETTING ONE NEEDED VALUE OUT OF OBJECT -  % of noconf out of total responds
        this.noconfByState = new Map(
            this.cleanData.map(d => {
                this.totalObject = d[1].find(r => r.category === 'Total');
                return [d[0], this.totalObject.noconf / this.totalObject.total];
            })
        )
        // console.log("noconf", this.noconfByState)

    }

}

export { WeeklyMap };

