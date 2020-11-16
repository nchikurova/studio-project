// import our components
import { WeeklyMap } from "./WeeklyMap.js";
import { Barchart } from "./Barchart.js";
import { Count } from "./Count.js";

let map, barchart, count;
let svg;
let projection;
let path;
let div;
let xScale;
let yScale;
let yAxis;
let xAxis;


//global state
let state = {
    geojson: null,
    week_1: null,
    week_2: [],
    // domain:[],
    selectedCategory: "All categories", //selectedMetric
    selectedLevel: "All levels",
    selecteState: "All states",

}
Promise.all([
    d3.json("../data/usState.json"),
    d3.csv("../data/week_1.csv", d => ({
        total: +d.total.split(",").join(""),
        wrent: +d.wrent.split(",").join(""),
        noconf: +d.noconf.split(",").join(""),
        slightconf: +d.slightconf.split(",").join(""),
        modconf: +d.modconf.split(",").join(""),
        highconf: +d.highconf.split(",").join(""),
        deferred: +d.deferred.split(",").join(""),
        didnottenure: +d.didnottenure.split(",").join(""),
        state: d.state,
        category: d.category,
        characteristics: d.characteristics,

    })),
]).then(([geojson, week_1, week_2]) => {
    state.geojson = geojson;
    state.week_1 = week_1;
    state.week_2 = week_2;
    console.log("state: ", state);
    init();
});

function init() {
    map = new WeeklyMap(state, setGlobalState);
    // console.log("map", map)
    barchart = new Barchart(state, setGlobalState);
    // console.log("barchart", barchart)
    count = new Count(state, setGlobalState);
    //console.log("count", count)

    draw();
}

function draw() {
    map.draw(state, setGlobalState);
    barchart.draw(state, setGlobalState);
    count.draw(state, setGlobalState);
}
// UTILITY FUNCTION: state updating function that we pass toour components so that they are able to update our global state object
function setGlobalState() {
    state = { ...state, ...nextState };
    console.log("new state", state);
    draw();
}
