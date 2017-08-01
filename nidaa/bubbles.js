(function () {
    var width = 8 * (window.innerWidth / 10)
    var height = 8 * (window.innerHeight / 10);

    var tooltip = floatingTooltip('gates_tooltip', 240);

    var yearsTitleX = {
        'Bloc Al Horra du Mouvement Machrouu Tounes': - width /3,
        'Mouvement Nidaa Tounes': 0,
        'Bloc National': width /3,
        'Aucun bloc': 0
    };

    var yearsTitleY = {
        'Bloc Al Horra du Mouvement Machrouu Tounes': -height / 2.5,
        'Mouvement Nidaa Tounes': -height / 2.5,
        'Bloc National': -height / 2.5,
        'Aucun bloc': height / 2.5
    };

    var svg = d3.select("#chart")
        .append("svg")
        .attr("height",height)
        .attr("width",width)
        .style("display", "block")
        .style("margin", "auto")
        .append("g")
        .attr("transform","translate(" + width / 2 +","+height/2+")")

    function resize() {
        width = 8 * (window.innerWidth / 10), height = 8 * (window.innerHeight / 10);
        svg.attr("width", width).attr("height", height);
        //force.size([width, height]).resume();
        bubbleMin= width/100;
        bubbleMax= width/50;
    }

    var bubbleMin= window.innerWidth / 100;
    var bubbleMax= window.innerWidth / 50;

//    <defs>
        //<pattern id="" height="100%" width="100%" patternContentUnits="objectBoundingBox">
          //<image height="1" width="1" preserveAspectRatio="nope" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/"></image>
        //</pattern>
//      </defs>

    function hideYearTitles() {
        svg.selectAll('.year').remove();
    }

    function showYearTitles() {
        // Another way to do this would be to create
        // the year texts once and then just hide them.
        var yearsData = d3.keys(yearsTitleX);
        var years = svg.selectAll('.year')
            .data(yearsData);

        years.enter().append('text')
            .attr('class', 'year')
            .attr('font-family','Calibri')
            .attr('x', function (d) { return yearsTitleX[d]; })
            .attr('y', function (d) { return yearsTitleY[d]; })
            .attr('text-anchor', 'middle')
            .text(function (d) { return d; });
    }

    function showDetail(d) {
        // change outline to indicate hover state.
        d3.select(this).attr('stroke', 'black');

        var content = '<span class="name">Nom: </span><span class="value">' +
            d.name +
            '</span><br/>' +
            '<span class="name">Voix: </span><span class="value">' +
            d.voix +
            '</span><br/>' +
            '<span class="name">Gouvernorat: </span><span class="value">' +
            d.gouver +
            '</span>';

        tooltip.showTooltip(content, d3.event);
    }

    /*
     * Hides tooltip
     */
    function hideDetail(d) {
        // reset outline
        d3.select(this)
            .attr('stroke', 'none');

        tooltip.hideTooltip();
        console.log("hidden tooltip");
    }


    var defs = svg.append("defs")

    defs.append("pattern")
        .attr("id","")
        .attr("height","100%")
        .attr("width","100%")
        .attr("patternContentUnits","objectBoundingBox")
        .append("image")
        .attr("height",1)
        .attr("width",1)
        .attr("preserveAspectRatio","none")
        .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
        .attr("xlink:href","images/")

    d3.queue()
        .defer(d3.csv,"nidaa2.csv")
        .await(ready)

    var radiusScale = d3.scaleSqrt().domain([4451,115045]).range([bubbleMin,bubbleMax])

    var forceXj2016 = d3.forceX(function (d) {
        if (d.janv16 === 'Bloc Al Horra du Mouvement Machrouu Tounes')
        {
            return (- width / 3)
        } else if (d.janv16 === 'Mouvement Nidaa Tounes')
        {
            return 0
        }
        else
        {
            return 0
        }

    }).strength(0.05)

    var forceYj2016 = d3.forceY(function (d) {
        if(d.janv16 === 'Aucun bloc'){
            return height / 3
        }

        else return 0
    }).strength(0.05)

    var forceXavr2016 = d3.forceX(function (d) {
        if (d.avr16 === 'Bloc Al Horra du Mouvement Machrouu Tounes')
        {
            return - width / 3
        } else if (d.avr16 === 'Mouvement Nidaa Tounes')
        {
            return 0
        }
        else
        {
            return 0
        }

    }).strength(0.05)

    var forceYavr2016 = d3.forceY(function (d) {
        if(d.avr16 === 'Aucun bloc'){
            return height / 3
        }

        else return 0
    }).strength(0.05)

    var forceXmai2017 = d3.forceX(function (d) {
        if (d.mai17 === 'Bloc Al Horra du Mouvement Machrouu Tounes')
        {
            return - width / 3
        } else if (d.mai17 === 'Mouvement Nidaa Tounes')
        {
            return 0
        }
        else if (d.mai17 === 'Bloc National')
        {
            return width / 3
        }
        else return 0

    }).strength(0.05)

    var forceYmai2017 = d3.forceY(function (d) {
        if(d.mai17 === 'Aucun bloc'){
            return height / 3
        }

        else return 0
    }).strength(0.05)

    var forceCollide= d3.forceCollide(function (d) {
        return radiusScale(d.voix)+1
    })

    var forceXstart = d3.forceX(0).strength(0.05)
    var forceYstart = d3.forceY(0).strength(0.05)

    var simulation = d3.forceSimulation()
        .force("x", forceXstart)
        .force("y", forceYstart)
        .force("collide", forceCollide)


    function ready (error, datapoints) {

        defs.selectAll(".politicien-pattern")
            .data(datapoints)
            .enter().append("pattern")
            .attr("class","politicien-pattern")
            .attr("id",function(d){
                return d.name.replace(/ /g, "-")
            })
            .attr("height","100%")
            .attr("width","100%")
            .attr("patternContentUnits","objectBoundingBox")
            .append("image")
            .attr("height",1)
            .attr("width",1)
            .attr("preserveAspectRatio","none")
            .attr("xmlns:xlink","http://www.w3.org/1999/xlink")
            .attr("xlink:href",function(d){
                return d.link
            })

        var circles = svg.selectAll(".politicien")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "politicen")
            .attr("r",function (d) {
                return radiusScale(d.voix)
            })
            .attr("fill",function(d){
                return "url(#"+d.name.replace(/ /g, "-")+")"
            })
            .on('mouseover', showDetail)
            .on('mouseout', hideDetail);

        d3.select("#one").on('click', function(){
            hideYearTitles();
            simulation
                .force("x",forceXstart)
                .force("y",forceYstart)
                .alphaTarget(0.5)
                .restart()
            console.log("you clicked me")
        })

        d3.select("#two").on('click', function(){
            showYearTitles();
            simulation
                .force("x",forceXj2016)
                .force("y",forceYj2016)
                .alphaTarget(0.5)
                .restart()
            console.log("you clicked me")
        })

        d3.select("#three").on('click', function(){
            showYearTitles();
            simulation
                .force("x",forceXavr2016)
                .force("y",forceYavr2016)
                .alphaTarget(0.5)
                .restart()
            console.log("you clicked me")
        })

        d3.select("#four").on('click', function(){
            showYearTitles();
            simulation
                .force("x",forceXmai2017)
                .force("y",forceYmai2017)
                .alphaTarget(0.5)
                .restart()
            console.log("you clicked me")
        })

        simulation.nodes(datapoints)
            .on('tick', ticked)

        function ticked(){
            circles
                .attr("cx", function(d){
                    return d.x
                })
                .attr("cy", function (d) {
                    return d.y
                })
        }

        resize();
        d3.select(window).on("resize", resize);
    }

})();