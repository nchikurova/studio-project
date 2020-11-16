class Count {

    // only runs one time for each instance
    constructor(state, setGlobalState) {
        this.width = 360,
            this.height = 100,
            this.margin = { top: 20, bottom: 70, left: 70, right: 40 }

        this.svg_c = d3
            .select("#count-container")
            .append("svg")
            .attr("viewBox", "0 0 400 300")
            .attr("transform", "translate(0,0)")
            .append("g")
        this.svg_c
            .append("rect")
            .attr("x", 10)
            .attr("y", 20)
            .attr("width", 600)
            .attr("height", 80)
            .attr("fill", "#69a3b2")

        //colors
        // this.cleanData = state.week_1.filter(d => d.state === "US")
        // this.totalsByState = new Map(
        //     this.cleanData
        //         .map(d => {
        //             this.levelObject = d[1].filter(r => r.category === "Total");
        //             return [d[0], this.levelObject];
        //         })
        // )
        // this.noConfSlightCont = new Map(
        //     this.cleanData
        //         .map(d => {
        //             this.levelObject = d[1].filter(r => r.category === "Total");
        //             return [d[0], this.levelObject.noconf];
        //         })
        // )
        // console.log("totalsByState", this.totalsByState)
        // console.log("noconfslight", noConfSlightCont)
        // this.xScale_c = d3
        //     .scaleBand()
        //     .domain()
        //     .range([this.margin.left, this.width - this.margin.right]);
        // console.log("x c domain", this.xScale.domain())

        // this.yScale_c = d3
        //     .scaleLinear()
        //     .domain(d3.extent(state.week_1, d => d.total))
        //     .range([this.height - this.margin.bottom, this.margin.top]);
        // console.log("y c domain", this.yScale.domain())


    }
    draw(state, setGlobalState) {

    }
}
export { Count };