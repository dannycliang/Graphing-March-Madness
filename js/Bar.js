d3.select("input[value=\"total\"]").property("checked", true);

datasetTotal = [
    {label:"Round of 32", value:93.54},
    {label:"Sweet 16", value:64.15},
    {label:"Elite 8", value:41.93},
    {label:"Final 4", value:25.80},
    {label:"Championship Game", value:16.12},
    {label:"Won it all", value:6.45}
];

datasetLast15Years = [
    {label:"Round of 32", value:85.71},
    {label:"Sweet 16", value:64.28},
    {label:"Elite 8", value:50},
    {label:"Final 4", value:21.43},
    {label:"Championship Game", value:21.43},
    {label:"Won it all", value:7.14}
];

datasetOption2 = [
    {label:"Round of 32", value:100},
    {label:"Sweet 16", value:64.71},
    {label:"Elite 8", value:35.29},
    {label:"Final 4", value:29.41},
    {label:"Championship Game", value:11.76},
    {label:"Won it all", value:5.88}
];

d3.selectAll("input").on("change", selectDataset);

function selectDataset()
{
    var value = this.value;
    if (value == "total")
    {
        change(datasetTotal);
    }
    else if (value == "Last15Years")
    {
        change(datasetLast15Years);
    }
    else if (value == "option2")
    {
        change(datasetOption2);
    }
}

var margin = {top: (parseInt(d3.select('body').style('height'), 10)/10), right: (parseInt(d3.select('body').style('width'), 10)/20), bottom: (parseInt(d3.select('body').style('height'), 10)/10), left: (parseInt(d3.select('body').style('width'), 10)/20)},
        width = parseInt(d3.select('body').style('width'), 10) - margin.left - margin.right,
        height = parseInt(d3.select('body').style('height'), 10) - margin.top - margin.bottom;

var div = d3.select("body").append("div").attr("class", "toolTip");

var formatPercent = d3.format("");

var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .2, 0.5);

var y = d3.scale.linear()
        .range([height, 0]);

var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent);

var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

change(datasetTotal);

function change(dataset) {

    x.domain(dataset.map(function(d) { return d.label; }));
    y.domain([0, 100]);

    svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);


    svg.select(".y.axis").remove();
    svg.select(".x.axis").remove();

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("% of Kansas Teams Advanced To");

    var bar = svg.selectAll(".bar")
            .data(dataset, function(d) { return d.label; });
    // new data:
    bar.enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.label); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .attr("width", x.rangeBand());

    bar
            .on("mousemove", function(d){
                div.style("left", d3.event.pageX+10+"px");
                div.style("top", d3.event.pageY-25+"px");
                div.style("display", "inline-block");
                div.html((d.label)+"<br>"+(d.value)+"%");
            });
    bar
            .on("mouseout", function(d){
                div.style("display", "none");
            });

    // removed data:
    bar.exit().remove();
    // updated data:
    bar
            .transition()
            .duration(750)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });
};
