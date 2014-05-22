var diego = function(){
	document.getElementById('diegoDiv').textContent="Diego's VCF sandbox";
	document.getElementById('pickFile').addEventListener('change', fileSelected, false);
	$("#myButton").click(function(){
		$("#myTable_wrapper").fadeToggle(); // "#myTable_wrapper" is created when page loads dataTable;
	});
	$("#myGraphButton").click(function(){
		
		var margin = {top: 20, right: 30, bottom: 20, left: 50};
		var width = 1000 - margin.left - margin.right;
		var height = 1000 - margin.top - margin.bottom;
		
		var data = getSumVariants();
		
    	var	barHeight = 20

		var x = d3.scale.linear()
    		.range([0, width]);

		var chart = d3.select(".chart")
    		.attr("width", width + margin.left + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
  			.append("g")
    		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/*var data = [
  {name: "Locke",    value:  4},
  {name: "Reyes",    value:  8},
  {name: "Ford",     value: 15},
  {name: "Jarrah",   value: 16},
  {name: "Shephard", value: 23},
  {name: "Kwon",     value: 42}
];*/


  x.domain([0, d3.max(data, function(d) { return d.hit; })]);

  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(100," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.hit); })
      .attr("height", barHeight - 1);

  bar.append("text")
      .attr("x", function(d) { return -2; })
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.gene + " - " + d.hit; });

function type(d) {
  d.hit = +d.hit; // coerce to number
  return d;
}

	});
	}
			
			

		var getSumVariants = function () {
			var summary = [];
			//summary[0]=[];
			//summary[1]=[];
			var data = findVariantsOnGenes(y.body);
			var c = 0;
			for (var z=0; z < data.length; z++){
				
				if (z==0){
					
					summary[c]={"gene":data[z]["linkLessGene"], "hit":1};
					
				}else if (data[z]["linkLessGene"]===data[z-1]["linkLessGene"]){
					summary[c].hit ++;

				} else {
					c++;	
					summary[c]={"gene":data[z]["linkLessGene"], "hit":1};
				}
				
				
			}
				
			return summary;	
		};


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
		VCFparse(vcfTxt);
		//from here, the object y will be accessible
		console.log(reader.result.substring(0, 100));
		
		//fetch data for myTable
		var variantsFound = findVariantsOnGenes(y.body);
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

var VCFparse=function(x){
	console.log('(parsing a '+x.length+' long string)');
	x=x.split(/\n/);// transforms into a array finding new line caracter
	var n=x.length; // number of lines in the file
	if(x[n-1].length==0){n=n-1}; // remove trailing blank
	y={head:{},body:[]};//create y object. It will be the parsed VCF
	// parse ## head lines
	var i=0; // ith line
	var L = x[i].match(/^##(.*)/); // L is the line being parsed

	if(L==null){
		throw(x[i]);
	}

	while(L.length>1){
		i++;
		L = L[1].match(/([^=]+)\=(.*)/);
		if(!y.head[L[1]]){
			y.head[L[1]]=[];
			}
		y.head[L[1]].push(L[2]);
		L = x[i].match(/^##(.*)/);
		if(L==null){L=[]}; // break
	}
	// parse # body lines
	L=x[i].match(/^#([^#].*)/)[1]; // use first line to define fields
	var F = L.split(/\t/);
	var i0=i+1;
	for(var i=i0;i<n;i++){ //go from the first line of data on body to the end of vcf
		L = x[i].split(/\t/);
		y.body[i-i0]={};
		y.body[i-i0]['line']=i-i0;
		for(var j=0;j<F.length;j++){

			//Parse field values
			switch (F[j]){
				// ID - semi-colon separated list
				//
				case 'ALT': //coma separated list
					y.body[i-i0][F[j]]=L[j].split(/\,/);
					break;
				case 'INFO': //semi-colon separeted list of keys:(coma separated values list/ It could be one per allele)
					var splited = L[j].split(/\;/);
					var myObject = {};
					for (var z = 0 ; z < splited.length; z++){
						if (splited[z].search(/\=/)==-1){
							myObject["flags"]=splited[z];
							}else{
								var splitedFurther = splited[z].split(/\=/);
								var myParamether = splitedFurther[0];
								var myValue = [];
								myValue = splitedFurther[1].split(/\,/);
								myObject[myParamether]=myValue;
							}
						y.body[i-i0][F[j]]=myObject;
					}
					break;
				case 'FORMAT':
					y.body[i-i0][F[j]]=L[j].split(/\:/);
					break;
				case 'CHROM':
					y.body[i-i0][F[j]]=L[j].match(/\d{1,}|x|y/i)[0];
					break;
				default:
					if (L[j].search(":")==-1) { // Search for ":" on others fields values
						y.body[i-i0][F[j]]=L[j];
					}else{
						y.body[i-i0][F[j]]=L[j].split(/\:/); //If found, it suposes that is a sample filed.

					var splited = L[j].split(/\:/);
					var myObject = {};
					for (var z = 0 ; z < splited.length; z++){
						var splitedFurther = splited[z].split(/\,/);
						var myParamether = y.body[i-i0]['FORMAT'][z];
						myObject[myParamether]=splitedFurther;

					}
					y.body[i-i0][F[j]]=myObject;
					}
		}
	}
			//Work with these lines to insert on mongoDB collection
			//var xx = {};
			//xx=y.body[i-i0];
			//Body.insert(xx);

	}
	y.fields=F;


	VCFparseHead(y); // parse head further

	for (var i in y['head']){


		if (y['head'][i] === Object(y['head'][i])){
		//Head.insert({'title':i});
			for (var j in y['head'][i]){
		//Work with these lines to insert on mongoDB collection
		//var xx = {};
		//xx = y['head'][i][j];
		//xx.ID = j;
		//xx.title = i;
		//HeadDetails.insert(xx);

			};
		};
    };
return y;
};

var VCFparseHead = function(dt){ // go through a data file and parses data.head
	var fields = Object.getOwnPropertyNames(dt.head);
	var newHead={}; // parse old head into here
	var f, v, str, ID; // place holder for fields, their values, the string line, and IDs during parsing
	var AV, AVk; // attribute=value pairs during parsing of array fields
	for(var i=0;i<fields.length;i++){
		//ID=str.match(/ID=([^\,\>]+)/)[1];
		//dt.head.INFO[ID]={
		// array entries are pushed with <> entries
		f = fields[i];
		if(dt.head[f][0][0]!='<'){ // the non array head fields
			dt.head[f]=dt.head[f][0];
		} else { // the array head fields
			v={};
			for(j=0;j<dt.head[f].length;j++){
				str=dt.head[f][j];
				ID=str.match(/ID=([^\,\>]+)/)[1];
				/* http://www.myezapp.com/apps/dev/regexp/show.ws
				Sequence: match all of the followings in order
					/ I D =
					CapturingGroup
					GroupNumber:1
					Repeat
					AnyCharNotIn[ , >]
					one or more times
					/
				*/
				v[ID]={};
				AV = str.match(/([^\,\<]+=[^\,\>]+)/g);
				/*
				Sequence: match all of the followings in order
					/
					CapturingGroup
					GroupNumber:1
					Sequence: match all of the followings in order
					Repeat
					AnyCharNotIn[ , <]
					one or more times
					=
					Repeat
					AnyCharNotIn[ , >]
					one or more times
/ g
				*/
				for(k=1;k<AV.length;k++){ // k=0 is if ID's AV
					AVk=AV[k].match(/[^=\"]+/g);
					v[ID][AVk[0]]=AVk[1];
				}
			}
			dt.head[f]=v;
		}
	};
	// return dt <-- no need, dt was passed by reference

};
