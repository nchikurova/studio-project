d3.csv("../data/totals_weeks.csv", d => ({
    ...d,
    count: +d.count.split(",").join(""),
    level: d.level,
    week: d.week

}))
    .then(data => {

        const width_b = window.innerWidth * 0.3,
            height_b = window.innerHeight * 0.3,
            paddingInner = 0.2,
            margin_b = { top: 40, bottom: 40, left: 60, right: 40 };

        console.log(data);

        /** SCALES */
        // reference for d3.scales: https://github.com/d3/d3-scale
        const xScale_b = d3
            .scaleBand()
            .domain(data.map(d => d.week))
            .range([margin_b.left, width_b - margin_b.right])
            .paddingInner(paddingInner);

        const yScale_b = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([height_b - margin_b.bottom, margin_b.top]);


        // reference for d3.axis: https://github.com/d3/d3-axis
        const xAxis_b = d3.axisBottom(xScale_b).ticks(data.length);
        const yAxis_b = d3.axisLeft(yScale_b)
        /** MAIN CODE */
        const svg_b = d3
            .select("#barchart-container")
            .append("svg")
            .attr("viewBox", "0 0 400 300")
            .attr("transform", "translate(0,0)")
            .append("g")

        // append rects
        const rect = svg_b
            .selectAll("rect")
            .data(data)
            .join("rect")
            .attr("y", d => yScale_b(d.count))
            .attr("x", d => xScale_b(d.week))
            .attr("width", xScale_b.bandwidth())
            .attr("height", d => height_b - margin_b.bottom - yScale_b(d.count))
            .attr("fill", "#8ca5a8")
        //.attr("fill", "#82C0CC")

        // append text
        svg_b
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${height_b - margin_b.bottom})`)
            .call(xAxis_b)
            .append("text")
            .attr("class", "axis-label")
            .attr("x", "50%")
            .attr("dy", "3em")
            .attr("fill", "black")
            .text("Week");
        svg_b
            .append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0, ${height_b - margin_b.bottom})`)
            .call(xAxis_b);
        svg_b
            .append("g")
            .attr("class", "axis")
            .attr("transform", `translate(${margin_b.left},0)`)
            .call(yAxis_b);
        // d3.select("#button").on("click", function () {
        //     rect
        //         .transition()
        //         .attr("x", 50)
        //         .attr("y", 50)
        // });
    });