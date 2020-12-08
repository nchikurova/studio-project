// import our components

import { Heatmap } from "./Heatmap.js";
import { WeeklyMap } from "./WeeklyMap.js";
import { Barchart } from "./Barchart.js";
import { Scatterplot } from "./Scatterplot.js";

let map, barchart, heatmap, scatterplot

//global state
let state = {
    geojson: [],
    week_1: [],
    week_2: [],
    heatmap: [],
    selection: "week_1",
    selection2: "week_1",
    // selectedState: "US", //if needed
    currentData: [],
    currentData2: [],

}
Promise.all([
    d3.json("../data/usState.json"),
    d3.csv("../data/totals_by_week.csv", d => ({
        ...d,
        count: +d.count.split(",").join(""),
        level: d.level,
    })),
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
        category: d.category.trim(),
        characteristics: d.characteristics.trim().replace("�", "'"),

    })),
    d3.csv("../data/week_2.csv", d => ({
        total: +d.total.split(",").join(""),
        wrent: +d.wrent.split(",").join(""),
        noconf: +d.noconf.split(",").join(""),
        slightconf: +d.slightconf.split(",").join(""),
        modconf: +d.modconf.split(",").join(""),
        highconf: +d.highconf.split(",").join(""),
        deferred: +d.deferred.split(",").join(""),
        didnottenure: +d.didnottenure.split(",").join(""),
        state: d.state,
        category: d.category.trim(),
        characteristics: d.characteristics.trim().replace("�", "'"),

    })),
]).then(([geojson, heatmap, week_1, week_2]) => {
    state.geojson = geojson;
    state.heatmap = heatmap;
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
    heatmap = new Heatmap(state, setGlobalState);
    //console.log("heatmap", heatmap)
    scatterplot = new Scatterplot(state, setGlobalState);
    //console.log("heatmap", heatmap)
    draw();
}

function draw() {
    map.draw(state, setGlobalState);
    barchart.draw(state, setGlobalState);
    heatmap.draw(state, setGlobalState);
    scatterplot.draw(state, setGlobalState);
}
// UTILITY FUNCTION: state updating function that we pass to our components so that they are able to update our global state object
function setGlobalState(nextState) {
    state = { ...state, ...nextState };
    console.log("new state", state);
    draw();
}
