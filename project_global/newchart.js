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
            .select("dropdown1")
            .on("change",
                function () {
                    console.log("The new selected state", this.value)

                    setGlobalState({
                        selectedState: this.value
                    })
                })
        this.selectState
            = d3
                .select("#dropdown1")

                .selectAll("option")
                .data(["All states", ...new Set(d3.map(state.week_1, d => d.state))])
                .join("option")
                .attr("value", d => d)
                .text(d => d);

        // this.selectCategory = d3
        //     .select("#dropdown2")
        //     .selectAll("option")
        //     .data(["All categories", ...new Set(d3.map(state.week_1, d => d.category))])
        //     .join("option")
        //     .attr("value", d => d)
        //     .text(d => d);

        // this.keys = new Set(d3.map(state.week_1, d => d.characteristics))
        // console.log('keys characteristics', this.keys)

        // this.groupCategory = d3.groups(state.week_1, d => d.category)
        // this.categoryGroup = new Map
        //     (this.groupCategory.map(d => {
        //         this.newArray = d[1];//.find(r => r.category);
        //         return [d[0], this.newArray
        //         ];
        //     })
        //     )
        // console.log("newrrr", this.rrr)
        // console.log('rrr', this.categoryGroup)


        // this.selectCategory = d3
        //     .select("dropdown2")
        //     .on("change",
        //         function () {
        //             console.log("The new selected category", this.value)
        //             setGlobalState({
        //                 selectedCategory: this.value,
        //             })
        //         })


        this.ageMap = [...Array.from(new Set(state.week_1.filter(obj => obj.category === 'Age').map(d => d.characteristics)))]
        console.log("ageMap", this.ageMap)
        this.totalMap = [...Array.from(new Set(state.week_1.filter(obj => obj.category === 'Total').map(d => d.characteristics)))]
        console.log("totalMap", this.totalMap)
        this.sexMap = [...Array.from(new Set(state.week_1.filter(obj => obj.category === 'Sex').map(d => d.characteristics)))]
        console.log("ageMap", this.sexMap)
    }
    draw(state, setGlobalState) {
        //    console.log("new barchart is drawing")
        updateData(state)

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
        console.log("y domain", this.yScale.domain())

        // this.data = state.week_1.filter(d => d.state === "US")
        // console.log("data", this.data)

        this.formatPercentage = d3.format(".0%")
        //filtering data by state and category
        // let filteredData = state.week_1;

        // if (state.selectedState !== "All states") {
        //     filteredData = state.week_1.filter(d => d.state === state.selectedState);
        //return d.state === state.selectedState;
        // } else if (state.selectedCategory !== "All categories") {
        //     return d.category === state.selectedCategory;

        // } else if (state.selectedState === "All States" || state.selectedCategory === "All category") {// || state.selectedLevel === "All levels") {
        //     return state.week_1
        //  }

        // })
        this.colorScale = d3.scaleLinear()
            .range(["#e7eff0", "#C8E1E5", "#B7D0D0", "#82C0CC", "#458A93", "#16697A", "#1C474D", "#0e2629"])//"#1C474D"])
            .domain(d3.extent(this.data, d => d.noconf))
        //.range(["#C8E1E5", "#0e2629"])
        console.log("colorDomain", this.colorScale.domain())
        // this.cleanData = d3.groups(state.week_1, d => d.state)
        // this.totalsByState = new Map(
        //     this.cleanData
        //         .map(d => {
        //             this.totalObject = d[1].find(r => r.category === 'Total');
        //             return [d[0], this.totalObject];
        //         })
        // )
        // console.log("totalsByState", this.totalsByState)
        //this.bar = 

        this.div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        this.svg_b
            .selectAll(".dot")
            // .data(filteredData, d => d.noconf)
            .data(this.data, d => d.noconf)
            .join(
                enter => enter
                    .append("g")
                    .append("circle")
                    .attr("class", "dot")
                    .attr("cx", d => this.xScale(d.characteristics))
                    .attr("cy", d => this.yScale(d.noconf))
                    .attr("r", d => this.z(d.noconf))
                    .attr("opacity", 0.6)
                    .attr("stroke", "black")
                    // .attr("transform", `translate(${this.margin.bottom} + 10,0)`)
                    //.attr("r", 3)
                    .attr("fill", //d => this.colorScale(d.category))//"purple")
                        d => {
                            if (d.category === "Age") return "red";
                            else if (d.category === "Sex") return "coral";
                            else if (d.category === "Hispanic Origin and race") return "gold";
                            else if (d.category === "Education") return "gold";
                            else if (d.category === "Total") return "gold";
                            else return "green";
                        }).on('mouseover', (event, d) => {
                            //console.log("d for tooltips", d)
                            this.div
                                .transition()
                                .duration(50)
                                .style('opacity', 1);
                            this.div
                                .html("<strong>" + d.noconf + " or " + this.formatPercentage(d.noconf / '75266101') + " " + d.noconf / '75266101' + "</strong>"
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
                    }),
                update => update.attr("cx", d => this.xScale(d.characteristics))
                    .attr("cy", d => this.yScale(d.noconf))
                    .attr("opacity", 1)
                    // .attr("transform", `translate(${this.margin.bottom} + 10,0)`)
                    .attr("r", 3)
                    //.attr("fill", "purple"),
                    // .attr("fill", d => this.colorScale(d.category))
                    .attr("fill", //"purple")
                        d => {
                            if (d.category === "Age") return "red";
                            else if (d.category === "Sex") return "coral";
                            else if (d.category === "Hispanic Origin and race") return "gold";
                            else if (d.category === "Education") return "gold";
                            else if (d.category === "Total") return "gold";
                            else return "purple";
                        }),

                exit => exit.remove()
                    .call(
                        allCircles =>
                            allCircles
                                .transition() // initialize transition
                                .duration(3000))

            )

        this.xAxis = d3.axisBottom(this.xScale)//.ticks(state.week_1.length);
        this.yAxis = d3.axisLeft(this.yScale).tickFormat(d3.format('.2s'))
            ;

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
        this.slightconfByState = new Map(
            this.cleanData.map(d => {
                this.totalObject = d[1].find(r => r.category === 'Total');
                return [d[0], this.totalObject.slightconf / this.totalObject.total];
            })
        )
        // console.log("noconf", this.noconfByState)

        this.modconffByState = new Map(
            this.cleanData.map(d => {
                this.totalObject = d[1].find(r => r.category === 'Total');
                return [d[0], this.totalObject.modconf / this.totalObject.total];
            })
        )
        // console.log("noconf", this.noconfByState)
        this.highconfByState = new Map(
            this.cleanData.map(d => {
                this.totalObject = d[1].find(r => r.category === 'Total');
                return [d[0], this.totalObject.highconf / this.totalObject.total];
            })
        )
        // console.log("noconf", this.noconfByState)
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


class Barchart {
    constructor(state, setGlobalState, setLocalState) {
        this.width = window.innerWidth * .5;
        this.height = window.innerHeight * .6;
        this.margin = { top: 20, bottom: 20, left: 20, right: 20 };

        this.svg1 = d3
            .select('#BarChart1')
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.yScale1 = d3.scaleLinear()
        this.yScale2 = d3.scaleLinear()

        this.yaxis1 = d3.axisLeft(this.yScale1)
        this.yaxis2 = d3.axisLeft(this.yScale2)

    }

    draw(state, setGlobalState, setLocalState) {
        //use state.filteredData1 and 2 
        this.fd1 = state.filteredData1.filter(d => {
            if ((state.selectedGame1 !== 'All Games') && (state.selectedShot1 !== 'All Shots') && (state.selectedPlayer1 !== 'All Players')) {
                return d.game_number === state.selectedGame1 && d.PLAYER_NAME === state.selectedPlayer1 && d.EVENT_TYPE === state.selectedShot1;
            } else if ((state.selectedGame1 === 'All Games') && (state.selectedShot1 === 'All Shots') && (state.selectedPlayer1 === 'All Players')) {
                return true;
            } else if ((state.selectedGame1 !== 'All Games') && (state.selectedShot1 === 'All Shots') && (state.selectedPlayer1 === 'All Players')) {
                return d.game_number === state.selectedGame1;
            } else if ((state.selectedGame1 === 'All Games') && (state.selectedShot1 !== 'All Shots') && (state.selectedPlayer1 === 'All Players')) {
                return d.EVENT_TYPE === state.selectedShot1;
            } else if ((state.selectedGame1 === 'All Games') && (state.selectedShot1 === 'All Shots') && (state.selectedPlayer1 !== 'All Players')) {
                return d.PLAYER_NAME === state.selectedPlayer1;
            } else if ((state.selectedGame1 !== 'All Games') && (state.selectedShot1 !== 'All Shots') && (state.selectedPlayer1 === 'All Players')) {
                return d.game_number === state.selectedGame1 && d.EVENT_TYPE === state.selectedShot1;
            } else if ((state.selectedGame1 === 'All Games') && (state.selectedShot1 !== 'All Shots') && (state.selectedPlayer1 !== 'All Players')) {
                return d.EVENT_TYPE === state.selectedShot1 && d.PLAYER_NAME === state.selectedPlayer1;
            } else if ((state.selectedGame1 !== 'All Games') && (state.selectedShot1 === 'All Shots') && (state.selectedPlayer1 !== 'All Players')) {
                return d.game_number === state.selectedGame1 && d.PLAYER_NAME === state.selectedPlayer1;
            }
        })



        this.shotTypes = ['Restricted Area', 'Above the Break 3', 'Mid-Range', 'In The Paint(Non-RA)', 'Right Corner 3', 'Left Corner 3', 'Backcourt'];
        this.keys = ['valueMade', 'valueMisses'];

        this.shotdata1 = this.shotTypes.map(shotType => {
            return {
                shotType: shotType,
                valueMade: d3.count(this.fd1.filter(d => shotType === d.SHOT_ZONE_BASIC && d.SHOT_MADE_FLAG === 1), d => d.SHOT_MADE_FLAG),
                valueMisses: d3.count(this.fd1.filter(d => shotType === d.SHOT_ZONE_BASIC && d.SHOT_MADE_FLAG === 0), d => d.SHOT_MADE_FLAG)
            };
        })


        this.xScale0 = d3.scaleBand()
            .domain(this.shotTypes)
            .rangeRound([this.margin.left + 5, this.width - this.margin.right])
            .paddingInner(.1);

        this.xScale1 = d3.scaleBand()
            .domain(this.keys)
            .rangeRound([0, this.xScale0.bandwidth()])
            .paddingInner(.05);

        this.yScale1.domain([0, d3.max(this.shotdata1.map(d => [d['valueMade'], d['valueMisses']]), d => { return d3.max(d) })])
            .range([this.height - this.margin.top, this.margin.bottom])
        this.yScale2.domain([0, d3.max(this.shotdata2.map(d => [d['valueMade'], d['valueMisses']]), d => { return d3.max(d) })])
            .range([this.height - this.margin.top, this.margin.bottom])


        this.xaxis = d3.axisBottom(this.xScale0)


        //adding in our x-axis
        this.svg1
            .append('g')
            .attr('class', 'axis')
            .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
            .call(this.xaxis)
            .append('text')
            .attr("class", "axis-label")
            .attr("x", "50%")
            .attr("dy", "3em")
            .attr("transform", "rotate(90)")
            .text('Shot Zone')


        //adding y-axis
        this.svg1
            .append('g')
            .attr('class', 'y-axis1')
            .attr('transform', `translate(${this.margin.left + 4},0)`)

        d3.select('g.y-axis1')
            .transition()
            .duration(3000)
            .call(this.yaxis1)

        this.bar_names1 = this.svg1
            .selectAll(".barnames")
            .data(this.shotdata1)
            .join('g')
            .attr('class', 'barnames')
            .attr('transform', d => `translate(${this.xScale0(d.shotType)},0)`)
            .selectAll('rect')
            .data(d => this.keys.map(key => ({ key, value: d[key] })))
            .join(
                enter => enter
                    .append('rect')
                    .style('fill', d => {
                        if (d.key === 'valueMade') {
                            return 'green';
                        } else if (d.key === 'valueMisses') {
                            return 'red';
                        }
                    })
                    .attr('opacity', .5)
                    .attr('x', d => this.xScale1(d.key))
                    .attr('y', d => this.yScale1(0))
                    .attr('width', this.xScale1.bandwidth())
                    .attr('height', this.height - this.margin.top - this.yScale1(0))
                    .call(enter => enter
                        .transition()
                        .duration(3000)
                        .attr('y', d => this.yScale1(d.value))
                        .attr('height', d => this.yScale1(0) - this.yScale1(d.value))),
                update => update.call(update => update
                    .transition()
                    .duration(5000)
                    .attr('y', d => this.yScale1(d.value))
                    .attr('height', d => this.yScale1(0) - this.yScale1(d.value)))
                //exit=>exit.remove()
            )



        this.text1 = this.svg1
            .selectAll('.text1')
            .data(this.shotdata1)
            .join('g')
            .attr('class', 'text1')
            .attr('transform', d => `translate(${this.xScale0(d.shotType)},0)`)
            .selectAll('text')
            .data(d => this.keys.map(key => ({ key, value: d[key] })))
            .join(
                enter => enter
                    .append('text')
                    .style('fill', 'white')
                    .attr('opacity', .5)
                    .attr('x', d => this.xScale1(d.key))
                    .attr('y', d => this.yScale1(0))
                    .attr('width', this.xScale1.bandwidth())
                    .attr('height', this.height - this.margin.top - this.yScale1(0))
                    .attr('dx', ".6em")
                    .text(d => {
                        if (d.value === 0) {
                            return null;
                        } else {
                            return d.value;
                        }
                    })
                    .call(enter => enter
                        .transition()
                        .duration(3000)
                        .attr('y', d => this.yScale1(d.value))
                        .attr('height', d => this.yScale1(0) - this.yScale1(d.value))),
                update => update.call(update => update
                    .transition()
                    .duration(5000)
                    .text(d => {
                        if (d.value === 0) {
                            return null;
                        } else {
                            return d.value;
                        }
                    })
                    .attr('y', d => this.yScale1(d.value))
                    .attr('height', d => this.yScale1(0) - this.yScale1(d.value))),
                exit => exit.remove()
            )









    }


}

export { Barchart };
