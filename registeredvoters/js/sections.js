
/**
 * scrollVis - encapsulates
 * all the code for the visualization
 * using reusable charts pattern:
 * http://bost.ocks.org/mike/chart/
 */
var scrollVis = function () {
  // constants to define the size
  // and margins of the vis area.
  var width = 600;
  var height = 520;
  var margin = { top: 0, left: 30, bottom: 40, right: 10 };

  // Keep track of which visualization
  // we are on and which was the last
  // index activated. When user scrolls
  // quickly, we want to call all the
  // activate functions that they pass.
  var lastIndex = -1;
  var activeIndex = 0;



  // New code by mahdi


   /* var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .paddingInner(0.1);

    var x1 = d3.scaleBand()
        .padding(0.05);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);*/



    var x0 = d3.scaleBand()
        .rangeRound([0, width])
        .padding(0.1);

    var x1 = d3.scaleLinear();

    var y = d3.scaleLinear()
        .range([height, 40]);

    var xAxis = d3.axisBottom(x0)

    var yAxis = d3.axisLeft(y);

    var color = d3.scaleOrdinal()
        .range(["#BBDEFB","#005288"]);




    /* d3.json("data/cat.json", function(error, data) {

        var categoriesNames = data.map(function(d) { return d.categorie; });
        var rateNames = data[0].values.map(function(d) { return d.rate; });

        x0.domain(categoriesNames);
        x1.domain(rateNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .style('opacity','0')
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 4)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-weight','bold')
            .text("Value");

        svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

        var slice = svg.selectAll(".slice")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform",function(d) { return "translate(" + x0(d.categorie) + ",0)"; });

        slice.selectAll("rect")
            .data(function(d) { return d.values; })
            .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.rate); })
            .style("fill", function(d) { return color(d.rate) })
            .attr("y", function(d) { return y(0); })
            .attr("height", function(d) { return height - y(0); })
            .on("mouseover", function(d) {
                d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", color(d.rate));
            });

        slice.selectAll("rect")
            .transition()
            .delay(function (d) {return Math.random()*1000;})
            .duration(1000)
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); });

        //Legend
        var legend = svg.selectAll(".legend")
            .data(data[0].values.map(function(d) { return d.rate; }).reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
            .style("opacity","0");

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", function(d) { return color(d); });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {return d; });

        legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");

    }); */


    // End of new code

  // Sizing for the grid visualization
  var squareSize = 48;
  var squarePad = 2;
  // var numPerRow = width / (squareSize + squarePad);
    var numPerRow = 10;

  // main svg used for visualization
  var svg = null;

  // d3 selection that will be used
  // for displaying visualizations
  var g = null;

  // We will set the domain when the
  // data is processed.
  // @v4 using new scale names
  var xBarScale = d3.scaleLinear()
    .range([0, width]);

  // The bar chart display is horizontal
  // so we can use an ordinal scale
  // to get width and y locations.
  // @v4 using new scale type
  var yBarScale = d3.scaleBand()
    .paddingInner(0.08)
    .domain([0, 1, 2, 3])
    .range([0, height - 50], 0.1, 0.1, 0.1);

  // Color is determined just by the index of the bars
  var barColors = { 1: '#0096D6', 2: '#87b2d3', 3: '#BBDEFB' , 0: '#005288'};

  // The histogram display shows the
  // first 30 minutes of data
  // so the range goes from 0 to 30
  // @v4 using new scale name
  /*var xHistScale = d3.scaleOrdinal()
    .domain('18-24','25-34','35-50', 'Past 50')
      .range([0, width - 20]);*/

    //.range([0, width - 20]);

  // @v4 using new scale name
  /*var yHistScale = d3.scaleLinear()
    .range([height, 0]);*/

    var yHistScale = d3.scaleLinear()
     .range([height,0]);

  // The color translation uses this
  // scale to convert the progress
  // through the section into a
  // color value.
  // @v4 using new scale name
  var coughColorScale = d3.scaleLinear()
    .domain([0, 1.0])
    .range(['#BBDEFB', 'red']);

  // You could probably get fancy and
  // use just one axis, modifying the
  // scale, but I will use two separate
  // ones to keep things easy.
  // @v4 using new axis name
  var xAxisBar = d3.axisBottom()
    .scale(xBarScale);

  // @v4 using new axis name
 /* var xAxisHist = d3.axisBottom()
    .scale(xHistScale)
    .tickFormat(function (d) { return d + ' y/o'; });*/

  // When scrolling to a new section
  // the activation function for that
  // section is called.
  var activateFunctions = [];
  // If a section has an update function
  // then it is called while scrolling
  // through the section with the current
  // progress through the section.
  var updateFunctions = [];

  /**
   * chart
   *
   * @param selection - the current d3 selection(s)
   *  to draw the visualization in. For this
   *  example, we will be drawing it in #vis
   */
  var chart = function (selection) {
    selection.each(function (rawData) {
      // create svg and give it a width and height
     svg = d3.select(this).selectAll('svg').data([wordData]);
      var svgE = svg.enter().append('svg');
      // @v4 use merge to combine enter and existing selection
      svg = svg.merge(svgE);

       svg.attr('width', '100%')
        .attr('height', '100%')
           .attr('viewBox', '0 0 ' + 630 + ' ' + 560);
      //svg.attr('width', width + margin.left + margin.right);
      //svg.attr('height', height + margin.top + margin.bottom);



        svg.append('g');


      // this group element will be used to contain all
      // other elements.
      g = svg.select('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // perform some preprocessing on raw data
      var wordData = getWords(rawData);
      // filter to just include filler words
        var fillerWords1 = getFillerWords1(wordData);
        var fillerWords2 = getFillerWords2(wordData);
        var fillerWords3 = getFillerWords3(wordData);
        var fillerWords4 = getFillerWords4(wordData);


        // get the counts of filler words for the
      // bar chart display
      var fillerCounts = groupByWord(wordData);

       // var fillerCounts = [297978,1233465,3443834]

      // set the bar scale's domain
      var countMax = d3.max(fillerCounts, function (d) { return d.value;});
      xBarScale.domain([0, countMax]);

      // get aggregated histogram data

     /* var histData = getHistogram(rawData);
      // set histogram's domain
      var histMax = d3.max(histData, function (d) { return d.length; });
      yHistScale.domain([0, histMax]);*/
     var histData = []

      setupVis(wordData, fillerCounts, histData);

      setupSections();
    });
  };


  /**
   * setupVis - creates initial elements for all
   * sections of the visualization.
   *
   * @param wordData - data object for each word.
   * @param fillerCounts - nested data that includes
   *  element for each filler word type.
   * @param histData - binned histogram data
   */
  var setupVis = function (wordData, fillerCounts, histData) {
    // axis
    g.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxisBar);
    g.select('.x.axis').style('opacity', 0);

    // count openvis title
    g.append('text')
      .attr('class', 'title openvis-title')
      .attr('x', width / 2)
      .attr('y', height / 3)
      .text('2018');

    g.append('text')
      .attr('class', 'sub-title openvis-title')
      .attr('x', width / 2)
      .attr('y', (height / 3) + (height / 5))
      .text('Municipal');

      g.append('text')
          .attr('class', 'sub-title openvis-title')
          .attr('x', width / 2)
          .attr('y', (height / 3) + (height / 2.5))
          .text('Elections');

    g.selectAll('.openvis-title')
      .attr('opacity', 0);

    // count filler word count title
    g.append('text')
          .attr('class', 'title count-title highlight')
          .attr('x', width / 2)
          .attr('y', height / 3)
          .text('5,377,849');

      g.append('text')
          .attr('class', 'sub-title count-title')
          .attr('x', width / 2)
          .attr('y', (height / 3) + (height / 5))
          .text('Registered Voters');

      g.selectAll('.count-title')
          .attr('opacity', 0);


      //new title at the end

      g.append('text')
          .attr('class', 'title count-title2 highlight')
          .attr('x', width / 2)
          .attr('y', height / 3)
          .text("VOTE!");

      g.append('text')
          .attr('class', 'sub-title count-title2')
          .attr('x', width / 2)
          .attr('y', (height / 3) + (height / 5))
          .text('The future is yours!');

      g.selectAll('.count-title2')
          .attr('opacity', 0);

    // square grid
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    var squares = g.selectAll('.square').data(wordData, function (d) { return d; });
    var squaresE = squares.enter()
      .append('rect')
      .classed('square', true);
    squares = squares.merge(squaresE)
      .attr('width', squareSize)
      .attr('height', squareSize)
      .attr('fill', '#005288')
      .classed('fill-square', function (d) { return d; })
      .attr('x', function (d) { return d.x;})
      .attr('y', function (d) { return d.y;})



        /*  .attr('width', squareSize)
          .attr('height', squareSize)
          .attr('fill', function (d) {
             if (d.filler1)
               return '#fff'
              if (d.filler2)
                return ''
              if (d.filler3)
                return ''
              if (d.filler4)
                return ''
          })
          .classed('fill-square', function (d) { return (d.filler3||d.filler2); })
          .attr('x', function (d) { return d.x;})
          .attr('y', function (d) { return d.y;})*/
          .attr('opacity', 0);

    // barchart
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    var bars = g.selectAll('.bar').data(fillerCounts);
    var barsE = bars.enter()
      .append('rect')
      .attr('class', 'bar');
    bars = bars.merge(barsE)
      .attr('x', 0)
      .attr('y', function (d, i) { return yBarScale(i);})
      .attr('fill', function (d, i) { return barColors[i]; })
      .attr('width', 0)
      .attr('height', yBarScale.bandwidth());

    var barText = g.selectAll('.bar-text').data(fillerCounts);
    barText.enter()
      .append('text')
      .attr('class', 'bar-text')
      .text(function (d) { return d.key ; })
      .attr('x', 0)
      .attr('dx', 15)
      .attr('y', function (d, i) { return yBarScale(i);})
      .attr('dy', yBarScale.bandwidth() / 1.2)
      .style('font-size', '40px')
      .attr('fill', 'white')
      .attr('opacity', 0);



    // histogram
    // @v4 Using .merge here to ensure
    // new and old data have same attrs applied
    /* var hist = g.selectAll('.hist').data(histData);
    var histE = hist.enter().append('rect')
      .attr('class', 'hist'); */
    /*hist = hist.merge(histE).attr('x', function (d) { return xHistScale(d.x0); })
      .attr('y', height)
      .attr('height', 0)
      .attr('width', xHistScale(histData[0].x1) - xHistScale(histData[0].x0) - 1)
      .attr('fill', barColors[0])
      .attr('opacity', 0); */

        /*      hist = hist.merge(histE).attr('x', function (d){return d.age})
          .attr('y', 520)
          .attr('height', 0)
          .attr('width', 20)
          .attr('fill', barColors[0])
          .attr('opacity', 0); */

    /* // cough title
    g.append('text')
      .attr('class', 'sub-title cough cough-title')
      .attr('x', width / 2)
      .attr('y', 60)
      .text('Peak start')
      .attr('opacity', 0);

    // arrowhead from
    // http://logogin.blogspot.com/2013/02/d3js-arrowhead-markers.html
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('refY', 2)
      .attr('markerWidth', 6)
      .attr('markerHeight', 4)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M 0,0 V 4 L6,2 Z');

    g.append('path')
      .attr('class', 'cough cough-arrow')
      .attr('marker-end', 'url(#arrowhead)')
      .attr('d', function () {
        var line = 'M ' + ((width / 2) - 10) + ' ' + 80;
        line += ' l 0 ' + 230;
        return line;
      })
      .attr('opacity', 0); */
  };

  /**
   * setupSections - each section is activated
   * by a separate function. Here we associate
   * these functions to the sections based on
   * the section's index.
   *
   */
  var setupSections = function () {
    // activateFunctions are called each
    // time the active section changes
    activateFunctions[0] = showTitle;
    activateFunctions[1] = showFillerTitle;
    activateFunctions[2] = showGrid;
    activateFunctions[3] = highlightGrid;
    activateFunctions[4] = highlightGrid2;
    activateFunctions[5] = highlightGrid3;
    activateFunctions[6] = highlightGrid4;
    activateFunctions[7] = showBar;
    activateFunctions[8] = testing;
    activateFunctions[9] = sweetEnd;
    activateFunctions[10] = noth;
    activateFunctions[11] = noth;
	
	function noth(){
		
	}

    // updateFunctions are called while
    // in a particular section to update
    // the scroll progress in that section.
    // Most sections do not need to be updated
    // for all scrolling and so are set to
    // no-op functions.
    for (var i = 0; i < 11; i++) {
      updateFunctions[i] = function () {};
    }
    //updateFunctions[7] = updateCough;
  };

  /**
   * ACTIVATE FUNCTIONS
   *
   * These will be called their
   * section is scrolled to.
   *
   * General pattern is to ensure
   * all content for the current section
   * is transitioned in, while hiding
   * the content for the previous section
   * as well as the next section (as the
   * user may be scrolling up or down).
   *
   */

  /**
   * showTitle - initial title
   *
   * hides: count title
   * (no previous step to hide)
   * shows: intro title
   *
   */
  function showTitle() {
    g.selectAll('.count-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.openvis-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
  }


  function sweetEnd(){
          hideAxis();

          svg.selectAll('.legend')
              .transition()
              .duration(500)
              .attr('opacity', 0);

          svg.selectAll('.x_axis')
              .transition()
              .duration(300)
              .attr('opacity', 0);
          svg.selectAll('.y_axis')
              .transition()
              .duration(300)
              .attr('opacity', 0);

          svg.selectAll(".homie")
              .transition()
              .duration(500)
              .attr("height", 0)

      g.selectAll('.count-title2')
          .transition()
          .duration(800)
          .attr('opacity', 1.0);
  }

  /**
   * showFillerTitle - filler counts
   *
   * hides: intro title
   * hides: square grid
   * shows: filler count title
   *
   */
  function showFillerTitle() {
    g.selectAll('.openvis-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.square')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.count-title')
      .transition()
      .duration(600)
      .attr('opacity', 1.0);
  }

  /**
   * showGrid - square grid
   *
   * hides: filler count title
   * hides: filler highlight in grid
   * shows: square grid
   *
   */
  function showGrid() {
    g.selectAll('.count-title')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.square')
      .transition()
      .duration(600)
      .delay(function (d) {
        return 5 * d.row;
      })
      .attr('opacity', 1.0)
      .attr('fill', '#ddd');
  }

  /**
   * highlightGrid - show fillers in grid
   *
   * hides: barchart, text and axis
   * shows: square grid and highlighted
   *  filler words. also ensures squares
   *  are moved back to their place in the grid
   */
  function highlightGrid() {
    hideAxis();
    g.selectAll('.bar')
      .transition()
      .duration(600)
      .attr('width', 0);

    g.selectAll('.bar-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);


    g.selectAll('.square')
      .transition()
      .duration(0)
      .attr('opacity', 1.0)
      .attr('fill', '#ddd');

    // use named transition to ensure
    // move happens even if other
    // transitions are interrupted.
    g.selectAll('.fill-square')
      .transition('move-fills')
      .duration(800)
      .attr('x', function (d) {
        return d.x;
      })
      .attr('y', function (d) {
        return d.y;
      });

    g.selectAll('.fill-square')
      .transition()
      .duration(800)
      .attr('opacity', 1.0)
      .attr('fill', function (d) { return d.filler1 ? '#BBDEFB' : '#ddd'; });
  }



  function testing() {

      g.selectAll('.count-title2')
          .transition()
          .duration(0)
          .attr('opacity', 0);
      g.selectAll('.bar-text')
          .transition()
          .duration(0)
          .attr('opacity', 0);

      g.selectAll('.bar')
          .transition()
          .duration(600)
          .attr('width', 0);


      var data =  [
          {
              "categorie": "18-24",
              "values": [
                  {
                      "value": 458237,
                      "rate": "Registered"
                  },
                  {
                      "value": 1380272,
                      "rate": "Eligible"
                  }
              ]
          },
          {
              "categorie": "25-34",
              "values": [
                  {
                      "value": 1337098,
                      "rate": "Registered"
                  },
                  {
                      "value": 1948441,
                      "rate": "Eligible"
                  }
              ]
          },
          {
              "categorie": "35-50",
              "values": [
                  {
                      "value": 1638586,
                      "rate": "Registered"
                  },
                  {
                      "value": 2262650,
                      "rate": "Eligible"
                  }
              ]
          },
          {
              "categorie": "Past 50",
              "values": [
                  {
                      "value": 1943928,
                      "rate": "Registered"
                  },
                  {
                      "value": 2511399,
                      "rate": "Eligible"
                  }
              ]
          }
      ];

          var categoriesNames = data.map(function(d) { return d.categorie; });
          var rateNames = data[0].values.map(function(d) { return d.rate; });
      hideAxis();

          x0.domain(categoriesNames);
          x1.domain(rateNames);
          y.domain([0, d3.max(data, function(categorie) { return d3.max(categorie.values, function(d) { return d.value; }); })]);

          svg.append("g")
              .attr("class", "x_axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y_axis")
              .attr('opacity','0')
			  .attr("transform", "translate(30,0)")
              .call(yAxis)
              .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 4)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .style('font-weight','bold')
              .text("Value");

          svg.select('.y_axis').transition().duration(500).delay(1300).attr('opacity','1');

          var slice = svg.selectAll(".slice")
              .data(data)
              .enter().append("g")
              .attr("class", "g")
              .attr("transform",function(d) { return "translate(" + x0(d.categorie) + ",0)"; });

   /*   var tip = d3.tip()
          .attr('class', 'd3-tip')
          .offset([-10, 0])
          .html(function(d) {
              return "<strong>Nombre:</strong> <span style='color:red'>" + d.values["rate"]+ "</span>";
          }) */


          //.html(function(d) {
          //    return "<strong>Nombre:</strong> <span style='color:red'>" + d.rate+ "</span>";})




          slice.selectAll("rect")
              .data(function(d) { return d.values; })
              .enter().append("rect")
              .attr("width", 40)
              .attr("class", "homie")
              //.attr("width", x1.bandwidth())
              //.attr("x", function(d) { return x1(d.rate); })
              .attr("x", function(d) { if (d.rate === 'Registered') return 25 ;
              return 65;
              })
              .style("fill", function(d) {

                  return color(d.rate) })
              .attr("y", function(d) { return y(0); })
              .attr("height", function(d) { return height - y(0); })
              .on("mouseover", function(d) {
                  d3.select(this).style("fill", d3.rgb(color(d.rate)).darker(2));
                  tip.show(d);
              })
              .on("mouseout", function(d) {
                  d3.select(this).style("fill", color(d.rate));
                  tip.hide(d);
              });

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return d.value;
            })

      svg.call(tip);


          slice.selectAll("rect")
              .transition()
              .delay(function (d) {return Math.random()*1000;})
              .duration(1000)
              .attr("y", function(d) { return y(d.value); })
              .attr("height", function(d) { return height - y(d.value); });

          //Legend
          var legend = svg.selectAll(".legend")
              .data(data[0].values.map(function(d) { return d.rate; }).reverse())
              .enter().append("g")
              .attr("class", "legend")
              .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
              .attr("opacity","0")

          legend.append("rect")
              .attr("x", width - 18)
              .attr("width", 18)
              .attr("height", 18)
              .style("fill", function(d) { return color(d); });

          legend.append("text")
              .attr("x", width - 24)
              .attr("y", 9)
              .attr("dy", ".35em")
              .style("text-anchor", "end")
              .text(function(d) {return d; });

          svg.selectAll(".legend")
              .transition()
              .duration(500)
              .attr("opacity","1");

          //legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).attr("opacity","1");
  }


    function highlightGrid2() {
        hideAxis();
        g.selectAll('.bar')
            .transition()
            .duration(600)
            .attr('width', 0);

        g.selectAll('.bar-text')
            .transition()
            .duration(0)
            .attr('opacity', 0);


        g.selectAll('.square')
            .transition()
            .duration(0)
            .attr('opacity', 1.0)

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.fill-square')
            .transition('move-fills')
            .duration(800)
            .attr('x', function (d) {
                return d.x;
            })
            .attr('y', function (d) {
                return d.y;
            });

        g.selectAll('.fill-square')
            .transition()
            .duration(800)
            .attr('opacity', 1.0)
            .attr('fill', function (d) {

                if (d.filler1)
                    return '#BBDEFB'
              if (d.filler2)
                return '#87b2d3'

                else
              return '#ddd';
            });
    }


    function highlightGrid3() {
        hideAxis();
        g.selectAll('.bar')
            .transition()
            .duration(600)
            .attr('width', 0);

        g.selectAll('.bar-text')
            .transition()
            .duration(0)
            .attr('opacity', 0);


        g.selectAll('.square')
            .transition()
            .duration(0)
            .attr('opacity', 1.0)

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.fill-square')
            .transition('move-fills')
            .duration(800)
            .attr('x', function (d) {
                return d.x;
            })
            .attr('y', function (d) {
                return d.y;
            });

        g.selectAll('.fill-square')
            .transition()
            .duration(800)
            .attr('opacity', 1.0)
            .attr('fill', function (d) {

                if (d.filler1)
                    return '#BBDEFB'
                if (d.filler2)
                    return '#87b2d3'
                if (d.filler3)
                    return '#0096D6'
                else
                    return '#ddd';
            });
    }



    function highlightGrid4() {
        hideAxis();
        g.selectAll('.bar')
            .transition()
            .duration(600)
            .attr('width', 0);

        g.selectAll('.bar-text')
            .transition()
            .duration(0)
            .attr('opacity', 0);


        g.selectAll('.square')
            .transition()
            .duration(0)
            .attr('opacity', 1.0)

        // use named transition to ensure
        // move happens even if other
        // transitions are interrupted.
        g.selectAll('.fill-square')
            .transition('move-fills')
            .duration(800)
            .attr('x', function (d) {
                return d.x;
            })
            .attr('y', function (d) {
                return d.y;
            });

        g.selectAll('.fill-square')
            .transition()
            .duration(800)
            .attr('opacity', 1.0)
            .attr('fill', function (d) {

                if (d.filler1)
                    return '#BBDEFB'
                if (d.filler2)
                    return '#87b2d3'
                if (d.filler3)
                    return '#0096D6'
                if (d.filler4)
                    return '#005288'
                else
                    return '#ddd';
            });
    }



  /**
   * showBar - barchart
   *
   * hides: square grid
   * hides: histogram
   * shows: barchart
   *
   */
  function showBar() {
    // ensure bar axis is set
      hideAxis();
    showAxis(xAxisBar);

      svg.selectAll('.legend')
          .transition()
          .duration(500)
          .attr('opacity', 0);

      svg.selectAll('.x_axis')
          .transition()
          .duration(300)
          .attr('opacity', 0);
      svg.selectAll('.y_axis')
          .transition()
          .duration(300)
          .attr('opacity', 0);

      svg.selectAll(".homie")
          .transition()
          .duration(1000)
          .attr("width", 0)


          //.attr("y", function(d) { return 0; })
          //.attr("height", function(d) { return 0; });

     /* svg.selectAll('.homie')
          .transition()
          .duration(500)
          .attr('opacity', 0);*/

    g.selectAll('.square')
      .transition()
      .duration(800)
      .attr('opacity', 0);

    g.selectAll('.fill-square')
      .transition()
      .duration(800)
      .attr('x', 0)
      .attr('y', function (d, i) {
        return yBarScale(i % 3) + yBarScale.bandwidth() / 2;
      })
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.rect')
      .transition()
      .duration(600)
      .attr('height', function () { return 0; })
      .attr('y', function () { return height; })
      .style('opacity', 0);

    g.selectAll('.bar')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('width', function (d) { return xBarScale(d.value); });

    g.selectAll('.bar-text')
      .transition()
      .duration(600)
      .delay(1200)
      .attr('opacity', 1);
  }

  /**
   * showHistPart - shows the first part
   *  of the histogram of filler words
   *
   * hides: barchart
   * hides: last half of histogram
   * shows: first half of histogram
   *
   */
  function showHistPart() {
    // switch the axis to histogram one
    showAxis(xAxisHist);

    g.selectAll('.bar-text')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    g.selectAll('.bar')
      .transition()
      .duration(600)
      .attr('width', 0);

    // here we only show a bar if
    // it is before the 15 minute mark
    /* g.selectAll('.hist')
      .transition()
      .duration(600)
      .attr('y', function (d) { return (d.x0 < 15) ? yHistScale(d.length) : height; })
      .attr('height', function (d) { return (d.x0 < 15) ? height - yHistScale(d.length) : 0; })
      .style('opacity', function (d) { return (d.x0 < 15) ? 1.0 : 1e-6; }); */

      g.selectAll('.hist')
          .transition()
          .duration(600)
          .attr('y', function(d){ return yHistScale(d.size); })
          .attr('height', function (d) { return height - yHistScale(d.size)})
          .style('opacity', 1.0);
  }

  /**
   * showHistAll - show all histogram
   *
   * hides: cough title and color
   * (previous step is also part of the
   *  histogram, so we don't have to hide
   *  that)
   * shows: all histogram bars
   *
   */
  function showHistAll() {
    // ensure the axis to histogram one
    showAxis(xAxisHist);

    g.selectAll('.cough')
      .transition()
      .duration(0)
      .attr('opacity', 0);

    // named transition to ensure
    // color change is not clobbered
    g.selectAll('.hist')
      .transition('color')
      .duration(500)
      .style('fill', '#BBDEFB');

    g.selectAll('.hist')
      .transition()
      .duration(1200)
      .attr('y', function (d) { return yHistScale(d.size); })
      .attr('height', function (d) { return height - yHistScale(d.size); })
      .style('opacity', 1.0);
  }

  /**
   * showCough
   *
   * hides: nothing
   * (previous and next sections are histograms
   *  so we don't have to hide much here)
   * shows: histogram
   *
   */
  function showCough() {
    // ensure the axis to histogram one
    showAxis(xAxisHist);

    g.selectAll('.hist')
      .transition()
      .duration(600)
      .attr('y', function (d) { return yHistScale(d.size); })
      .attr('height', function (d) { return height - yHistScale(d.size); })
      .style('opacity', 1.0);
  }

  /**
   * showAxis - helper function to
   * display particular xAxis
   *
   * @param axis - the axis to show
   *  (xAxisHist or xAxisBar)
   */
  function showAxis(axis) {
    g.select('.x.axis')
      .call(axis)
      .transition().duration(500)
      .style('opacity', 1);
  }

  /**
   * hideAxis - helper function
   * to hide the axis
   *
   */
  function hideAxis() {
    g.select('.x.axis')
      .transition().duration(500)
      .style('opacity', 0);

      g.select('.x axis')
          .transition().duration(500)
          .style('opacity', 0);
  }

  /**
   * UPDATE FUNCTIONS
   *
   * These will be called within a section
   * as the user scrolls through it.
   *
   * We use an immediate transition to
   * update visual elements based on
   * how far the user has scrolled
   *
   */

  /**
   * updateCough - increase/decrease
   * cough text and color
   *
   * @param progress - 0.0 - 1.0 -
   *  how far user has scrolled in section
   */
  function updateCough(progress) {
    g.selectAll('.cough')
      .transition()
      .duration(0)
      .attr('opacity', progress);

    g.selectAll('.hist')
      .transition('cough')
      .duration(0)
      .style('fill', function (d) {
        return (d.x0 >= 14) ? coughColorScale(progress) : '#BBDEFB';
      });
  }

  /**
   * DATA FUNCTIONS
   *
   * Used to coerce the data into the
   * formats we need to visualize
   *
   */

  /**
   * getWords - maps raw data to
   * array of data objects. There is
   * one data object for each word in the speach
   * data.
   *
   * This function converts some attributes into
   * numbers and adds attributes used in the visualization
   *
   * @param rawData - data read in from file
   */
  function getWords(rawData) {
    return rawData.map(function (d, i) {
      // is this word a filler word?
      d.filler1 = (d.filler === '1') ? true : false;
      d.filler2 = (d.filler === '2') ? true : false;
      d.filler3 = (d.filler === '3') ? true : false;
      d.filler4 = (d.filler === '4') ? true : false;

        d.min = Math.floor(d.time / 60);

      // positioning for square visual
      // stored here to make it easier
      // to keep track of.
      d.col = i % numPerRow;
      d.x = d.col * (squareSize + squarePad);
      d.row = Math.floor(i / numPerRow);
      d.y = d.row * (squareSize + squarePad);
      return d;
    });
  }

  /**
   * getFillerWords1 - returns array of
   * only filler words
   *
   * @param data - word data from getWords
   */
  function getFillerWords1(data) {
    return data.filter(function (d) {return d.filler1; });
  }

    function getFillerWords2(data) {
        return data.filter(function (d) {return d.filler2; });
    }

    function getFillerWords3(data) {
        return data.filter(function (d) {return d.filler3; });
    }

    function getFillerWords4(data) {
        return data.filter(function (d) {return d.filler4; });
    }

  /**
   * getHistogram - use d3's histogram layout
   * to generate histogram bins for our word data
   *
   * @param data - word data. we use filler words
   *  from getFillerWords1
   */
 /* function getHistogram(data) {
    // only get words from the first 30 minutes
    // var thirtyMins = data.filter(function (d) { return d.min < 30; });
    var thirtyMins = [
        {age : 10,size : 1849658},
        {age : 20,size : 1664228},
        {age : 30,size : 1889103},
        {age : 40,size : 1828970},
        {age : 50,size : 1432877},
        {age : 60,size : 1204318},
        {age : 70,size : 698449},
        {age : 80,size : 393588},
        {age : 90,size : 215044}
    ];


      // bin data into 2 minutes chuncks
    // from 0 - 31 minutes
    // @v4 The d3.histogram() produces a significantly different
    // data structure then the old d3.layout.histogram().
    // Take a look at this block:
    // https://bl.ocks.org/mbostock/3048450
    // to inform how you use it. Its different!
    return d3.histogram()
      .thresholds(xHistScale.ticks(9))
      (thirtyMins);
      //.value(function (d) { return d; })(thirtyMins);
  }
*/
  /**
   * groupByWord - group words together
   * using nest. Used to get counts for
   * barcharts.
   *
   * @param words
   */
  function groupByWord(words) {
    return d3.nest()
      .key(function (d) { return d.word; })
      .rollup(function (v) { return v.length; })
      .entries(words)
      .sort(function (a, b) {return b.value - a.value;});
  }

  /**
   * activate -
   *
   * @param index - index of the activated section
   */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /**
   * update
   *
   * @param index
   * @param progress
   */
  chart.update = function (index, progress) {
    updateFunctions[index](progress);
  };

  // return chart function
  return chart;
};


/**
 * display - called once data
 * has been loaded.
 * sets up the scroller and
 * displays the visualization.
 *
 * @param data - loaded tsv data
 */
function display(data) {
  // create a new plot and
  // display it
  var plot = scrollVis();
  d3.select('#vis')
    .datum(data)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller()
    .container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
  scroll.on('active', function (index) {
    // highlight current step text
    d3.selectAll('.step')
      .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

    // activate current section
    plot.activate(index);
  });

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}

// load data and display
d3.tsv('data/words.tsv', display);
