// Round by round winrates
var myData = "Round	16-8-4-2	16-8-4-3	16-8-4-11	16-8-5-2	16-8-5-3/6/7/10	16-8-5-11	16-8-12-2	16-8-12/13-2/3	16-8-12-7/10/11\n\
Round of 64	100	100	100	100	100	100	100	100	100\n\
Round of 32	81.2	81.2	81.2	81.2	81.2	81.2	81.2	81.2	81.2\n\
Sweet 16	70.9	70.9	70.9	75	75	75	100	100	100\n\
Elite 8	62.5	50	100	80.0	100.0	0.0	50	0	100\n\
";

// Dimensions of the graph
var margin = {
    top: 20,
    right: 300,
    bottom: 30,
    left: 50
  },
  width = 1350 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

// Scales for x and y
var x = d3.scale.ordinal()
    .domain(["Round of 64", "Round of 32", "Sweet 16", "Elite 8"])
    .rangePoints([0, width]);

var y = d3.scale.linear()
  .range([height, 0]);

var color = d3.scale.category10();

// Add axes to appropriate locations
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var line = d3.svg.line()
  .interpolate("linear")
  .x(function(d) {
    return x(d.Round);
  })
  .y(function(d) {
    return y(d.winrate);
  });

// Add graph to appropriate div on the page
var svg = d3.select("#linelocation").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Parse the data
var data = d3.tsv.parse(myData);

color.domain(d3.keys(data[0]).filter(function(key) {
  return key !== "Round";
}));

var rounds = color.domain().map(function(name) {
  return {
    name: name,
    values: data.map(function(d) {
      return {
        Round: d.Round,
        winrate: +d[name]
      };
    })
  };
});

y.domain([
  0, 100
]);

var legend = svg.selectAll('g')
  .data(rounds)
  .enter()
  .append('g')
  .attr('class', 'legend');

legend.append('rect')
  .attr('x', width + 40)
  .attr('y', function(d, i) {
    return i * 20;
  })
  .attr('width', 10)
  .attr('height', 10)
  .style('fill', function(d) {
    return color(d.name);
  });

legend.append('text')
  .attr('x', width + 60)
  .attr('y', function(d, i) {
    return (i * 20) + 9;
  })
  .text(function(d) {
    return d.name;
  });

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Win Rate (%)");

var stage = svg.selectAll(".stage")
  .data(rounds)
  .enter().append("g")
  .attr("class", "stage");

stage.append("path")
  .attr("class", "line")
  .attr("d", function(d) {
    return line(d.values);
  })
  .style("stroke", function(d) {
    return color(d.name);
  });

  var curtain = svg.append("rect")
      .attr('x', -1 * width)
      .attr('y', -1 * height)
      .attr('height', height)
      .attr('width', width)
      .attr('class', 'curtain')
      .attr('transform', 'rotate(180)')
      .style('fill', '#ffffff')

      var t = svg.transition()
      .delay(750)
      .duration(4000)
      .ease('linear')
      .each('end', function() {
        d3.select('line.guide')
          .transition()
          .style('opastage', 0)
          .remove()
      });

    t.select('rect.curtain')
      .attr('width', 0);

stage.append("text")
  .datum(function(d) {
    return {
      name: d.name,
      value: d.values[d.values.length - 1]
    };
  })
  .attr("transform", function(d) {
    return "translate(" + x(d.value.Round) + "," + y(d.value.winrate) + ")";
  })
  .attr("x", 4)
  .attr("dy", ".35em")


var mouseG = svg.append("g")
  .attr("class", "mouse-over-effects");

mouseG.append("path") // this is the black vertical line to follow mouse
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opastage", "0");

var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(rounds)
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

mousePerLine.append("circle")
  .attr("r", 7)
  .style("stroke", function(d) {
    return color(d.name);
  })
  .style("fill", "none")
  .style("stroke-width", "1px")
  .style("opastage", "0");

mousePerLine.append("text")
  .attr("transform", "translate(10,3)");

mouseG.append('svg:rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function() {
    d3.select(".mouse-line")
      .style("opastage", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opastage", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opastage", "0");
  })
  .on('mouseover', function() {
    d3.select(".mouse-line")
      .style("opastage", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opastage", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opastage", "1");
  })
  .on('mousemove', function() {
    var mouse = d3.mouse(this);
    d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + mouse[0] + "," + height;
        d += " " + mouse[0] + "," + 0;
        return d;
      });

    d3.selectAll(".mouse-per-line")
      .attr("transform", function(d, i) {
        console.log(width/mouse[0])


        var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

        while (true){
          target = Math.floor((beginning + end) / 2);
          pos = lines[i].getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
          }
          if (pos.x > mouse[0])      end = target;
          else if (pos.x < mouse[0]) beginning = target;
          else break; //position found
        }

        d3.select(this).select('text')
          .text(d.name);

        return "translate(" + mouse[0] + "," + pos.y +")";
      });
  });


( function() {
var myData = "Round	16-9-4-2/6	16-9-4-3	16-9-4-10	16-9-5-2	16-9-5-3	16-9-5-6	16-9-5-7/10	16-9-12-2/11	16-9-12/13-3/6/7/10	16-9-13-2\n\
Round of 64	100	100	100	100	100	100	100	100	100	100\n\
Round of 32	92.1	92.1	92.1	92.1	92.1	92.1	92.1	92.1	92.1	92.1\n\
Sweet 16	71.4	71.4	71.4	86.4	86.4	86.4	86.4	100	100	100\n\
Elite 8	50	33.3	0.0	14.3	40.0	83.3	100	50	100	0.0\n\
";

var margin = {
    top: 20,
    right: 300,
    bottom: 30,
    left: 50
  },
  width = 1350 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(["Round of 64", "Round of 32", "Sweet 16", "Elite 8"])
    .rangePoints([0, width]);



var y = d3.scale.linear()
  .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");

var line = d3.svg.line()

  .interpolate("linear")
  .x(function(d) {
    return x(d.Round);
  })
  .y(function(d) {
    return y(d.winrate);
  });



var svg = d3.select("#linetlocation").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = d3.tsv.parse(myData);

color.domain(d3.keys(data[0]).filter(function(key) {
  return key !== "Round";
}));



var rounds = color.domain().map(function(name) {
  return {
    name: name,
    values: data.map(function(d) {
      return {
        Round: d.Round,
        winrate: +d[name]
      };
    })
  };
});

y.domain([
  0, 100
]);

var legend = svg.selectAll('g')
  .data(rounds)
  .enter()
  .append('g')
  .attr('class', 'legend');

legend.append('rect')
  .attr('x', width + 40)
  .attr('y', function(d, i) {
    return i * 20;
  })
  .attr('width', 10)
  .attr('height', 10)
  .style('fill', function(d) {
    return color(d.name);
  });

legend.append('text')
  .attr('x', width + 60)
  .attr('y', function(d, i) {
    return (i * 20) + 9;
  })
  .text(function(d) {
    return d.name;
  });

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Win Rate (%)");

var stage = svg.selectAll(".stage")
  .data(rounds)
  .enter().append("g")
  .attr("class", "stage");



stage.append("path")
  .attr("class", "line")
  .attr("d", function(d) {
    return line(d.values);
  })
  .style("stroke", function(d) {
    return color(d.name);
  });

  var curtain = svg.append("rect")
      .attr('x', -1 * width)
      .attr('y', -1 * height)
      .attr('height', height)
      .attr('width', width)
      .attr('class', 'curtain')
      .attr('transform', 'rotate(180)')
      .style('fill', '#ffffff')

      var t = svg.transition()
      .delay(750)
      .duration(4000)
      .ease('linear')
      .each('end', function() {
        d3.select('line.guide')
          .transition()
          .style('opastage', 0)
          .remove()
      });

    t.select('rect.curtain')
      .attr('width', 0);

stage.append("text")
  .datum(function(d) {
    return {
      name: d.name,
      value: d.values[d.values.length - 1]
    };
  })
  .attr("transform", function(d) {
    return "translate(" + x(d.value.Round) + "," + y(d.value.winrate) + ")";
  })
  .attr("x", 4)
  .attr("dy", ".35em")


var mouseG = svg.append("g")
  .attr("class", "mouse-over-effects");

mouseG.append("path")
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opastage", "0");

var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(rounds)
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

mousePerLine.append("circle")
  .attr("r", 7)
  .style("stroke", function(d) {
    return color(d.name);
  })
  .style("fill", "none")
  .style("stroke-width", "1px")
  .style("opastage", "0");

mousePerLine.append("text")
  .attr("transform", "translate(10,3)");

mouseG.append('svg:rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function() {
    d3.select(".mouse-line")
      .style("opastage", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opastage", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opastage", "0");
  })
  .on('mouseover', function() {
    d3.select(".mouse-line")
      .style("opastage", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opastage", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opastage", "1");
  })
  .on('mousemove', function() {
    var mouse = d3.mouse(this);
    d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + mouse[0] + "," + height;
        d += " " + mouse[0] + "," + 0;
        return d;
      });

    d3.selectAll(".mouse-per-line")
      .attr("transform", function(d, i) {
        console.log(width/mouse[0])


        var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

        while (true){
          target = Math.floor((beginning + end) / 2);
          pos = lines[i].getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
          }
          if (pos.x > mouse[0])      end = target;
          else if (pos.x < mouse[0]) beginning = target;
          else break; //position found
        }

        d3.select(this).select('text')
          .text(d.name);

        return "translate(" + mouse[0] + "," + pos.y +")";
      });
  });
}) ();

(function() {
d3.select("input[value=\"total\"]").property("checked", true);
    datasetTotal = [
        {label:"Round of 32", value:100},
        {label:"Sweet 16", value:86.7},
        {label:"Elite 8", value:69.5},
        {label:"Final 4", value:40.2},
        {label:"Championship Game", value:24.8},
        {label:"Won it all", value:15.5}
    ];

    datasetLast15Years = [
        {label:"Round of 32", value:100},
        {label:"Sweet 16", value:86.7},
        {label:"Elite 8", value:69.5},
        {label:"Final 4", value:40.2},
        {label:"Championship Game", value:24.8},
        {label:"Won it all", value:15.5}
    ];

    datasetOption2 = [
        {label:"Round of 32", value:100},
        {label:"Sweet 16", value:86.7},
        {label:"Elite 8", value:69.5},
        {label:"Final 4", value:40.2},
        {label:"Championship Game", value:24.8},
        {label:"Won it all", value:15.5}
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

var margin = {
    top: 20,
    right: 300,
    bottom: 30,
    left: 50
  },
  width = 1400 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

    var div = d3.select("#barlocation").append("div").attr("class", "toolTip");

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
                .text("% of 1 Seeds Advanced To");

        var bar = svg.selectAll(".bar")
                .data(dataset, function(d) { return d.label; });
        // new data:
        bar.enter().append("rect")
                .attr("class", "bar")
                .attr("x", function(d) { return x(d.label); })
                .attr("width", x.rangeBand())
                .style("fill", "#2980B9")
                .attr("height", 0)
                .transition()
                .duration(10000)
                .attr("y", function(d) { return y(d.value); })
                .attr("height", function(d) { return height - y(d.value); });





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
}) ()
