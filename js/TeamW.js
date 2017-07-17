var myData = "Round	Kansas	Villanova	Duke	UNC	Arizona	Gonzaga	Kentucky	Florida	Louisville	Connecticut	Michigan State\n\
"Round of 64"	85.7	80	80	100	69.2	80	92.3	72.7	75	81.8	66.7	\n\
"Round of 32"	64.3	50	73.3	66.7	61.5	26.7	61.5	54.5	58.3	63.6	60	\n\
"Sweet 16"	50	30	26.7	58.3	38.5	6.7	53.8	54.5	50	54.5	40	\n\
"Elite 8"	21.4	20	20	33.3	0	0	30.8	27.3	33.3	36.4	26.7\n\
"Final 4"	21.4	10	13.3	25	0	0	15.4	18.2	8.3	27.3	6.7\n\
"Championship Game"	7.1	10	13.3	16.7	0	0	7.7	18.2	8.3	27.3	0\n\
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
    .domain(["Round of 64", "Round of 32", "Sweet 16", "Elite 8", "Final 4", "Championship Game"])
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

( function() {
const color = d3.scale.category20c()
var dat = [ { label: '1 seed', b: 1.64 },
            { label: '2 seed', b: 0.85 },
            { label: '3 seed', b: 0.45 },
            { label: '4 seed', b: 0.39 },
            { label: '5 seed', b: 0.18 },
            { label: '6 seed', b: 0.09 },
            { label: '7 seed', b: 0.09 },
            { label: '8 seed', b: 0.15 },
            { label: '9 seed', b: 0.03 },
            { label: '10 seed', b: 0.03 },
            { label: '11 seed', b: 0.09 },
            { label: '12 seed', b: 0 },
            { label: '13 seed', b: 0 },
            { label: '14 seed', b: 0 },
            { label: '15 seed', b: 0 },
            { label: '16 seed', b: 0 },
            ];

var svg = d3.select('body')
              .append('svg')
              .attr('width', 300)
              .attr('height', 300)
              .append('g')
              .attr('transform', 'translate(' + (150) + ',' + (150) + ')');

            var arc = d3.svg.arc()
              .innerRadius(0)
              .outerRadius(150);

            var pie = d3.layout.pie()
              .value(function(d) { return d.b; })


            var path = svg.selectAll('path')
              .data(pie(dat))
              .enter()
              .append('path')
              .attr('d', arc)
              .attr('fill', function(d) {
                return color(d.data.label);
              });

}) ();