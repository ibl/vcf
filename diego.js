var diego = function(){
	document.getElementById('diegoDiv').textContent="Diego's VCF sandbox";
	document.getElementById('pickFile').addEventListener('change', fileSelected, false);
	
	$("#myButton").click(function(){
		$("#myTable_wrapper").fadeToggle(); // "#myTable_wrapper" is created when page loads dataTable;
	});
	
	$("#myGraphButton").click(function(){
		
		var margin = {top: 20, right: 20, bottom: 20, left: 100};
		var width = 400 - margin.left - margin.right;
		var height = 400 - margin.top - margin.bottom;
		
		var data = vcf.getSumVariants();
		
		data.sort(function(ob1, ob2){ return ob2.hit - ob1.hit});

		
    	var	barHeight = 15

		var x = d3.scale.linear()
    		.range([0, width]);

		var chart = d3.select(".chart")
    		.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
  			.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
		x.domain([0, d3.max(data, function(d) { return d.hit; })]);

  		chart.attr("height", barHeight * data.length);

  		var bar = chart.selectAll("g")
      		.data(data)
    		.enter().append("g")
      		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

//  		bar.append("rect")
//      		.attr("width", function(d) { return x(d.hit); })
//      		.attr("height", barHeight - 1)
//	  		.attr("xlink:href", function(d){return d.gene })
//		.append("a")
//			.attr("xlink:href", function(d){return d.gene });
			
		bar.append("a")
  			.attr("xlink:href", function(d){return d.url})  // <-- reading the new "url" property
			.attr("target", "_blank")
		.append("rect")
      		.attr("height", barHeight - 1)
      		.attr("width", function(d) { return x(d.hit) })

			
		bar.append("text")
      		.attr("x", function(d) { return 0; })
      		.attr("y", barHeight / 2)
      		.attr("dy", ".35em")
      		.text(function(d) { return  d.gene.match(/>(.*?)</)[1] + "-" + d.hit });

		function type(d) {
  			d.hit = +d.hit; // coerce to number
  			return d;
		}

	});
}
			
var fileSelected = function (event) {
	// template data, if any, is available in 'this'
   	var input = event.target;
	var reader = new FileReader();
	reader.onload = function(event){
		var reader = event.target;
		var vcfTxt = reader.result;
		//call VCFparse();
		console.log('triggered change input');
		//call VCFparse function
		vcf.parse(vcfTxt);
		//from here, the object y will be accessible
		console.log(reader.result.substring(0, 100));
		
		//fetch data for myTable
		var variantsFound = vcf.findVariantsOnGenes(vcf.body);
		var columnsTitleBefore = Object.getOwnPropertyNames(variantsFound[0]);
		columnsTitle = [];

		for (x=0; x<columnsTitleBefore.length; x++){
			columnsTitle[x]={"title":columnsTitleBefore[x], //goes to title itself
			"data":columnsTitleBefore[x]}; //column key
			};

		//populate myTable
	    $('#myTable').dataTable({
		"data": variantsFound,
		"columns": columnsTitle,
    	});
	};
	    reader.readAsText(input.files[0]);
		
		
};

