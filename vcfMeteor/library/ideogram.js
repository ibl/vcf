window.onload=function(){
  //Width and height
			var w = 600;
			var h = 250;

var dataset = citoBand.slice();
var chrom = []; 
var end = []; 
var start = [];
var name= [];
var something = [];

			for (var i = 0; i < citoBand.length; i++){
				chrom[i]=citoBand[i].chr;
				end[i]=citoBand[i].end;
				start[i]=citoBand[i].start;
				name[i]=citoBand[i].name;
				something[i]=citoBand[i].something;
			}
//			var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
//							11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];
							//.domain(d3.range(dataset.length))
			var xScale = d3.scale.ordinal()
							.domain(chrom)
							.rangeRoundBands([0, w], 0.05);

			var yScale = d3.scale.linear()
							.domain([0, end])
							.range([0, h]);

			//Create SVG element
			var svg = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			//Create bars
			svg.selectAll("rect")
			   .data(dataset)
			   .enter()
			   .append("rect")
			   .attr("x", function(d) {
			   		return xScale(d.chrom);
			   })
			   .attr("y", function(d) {
			   		return 1;
			   })
			   .attr("width", xScale.rangeBand())
			   .attr("height", function(d) {
			   		return yScale(d.end - d.start);
			   })
			   .attr("fill", function(d) {
					return "rgb(0, 0, " + (d * 10) + ")";
			   });
/*
			//Create labels
			svg.selectAll("text")
			   .data(dataset)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d;
			   })
			   .attr("text-anchor", "middle")
			   .attr("x", function(d) {
			   		return xScale(d.chr) + xScale.rangeBand() / 2;
			   })
			   .attr("y", function(d) {
			   		return h - yScale(d.end) + 14;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "white");
*/
}