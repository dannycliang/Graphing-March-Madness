var myDataa = "Round	1st	2nd	3rd	4th	5th	6th	7th	8th	9th	10th	11th	12th	13th	14th	15th	16th\n\
Round of 64	4	4	4	4	4	4	4	4	4	4	4	4	4	4	4	4\n\
Round of 32	4	3.76	3.36	3.2	2.56	2.56	2.44	2	2	1.56	1.44	1.44	0.8	0.64	0.24	0\n\
Sweet 16	3.48	2.56	2.18	1.86	1.33	1.33	0.72	0.38	0.16	0.71	0.59	0.64	0.18	0.06	0.03	0\n\
Elite 8	2.78	1.89	1.02	0.63	0.25	0.44	0.28	0.25	0.06	0.248	0.19	0	0	0	0	0\n\
Final 4	1.61	0.89	0.46	0.41	0.19	0.09	0.06	0.16	0.03	0.03	0.09	0	0	0	0	0\n\
Championship Game	0.98	0.41	0.3	0.09	0.08	0.06	0.03	0.1	0	0	0	0	0	0	0	0\n\
Champions	0.62	0.18	0.11	0.03	0	0.03	0.03	0	0	0	0	0	0	0	0	0\n\
";



var margin = {
    top: 20,
    right: 80,
    bottom: 30,
    left: 50
  },
  width = 1200 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;


var x = d3.scale.ordinal()
    .domain(["Round of 64", "Round of 32", "Sweet 16", "Elite 8", "Final 4", "Championship Game", "Champions"])
    .rangePoints([0, width]);


var y = d3.scale.linear()
  .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
  .scale(x)
  .ticks(7)
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

var data = d3.tsv.parse(myDataa);

color.domain(d3.keys(data[0]).filter(function(key) {
  return key !== "Round";
}));

data.forEach(function(d) {
  d.Round = d.Round;
});

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
  d3.min(cities, function(c) {
    return d3.min(c.values, function(v) {
      return v.temperature;
    });
  }),
  d3.max(cities, function(c) {
    return d3.max(c.values, function(v) {
      return v.temperature;
    });
  })
]);

var legend = svg.selectAll('g')
  .data(cities)
  .enter()
  .append('g')
  .attr('class', 'legend');

legend.append('rect')
  .attr('x', width + 30)
  .attr('y', function(d, i) {
    return i * 20;
  })
  .attr('width', 10)
  .attr('height', 10)
  .style('fill', function(d) {
    return color(d.name);
  });

legend.append('text')
  .attr('x', width + 50)
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
  .attr("dy", "-3em")
  .attr("dx", "-12.9em")
  .style("text-anchor", "end")
  .text("# Advanced to");

var city = svg.selectAll(".city")
  .data(cities)
  .enter().append("g")
  .attr("class", "city");



var pathLine = city.append("path")
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
  .duration(6000)
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
  .text(function(d) {
    return d.name;
  });

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
          .text(y.invert(pos.y).toFixed(2));

        return "translate(" + mouse[0] + "," + pos.y +")";
      });
  });
