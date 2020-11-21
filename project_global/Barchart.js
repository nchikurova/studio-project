class Barchart {

    // only runs one time for each instance
    constructor(state, setGlobalState) {

        //  console.log("state data", state.week_1)
        this.width = 380,
            this.height = 320,
            this.margin = { top: 20, bottom: 60, left: 50, right: 40 }

        this.svg_b = d3
            .select("#barchart-container")
            .append("svg")
            .attr("viewBox", "0 0 400 300")
            .attr("transform", "translate(0,0)")
            .append("g")

        // DROPDOWNS
        this.selectState = d3
            .select("#dropdown1")
            .selectAll("option")
            .data(["All states", ...new Set(d3.map(state.week_1, d => d.state))])
            .join("option")
            .attr("value", d => d)
            .text(d => d);

        this.selectCategory = d3
            .select("#dropdown2")
            .selectAll("option")
            .data(["All categories", ...new Set(d3.map(state.week_1, d => d.category))])
            .join("option")
            .attr("value", d => d)
            .text(d => d);

        // click events
        this.selectState = d3
            .select("dropdown1")
            .on("change",
                function () {
                    console.log("The new selected state", this.value)
                    //     state.selectedState = this.value;
                    //     draw();
                    // })
                    setGlobalState({
                        selectedState: this.value,
                    })
                })
        this.selectCategory = d3
            .select("dropdown2")
            .on("change",
                function () {
                    console.log("The new selected category", this.value)
                    //     state.selectedCategory = this.value;
                    //     draw();
                    // })
                    setGlobalState({
                        selectedCategory: this.value,
                    })
                })

        const ageMap = [...Array.from(new Set(state.week_1.filter(obj => obj.category === 'Age').map(d => d.characteristics)))]
        console.log("ageMap", ageMap)


    }
    draw(state, setGlobalState) {
        //    console.log("new barchart is drawing")

        // adding dropdowns

        this.xScale = d3
            .scaleBand()
            .domain(([
                ...Array.from(new Set(state.week_1.filter(obj => obj.category === state.selectedCategory).map(d => d.characteristics)))
            ]))
            .range([this.margin.left, this.width - this.margin.right]);
        //  console.log("x domain", this.xScale.domain())


        this.yScale = d3
            .scaleLinear()
            .domain(d3.extent(state.week_1, d => d.noconf))
            .range([this.height - this.margin.bottom, this.margin.top]);
        //  console.log("y domain", this.yScale.domain())

        // this.level = new Set(this.levels.filter(obj => obj.category === state.selectedCategory).map(d => d.characteristics))
        // console.log("level", this.level)

        //filtering data by state and category
        let filteredData = state.week_1
            .filter(d => {
                if (state.selectedState !== "All states") {
                    return d.state === state.selectedState;
                } else if (state.selectedCategory !== "All categories") {
                    return d.category === state.selectedCategory;

                } else if (state.selectedState === "All States" || state.selectedCategory === "All category") {// || state.selectedLevel === "All levels") {
                    return state.week_1
                }

            })

        this.bars = d3
            .selectAll("g.rect")
            .data(filteredData, d => d.noconf)
            .join(
                enter => enter
                    .append("g")
                    .attr("class", "rect")
                    .attr("x", d => this.xScale(d.characteristics))
                    .attr("y", d => this.yScale(d.noconf))
                    .attr("opacity", 1)
                    // .attr("transform",
                    //     d => `translate(${this.xScale()},${this.yScale(d.noconf)})`)

                    .attr("width", this.xScale.bandwidth())
                    .attr("height", d => this.height - this.yScale(d.noconf))
                    .attr("fill", "purple"),
                update => update,
                exit => exit.remove()
            )

        // this.bars
        //     .transition()
        //     .duration(3000)
        //     .attr("transform",
        //         d => `translate(${this.xScale(d.characteristics)},${this.yScale(d.noconf)})`)
        //     .attr("fill", "purple")

        // this.bars
        //     .select("rect")
        //     .transition()
        //     .duration(3000)
        //     .attr("width", this.xScale.bandwidth())
        //     .attr("height", d => this.height - this.yScale(d.noconf))

        this.xAxis = d3.axisBottom(this.xScale);
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
            .text("Category")
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
    }
}
export { Barchart };

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