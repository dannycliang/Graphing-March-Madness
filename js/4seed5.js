(function() {
var myData = "Round	13-5-1-2	13-5-1-3/7	13-5-1-6	13-5-8-7	13-5-9-6\n\
Round of 64	80.3	80.3	80.3	80.3	80.3\n\
Round of 32	55.7	55.7	55.7	55.7	55.7\n\
Sweet 16	25.8	25.8	25.8	28.6	100.0\n\
Elite 8	66.7	100.0	50.0	0.0	100.0\n\
";

var margin = {
    top: 20,
    right: 300,
    bottom: 30,
    left: 50
  },
  width = 1400 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(["Round of 64", "Round of 32", "Sweet 16", "Elite 8"])
    .rangePoints([0, width]);



var y = d3.scale.linear()
  .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
  .scale(x)
  .ticks(4)
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
    return y(d.temperature);
  });



var svg = d3.select("body").append("svg")

  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = d3.tsv.parse(myData);

color.domain(d3.keys(data[0]).filter(function(key) {
  return key !== "Round";
}));


var cities = color.domain().map(function(name) {
  return {
    name: name,
    values: data.map(function(d) {
      return {
        Round: d.Round,
        temperature: +d[name]
      };
    })
  };
});


y.domain([
  0, 100
]);

var legend = svg.selectAll('g')
  .data(cities)
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

var city = svg.selectAll(".city")
  .data(cities)
  .enter().append("g")
  .attr("class", "city");



city.append("path")
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
          .style('opacity', 0)
          .remove()
      });

    t.select('rect.curtain')
      .attr('width', 0);

city.append("text")
  .datum(function(d) {
    return {
      name: d.name,
      value: d.values[d.values.length - 1]
    };
  })
  .attr("transform", function(d) {
    return "translate(" + x(d.value.Round) + "," + y(d.value.temperature) + ")";
  })
  .attr("x", 4)
  .attr("dy", ".35em")


var mouseG = svg.append("g")
  .attr("class", "mouse-over-effects");

mouseG.append("path") // this is the black vertical line to follow mouse
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");

var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(cities)
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
  .style("opacity", "0");

mousePerLine.append("text")
  .attr("transform", "translate(10,3)");

mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
  .attr('width', width) // can't catch mouse events on a g element
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function() { // on mouse out hide line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mouseover', function() { // on mouse in show line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function() { // mouse moving over canvas
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
var myData = "Round	13-12-1-2	13-12-1-3	13-12-1-7	13-12-1-10	13-12-8-2/10	13-12-9-3\n\
Round of 64	80.3	80.3	80.3	80.3	80.3	80.3\n\
Round of 32	66.7	66.7	66.7	66.7	66.7	66.7\n\
Sweet 16	33.3	33.3	33.3	33.3	100.0	100.0\n\
Elite 8	50.0	66.7	0.0	100.0	100.0	0.0\n\
";


var margin = {
    top: 20,
    right: 300,
    bottom: 30,
    left: 50
  },
  width = 1400 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .domain(["Round of 64", "Round of 32", "Sweet 16", "Elite 8"])
    .rangePoints([0, width]);



var y = d3.scale.linear()
  .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
  .scale(x)
  .ticks(4)
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
    return y(d.temperature);
  });



var svg = d3.select("body").append("svg")

  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = d3.tsv.parse(myData);

color.domain(d3.keys(data[0]).filter(function(key) {
  return key !== "Round";
}));



var cities = color.domain().map(function(name) {
  return {
    name: name,
    values: data.map(function(d) {
      return {
        Round: d.Round,
        temperature: +d[name]
      };
    })
  };
});


y.domain([
  0, 100
]);

var legend = svg.selectAll('g')
  .data(cities)
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

var city = svg.selectAll(".city")
  .data(cities)
  .enter().append("g")
  .attr("class", "city");



city.append("path")
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
          .style('opacity', 0)
          .remove()
      });

    t.select('rect.curtain')
      .attr('width', 0);

city.append("text")
  .datum(function(d) {
    return {
      name: d.name,
      value: d.values[d.values.length - 1]
    };
  })
  .attr("transform", function(d) {
    return "translate(" + x(d.value.Round) + "," + y(d.value.temperature) + ")";
  })
  .attr("x", 4)
  .attr("dy", ".35em")


var mouseG = svg.append("g")
  .attr("class", "mouse-over-effects");

mouseG.append("path") // this is the black vertical line to follow mouse
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");

var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(cities)
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
  .style("opacity", "0");

mousePerLine.append("text")
  .attr("transform", "translate(10,3)");


mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
  .attr('width', width) // can't catch mouse events on a g element
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function() { // on mouse out hide line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mouseover', function() { // on mouse in show line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function() { // mouse moving over canvas
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
        {label:"Round of 32", value:79.7},
        {label:"Sweet 16", value:46.6},
        {label:"Elite 8", value:15.6},
        {label:"Final 4", value:10.2},
        {label:"Championship Game", value:2.3},
        {label:"Won it all", value:0.8}
    ];

    datasetLast15Years = [
        {label:"Round of 32", value:79.7},
        {label:"Sweet 16", value:46.6},
        {label:"Elite 8", value:15.6},
        {label:"Final 4", value:10.2},
        {label:"Championship Game", value:2.3},
        {label:"Won it all", value:0.8}
    ];

    datasetOption2 = [
        {label:"Round of 32", value:79.7},
        {label:"Sweet 16", value:46.6},
        {label:"Elite 8", value:15.6},
        {label:"Final 4", value:10.2},
        {label:"Championship Game", value:2.3},
        {label:"Won it all", value:0.8}
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
                .style("fill", "#00868b")
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
}) ();
