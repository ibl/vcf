var getAllVariantsInGenes=function(){
	var geneTableMap = $.map(geneTable, function(geneTableInst){
		var bodyMap = $.map(vcf.body, function(bodyInst){
			var start = parseInt(geneTableInst.Gene_Start_bp);
			var end = parseInt(geneTableInst.Gene_End_bp);
			var pos = parseInt(bodyInst.POS);
			if (bodyInst.CHROM.substring(3)==geneTableInst.Chromosome_Name && pos > start && pos < end){
    			bodyInst.Ensembl_Gene_ID = geneTableInst.Ensembl_Gene_ID;
    			bodyInst.HGNC_ID = geneTableInst.HGNC_ID;
    			bodyInst.HGNC_symbol = geneTableInst.HGNC_symbol;
    			return bodyInst;
			}
		})
	return bodyMap;

	})
return geneTableMap;
}

var getNumberOfVariantsPerGene = function() {
data = getAllVariantsInGenes();
result = data
	.map(function(n){return n.HGNC_symbol})
	.reduce( function (prev, item) { 
  		if ( item in prev ) {
  			prev[item] ++; 
  			//prev.push({ "gene" : curr , "hits": prev[item] ++ })
  		}else{
  			prev[item] = 1;
  			//prev.push({ "gene" : curr , "hits" : 1 })
  		}
  		return prev; 
	}, {} );

return result;
}


var getVariantPerGene=function(i){
	//i is the index of gene in geneTable
	var join = $.map(vcf.body, function(obj){
		var start = parseInt(geneTable[i].Gene_Start_bp);
		var end = parseInt(geneTable[i].Gene_End_bp);
		var pos = parseInt(obj.POS);
		if (obj.CHROM.substring(3)==geneTable[i].Chromosome_Name && pos > start && pos < end){
    		obj.Ensembl_Gene_ID = geneTable[i].Ensembl_Gene_ID;
    		obj.HGNC_ID = geneTable[i].HGNC_ID;
    		obj.HGNC_symbol = geneTable[i].HGNC_symbol;
    		return obj;
		}
	})
	return join
}

var getGenePerVariant=function(i){
	//i is the index of variant in vcf.body
	var join = $.map(geneTable, function(obj){
		var start = parseInt(obj["Gene_Start_bp"]);
		var end = parseInt(obj["Gene_End_bp"]);
		var pos = parseInt(vcf.body[i].POS);
		if (obj["Chromosome_Name"]==vcf.body[i].CHROM.substring(3) && pos > start && pos < end){
    		return obj;
		}
	})
	return join
}


var main = function(){
	
	console.time("time to load geneTable")

	var readData = function (){
		d3.tsv("resources/allGenes.txt", function(value) {
			console.log("using d3.tvs() to load allGenes table")
			localforage.setItem("allGenes", JSON.stringify(value), console.log("added to localforage"))
			})
	}
	
	localforage.getItem("allGenes").then(function(result){
		if (!result) {
			console.log("data not found in localforage")
			console.log("call readData()")
			readData();
		}
		console.log("getItem from localforage")
			localforage.getItem("allGenes").then(function(result){
				geneTable = JSON.parse(result);
				console.timeEnd("time to load geneTable")
				
			})
		
	})
	
	
	
	console.log("loading main.js");
	document.getElementById('diegoDiv').textContent="Diego's VCF sandbox";
	document.getElementById('pickFile').addEventListener('change', fileSelected, false);
	
	$("#tableBtn").click(function(){
		// "#myTable_wrapper" is created when page loads dataTable;
		//fetch data for myTable
		var variantsFound = getAllVariantsInGenes();
		var columnsTitleBefore = Object.getOwnPropertyNames(variantsFound[0]);
		columnsTitle = [];

		for (x=0; x<columnsTitleBefore.length; x++){
			columnsTitle[x]={"title":columnsTitleBefore[x], //goes to title itself
			"data":columnsTitleBefore[x]}; //column key
			};
		//populate myTable
	    $('#myTable').dataTable({
//		retrieve: true,
			"data": variantsFound,
			"columns": columnsTitle,
    	});
	});

	$("#fastTableBtn").click(function(){
		// "#myTable_wrapper" is created when page loads dataTable;
		//fetch data for myTable
		var variantsFound = vcf.body;
		var columnsTitleBefore = Object.getOwnPropertyNames(variantsFound[0]);
		columnsTitle = [];

		for (x=0; x<columnsTitleBefore.length; x++){
			columnsTitle[x]={"title":columnsTitleBefore[x], //goes to title itself
			"data":columnsTitleBefore[x]}; //column key
			};
		//populate myTable
	    $('#myTable').dataTable({
//		retrieve: true,
			"data": variantsFound,
			"columns": columnsTitle,
    	});
	});
	
	$("#myRdfButton").click(function(){

		var rdfTxt = vcf.vcf2rdf();
	
		var blob = URL.createObjectURL(new Blob([rdfTxt]))
		a = document.createElement("a")
		a.href = blob
		a.download = 'test.ttl'
		a.innerText = 'Download ttl'
		document.body.appendChild( a )

	
	});
	
	$("#barPlotBtn").click(function(){
		
		var margin = {top: 20, right: 20, bottom: 20, left: 100};
		var width = 400 - margin.left - margin.right;
		var height = 1000 - margin.top - margin.bottom;
		var data=[];
		var summary = getNumberOfVariantsPerGene();
		delete	summary[""]; //remove positions not associated with genes
		for (x in summary){
			data.push({"gene":x, "hit":summary[x]})
		}
		
		data.sort(function(ob1, ob2){ return ob2.hit - ob1.hit});

		
    	var	barHeight = 10

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
      		.text(function(d) { return  d.gene + "-" + d.hit });

		function type(d) {
  			d.hit = +d.hit; // coerce to number
  			return d;
		}

	});
	
$("#ScaterPlotBtn").click(function(){
	var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 800 - margin.left - margin.right, //cheating
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = vcf.body;

  data.forEach(function(d) {
    d["POS"] = +d["POS"];
    d["CHROM"] = +d["CHROM"].substring(3)
  });

  x.domain(d3.extent(data, function(d) { return d["CHROM"]; })).nice();
  y.domain(d3.extent(data, function(d) { return d["POS"]; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("CHROM");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("POS")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d["CHROM"]); })
      .attr("cy", function(d) { return y(d["POS"]); })
      .style("fill", function(d) { return color(d.species); })
	.append("svg:title")
		.text(function(d) { return "Pos: "+d["CHROM"]+":"+d["POS"]+", Ref: "+d["REF"]+", Alt: "+d["ALT"]; });


	  

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });
  
    

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
		console.log('first 100 text caracters: "'+reader.result.substring(0, 100)+'"');
/*		
// uncomment to get dataTable back
		//fetch data for myTable
		var variantsFound = getAllVariantsInGenes();
		var columnsTitleBefore = Object.getOwnPropertyNames(variantsFound[0]);
		columnsTitle = [];

		for (x=0; x<columnsTitleBefore.length; x++){
			columnsTitle[x]={"title":columnsTitleBefore[x], //goes to title itself
			"data":columnsTitleBefore[x]}; //column key
			};

		//populate myTable
	    $('#myTable').dataTable({
//		retrieve: true,
		"data": variantsFound,
		"columns": columnsTitle,
		//"columns": {"title":"CHROM", "title":"POS",}
    	}); */
		
	document.getElementById('summary').innerHTML="<b>Number of lines: </b><span>"+vcf.numberOfLines+"</span><br>"+"\
	<b>Number of Colunms on Body: </b><span>"+vcf.fields.length+"</span><br>\
	<b>Fields: </b><span>"+vcf.fields+"<span/>"
	
	
	};
	    reader.readAsText(input.files[0]);

	    console.log	("File Name: " + input.files[0].name)
	    console.log	("File Size: " + input.files[0].size +" bytes")
	    //add file name, file size, and ID to vcf
		vcf.fileName = input.files[0].name
		vcf.fileSize = input.files[0].size
};

