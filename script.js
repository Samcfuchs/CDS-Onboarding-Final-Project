//Write your javascript here!
const height = 500;
const width = 500;

const height_viz = 500;
const wid_viz = 500;

const data_file = "iris.csv"
const models_file = "dummy.csv"

const pointRadius = 5;
const pointAlpha = 0.75;
const color = "coral"

const metric = "MSE"

var data, models;
var color_scale = d3.scaleLinear();

//Steps:
//Make SVG
var main = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "main");

main.height = height
main.width = width
main.margin = {top: 50, right: 50, left: 75, bottom: 75};

main.xlabel = "SepalLengthCm"
main.ylabel = "SepalWidthCm"

main.x_scale = d3.scaleLinear().range([main.margin.left, width-main.margin.right]);
main.y_scale = d3.scaleLinear().range([height-main.margin.bottom, main.margin.top]);

main.line = main.append("line")
    .attr("stroke-width", 1)
    .attr("stroke", "red"); 

var xValue = function(d) { return +d[main.xlabel]; }
var yValue = function(d) { return +d[main.ylabel]; }

var viz = d3.select("body").append("svg")
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
        .attr("transform", `translate(0, ${svg.y_scale(0)})`)
        .attr("class", "axis");

    svg.append("g")
        .call(d3.axisLeft(svg.y_scale))
        .attr("transform", `translate(${svg.x_scale(0)},0)`)
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
    x2 = main.x_scale.range()[1]
    y2 = a + b * x2

    main.line.attr("x1", main.x_scale(0))
        .attr("y1", main.y_scale(a))
        .attr("x2", x2)
        .attr("y2", y2)
    
    return main.line;
}

function drawModel(row) {
    // Scale a and b
    var x = viz.x_scale(slope(row));
    var y = viz.y_scale(intercept(row));
    var s = colorize(score(row));

    // Draw the actual point
    // TODO: add color
    var point = viz.append("circle");
    row.point = point
    point.attr("cx", x)
        .attr("cy", y)
        .attr("r", pointRadius)
        .attr("fill-opacity", pointAlpha)
        .attr("fill", s)
        .attr("class", "point");
    
    abline(slope(row), intercept(row))
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

drawLabels(main);
drawLabels(viz);

//Import CSV data
isImported = Promise.all([d3.csv(data_file), d3.csv(models_file)]);

isImported.then( function([d,m]) {
    data = d;
    models = m;

    main.x_scale.domain([ 0, 1.10 * d3.max(data,xValue)]);
    main.y_scale.domain([ 0, 1.10 * d3.max(data,yValue)]);

    viz.x_scale.domain([
        1.10 * d3.min(models, slope), 
        1.10 * d3.max(models, slope)
    ]);
    viz.y_scale.domain([
        1.10 * d3.min(models, intercept), 
        1.10 * d3.max(models, intercept)
    ]);

    color_scale.domain([d3.min(models, score), d3.max(models,score)]);

    drawAxes(main);
    drawAxes(viz);

    drawAllPoints(data);
});

n = -1
function next() {
    n++;
    row = models[n];
    abline(intercept(row), slope(row));
    drawModel(row)
    console.log(n);
}

function prev() {
    if (n == 0) return

    n--;
    row = models[n];
    abline(intercept(row), slope(row));
    drawModel(row)
    console.log(n);
}

function all() {
}
