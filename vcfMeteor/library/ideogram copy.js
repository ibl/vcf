 window.onload=function(){

var dataset = citoBand;                         

  var w = 600;
	var h = 250;
	
	var xScale = d3.scale.ordinal()
          		.domain(d3.range(dataset.chr))
							.rangeRoundBands([0, w], 0.05);

	var yScale = d3.scale.linear()
							.domain([0, d3.max(dataset)])
							.range([0, h]);

			var svgContainer = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

//  var svgContainer = d3.select("body").append("svg")
//                     .attr("width", 800)
//                     .attr("height", 800);
//
//var line = svgContainer.append("line")
//                         .attr("x1", 5)
//                         .attr("y1", 60)
//                         .attr("x2", 65)
//                         .attr("y2", 60)
//                         .attr("stroke-width", 2)
//                         .attr("stroke", "black");



//var para = d3.select("body").selectAll("p")
//        .data(dataset)
//        .enter()
//        .append("p")
//        .text(function  (d){return d.start});
        
svgContainer.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("y", function(d){return d.start/1000000})
  .attr("x", function(d, i) {return d.start/1000000})
  .attr("height", function(d){return (d.end-d.start)/1000000})
  .attr("width", 1);


}
