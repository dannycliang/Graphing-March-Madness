var myData = "Round	1st	2nd	3rd	4th	5th	6th	7th	8th	9th	10th	11th	12th	13th	14th	15th	16th\n\
Round of 64	100	94	84	80	64	64	61	50	50	39	36	36	20	16	6	0\n\
Round of 32	87	68	65	58	52	51	30	19	8	46	41	44	23	10	13	0\n\
Sweet 16	80	74	47	34	19	33	39	67	40	35	32	0	0	0	0	0\n\
Elite 8	58	47	45	65	75	21	22	63	50	13	50	0	0	0	0	0\n\
Final 4	61	46	67	23	40	67	50	40	0	0	0	0	0	0	0	0\n\
Championship	64	44	36	37	0	50	100	50	0	0	0	0	0	0	0	0\n\
";

var data = d3.tsv.parse(myData);

width = 1200 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;


var x = d3.scale.ordinal()
  .domain(["Round of 64", "Round of 32", "Sweet 16", "Elite 8", "Final 4", "Championship"])
  .rangePoints([0, width]);

var y = d3.scale.linear()
  .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
  .scale(x)
  .ticks(6)
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
    return y(d.WinRate);
  });



var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


color.domain(d3.keys(data[0]).filter(function(key) {
  return key !== "Round";
}));

var rounds = color.domain().map(function(name) {
  return {
    name: name,
    values: data.map(function(d) {
      return {
        Round: d.Round,
        WinRate: +d[name]
      };
    })
  };
});


y.domain([
  d3.min(rounds, function(c) {
    return d3.min(c.values, function(v) {
      return v.WinRate;
    });
  }),
  d3.max(rounds, function(c) {
    return d3.max(c.values, function(v) {
      return v.WinRate;
    });
  })
]);

var legend = svg.selectAll('g')
  .data(rounds)
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
  .attr("dy", ".71em")
  .style("text-anchor", "end")

var round = svg.selectAll(".round")
  .data(rounds)
  .enter().append("g")
  .attr("class", "round");

round.append("path")
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


var primary = svg.append("g")
  .attr("class", "mouse-over-effects");

primary.append('svg:rect') 
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function() {
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mouseover', function() { 
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function() {
    var mouse = d3.mouse(this);
    d3.selectAll(".mouse-per-line")
      .attr("transform", function(d, i) {
        console.log(width/mouse[0])
        var beginning = 0,
            end = lines[i].getTotalLength(),
            center = null;
        while (true) {
          center = Math.floor((beginning + end) / 2);
          place = lines[i].getPointAtLength(center);
          if ((center === end || center === beginning) && place.x !== mouse[0]) {
              break;
          }
          if (place.x > mouse[0]) {
          	end = center;
          } else if (place.x < mouse[0]) { 
          	beginning = center;
          } else {
          	break;
          }	
        }
        d3.select(this).select('text')
          .text(y.invert(place.y).toFixed(2));
        return "translate(" + mouse[0] + "," + place.y +")";
      });
  });

var lines = document.getElementsByClassName('line');

var secondary = primary.selectAll('.mouse-per-line')
  .data(rounds)
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

secondary.append("circle")
  .attr("r", 7)
  .style("stroke", function(d) {
    return color(d.name);
  })
  .style("fill", "none")
  .style("stroke-width", "1px")
  .style("opacity", "0");

secondary.append("text")
  .attr("transform", "translate(10,3)");


