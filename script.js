//Write your javascript here!
const height = 450;
const width = 500;

const height_viz = 450;
const wid_viz = 500;

const data_file = "kc_house_data.csv"
const models_file = "data.csv"

const pointRadius = 5;
const pointAlpha = 0.75;
const color = "coral"

const metric = "MSE"

var data, models;
var color_scale = d3.scaleLinear();

//Steps:
//Make SVG
var main = d3.select("#content").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "main");

main.height = height
main.width = width
main.margin = {top: 50, right: 50, left: 75, bottom: 75};

main.xlabel = "sqft_living"
main.ylabel = "price"

main.x_scale = d3.scaleLinear().range([main.margin.left, width-main.margin.right]);
main.y_scale = d3.scaleLinear().range([height-main.margin.bottom, main.margin.top]);

main.line = main.append("line")
    .attr("stroke-width", 1)
    .attr("stroke", "red"); 

var xValue = function(d) { return +d[main.xlabel] / 1000; }
var yValue = function(d) { return +d[main.ylabel] / 1000; }

var viz = d3.select("#content").append("svg")
    .attr("width", wid_viz)
    .attr("height", height_viz)
    .attr("id", "viz");

viz.width = wid_viz
viz.height = height_viz
viz.margin = {top: 50, right: 50, left: 75, bottom: 75};

viz.xlabel = "b";
viz.ylabel = "a";

viz.x_scale = d3.scaleLinear().range([viz.margin.left, width-viz.margin.right]);
viz.y_scale = d3.scaleLinear().range([height-viz.margin.bottom, viz.margin.top]);

var slope = function(d) { return +d[viz.xlabel] }
var intercept = function(d) { return +d[viz.ylabel] }
var score = function(d) { return +d[metric] }

function drawAxes(svg) {
    // Making axes & labels
    svg.append("g")
        .call(d3.axisBottom(svg.x_scale))
        .attr("transform", `translate(0, ${svg.y_scale.range()[0]})`)
        .attr("class", "axis");

    svg.append("g")
        .call(d3.axisLeft(svg.y_scale))
        .attr("transform", `translate(${svg.x_scale.range()[0]},0)`)
        .attr("class", "axis");
}

// Draw the point corresponding to the given row
function drawPoint(row) {
    // Scale x and y
    var x = main.x_scale(xValue(row));
    var y = main.y_scale(yValue(row));

    // Draw the actual point
    var point = main.append("circle");
    row.point = point
    point.attr("cx", x)
        .attr("cy", y)
        .attr("r", pointRadius)
        .attr("fill", color)
        .attr("fill-opacity", pointAlpha)
        .attr("class", "point");
}

function colorize(n) {
    return d3.interpolateCool(color_scale(n));
}

// Draw the a + bx line on the main plot
function abline(a,b) {
    real_x2 = main.x_scale.domain()[1];
    real_y2 = a + b * real_x2;

    x2 = main.x_scale(real_x2);
    y2 = main.y_scale(real_y2);

    main.line.attr("x1", main.x_scale(0))
        .attr("y1", main.y_scale(a))
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("opacity", 1);
    
    return main.line;
}

function drawModel(row) {
    // Scale a and b
    var x = viz.x_scale(slope(row));
    var y = viz.y_scale(intercept(row));
    var s = colorize(score(row));

    // Draw the actual point
    var point = viz.append("circle");
    row.point = point
    point.attr("cx", x)
        .attr("cy", y)
        .attr("r", 7)
        .attr("fill", s)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("class", "model-point");
    
    abline(intercept(row), slope(row));
}

// Draw all the points in the dataset
function drawAllPoints(data) {
    data.forEach(row => { drawPoint(row); });
}

function drawLabels(svg) {
    // Add axis labels
    svg.append("text").text(svg.xlabel)
        .attr("transform", `translate(${svg.width/2}, ${svg.height-.5*svg.margin.bottom})`)
        .attr("class", "axislabel");

    svg.append("text").text(svg.ylabel)
        .attr("transform", `translate(${.5*svg.margin.left}, ${svg.height/2}) rotate(-90)`)
        .attr("class", "axislabel");
}

function setEq(row) {
    a = round(intercept(row));
    b = round(slope(row));
    mse = round(score(row));

    d3.select("#a").text(String(a))
    d3.select("#b").text(String(b))
    d3.select("#mse").text(String(mse))
}

function round(d) {
    return Number(Math.round(d+'e'+3)+'e-'+3);
}

drawLabels(main);
drawLabels(viz);

//Import CSV data
isImported = Promise.all([d3.csv(data_file), d3.csv(models_file)]);

isImported.then( function([d,m]) {
    data = d;

    models = m;

    main.x_scale.domain([ 0, d3.max(data,xValue)]);
    main.y_scale.domain([ 0, d3.max(data,yValue)]);

    viz.x_scale.domain([
        d3.min(models, slope), 
        d3.max(models, slope)
    ]);
    viz.y_scale.domain([
        d3.min(models, intercept), 
        d3.max(models, intercept)
    ]);

    color_scale.domain([d3.min(models, score), d3.max(models,score)]);

    drawAxes(main);
    drawAxes(viz);

    drawAllPoints(data);
    btnDisable(-1)
});

n = -1
var r;
function btnDisable(n) {
    d3.select("#next").attr("disabled", null);
    d3.select("#prev").attr("disabled", null);

    if (n < 1) d3.select("#prev").attr("disabled", true);

    if (n >= models.length - 1) d3.select("#next").attr("disabled", true);
}

function next() {
    if (n == models.length - 1) return

    try { models[Math.max(n,0)].point.attr("stroke-width", 0); }
    catch {}

    n++;
    row = models[n];
    drawModel(row);
    setEq(row);
    btnDisable(n)
    d3.select("#n").text(n);
    console.log(n);
}

function prev() {
    if (n == 0) return
    pause();

    try { models[n].point.attr("stroke-width", 0); }
    catch {}

    n--;
    row = models[n];
    drawModel(row);
    setEq(row);
    btnDisable(n)
    d3.select("#n").text(n);
    console.log(n);
}

function fast() {
    r = window.setInterval(next, 15);
}

function pause() {
    clearInterval(r);
}

function clr() {
    pause();
    n = -1;
    d3.selectAll(".model-point").remove();
    main.line.attr("opacity", 0);
    btnDisable(n)
}

function all() {
}
