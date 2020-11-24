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
            .attr("viewBox", "0 0 500 320")
            .attr("transform", "translate(0,0)")
            .append("g")


    }
    draw(state, setGlobalState) {
        //    console.log("new barchart is drawing")


        this.data = state.week_1.filter(d => d.state === "US")
        // console.log("data", this.data)


        this.xScale = d3
            .scaleBand()
            .domain(state.week_1.filter(d => d.state === "US").map(d => d.characteristics))
            .range([this.margin.left, this.width - this.margin.right]);
        // console.log("x domain", this.xScale.domain())


        this.yScale = d3
            .scaleLinear()
            //.domain(d3.extent(this.data, d => d.noconf))
            .domain([60, 10000000])
            .range([this.height - this.margin.bottom, this.margin.top])
        //.domain([0.01, 1])
        // console.log("y domain", this.yScale.domain())


        // Add a scale for bubble size
        this.zScale = d3.scaleSqrt()
            .domain([59, 7500000])
            .range([2, 25]);

        this.formatPercentage = d3.format(".0%")
        this.formatNumber = d3.format(",")



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
            .selectAll(".dot")

            .data(this.data, d => d.noconf)
            .join(
                enter => enter
                    .append("g")
                    .append("circle")
                    .attr("class", "dot")
                    .attr("cx", d => this.xScale(d.characteristics))
                    .attr("cy", d => this.yScale(d.noconf))
                    .attr("r", d => this.zScale(d.noconf))
                    .attr("opacity", 0.7)
                    .attr("stroke", "black")
                    // .append("text")
                    // .attr("class", "text-labels")
                    // // .style("left", (pageX + 10) + "px")
                    // // .style("top", (pageY - 28) + "px")
                    // .attr("x", "50%")
                    // .attr("dy", d => d.noconf)
                    // .attr("text", d => d.category)
                    .attr("fill", d => this.colorScale(d.category))//"purple")
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
                            .html("<strong>" + this.formatNumber(d.noconf) + " or " + this.formatPercentage(d.noconf / '75266101') + " " + d.noconf / '75266101' + "</strong>"
                                + " of survey participants had no confidence in paying rent next month in " + '<br>'
                                + "<strong>" + d.category + " : " + d.characteristics + "</strong>"
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

            )

        this.xAxis = d3.axisBottom(this.xScale).tickFormat("");//.ticks(state.week_1.length);
        this.yAxis = d3.axisLeft(this.yScale).tickFormat(d3.format('.2s'));

        // add the xAxis
        this.svg_b
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(this.xAxis)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "50%")
            .attr("dy", "3em")
            .attr("transform", "rotate(90)")
            // .text("Category")
            // .attr("writing-mode", "vertical-rl")

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
            .text("Millions")
            .attr("fill", "black")


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
        //     else return "#2f2461";
        // })

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
}
export { Scatterplot };

 // Dropdowns data wrapping
 //this.states = new Set(d3.map(state.week_1, d => d.state))
 //console.log("states", this.states)

 //this.categories = new Set(d3.map(state.week_1, d => d.category))
 //console.log("categories", this.categories)
 /////////////// DATA WRANGLING
 //this.level1 = new Set(d3.map(state.week_1, d => (d.noconf + d.slightconf)))// gives all characteristics
 //this.level2 = new Set(d3.map(state.week_1, d => (d.modconf + d.highconf)))
 //.filter(obj => obj.category === state.selectedCategory).map(d => d.characteristics))
 //this.levels = new Set([...this.level1, ...this.level2])

 // this.level = new Set(state.week_1
 //     .filter(obj => obj.category === state.selectedCategory)
 //     .map(d => d.characteristics))
 //console.log("level", this.level)

 //console.log("level1", this.level1)
 //console.log("level2", this.level2)
 //console.log("levels", this.levels)
 //this.level = new Set(d3.map(state.week_1, d => d.noconf))
 //console.log("level", this.level)


 //this.cleanData = d3.groups(state.week_1, d => d.characteristics.noconf)
 //console.log("cleandata", this.cleanData)
 //this.cleanData2 = d3.groups(this.cleanData, d => d.category)
 //console.log("cleandata2", this.cleanData2)

 // this.totalsByState = new Map(
 //     this.cleanData2
 //         .map(d => {
 //             this.levelObject = d[1].filter(r => r.characteristics === state.selectedCategory);
 //             return [d[0], this.levelObject];
 //         })
 // )
 // this.totalsByStateC = new Map(
 //     this.cleanData2
 //         .map(d => {
 //             this.levelObject = d[1].filter(r => r.category === state.selectedCategory);
 //             return [d[0], this.levelObject];
 //         })
 // )
 // console.log("totalsByState", this.totalsByState)
 // console.log("totalsByStateC", this.totalsByStateC)
 // console.log("levelObj", this.levelObject)
 //////////////////