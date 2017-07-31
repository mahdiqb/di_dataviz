(function () {
    var width = 500,
        height = 500;
    var svg = d3.select("#chart")
        .append("svg")
        .attr("height",height)
        .attr("width",width)
        .append("g")
        .attr("transform","translate(0,0)")

    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.05))

    d3.queue()
        .defer(d3.csv,"nidaa.csv")
        .await(ready)
    function ready (error, datapoints) {
        var circles = svg.selectAll(".politicien")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "politicen")
            .attr("r",10)
            .attr("fill","lightblue")

        simulation.nodes(datapoints)
        
        function ticked(){
            circles
                .attr("cx", function(d){
                    return d.x
                })
                .attr("cy", function (d) {
                    return d.y
                })
        }
    }

})();