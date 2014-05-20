var diego = function(){
	document.getElementById('diegoDiv').textContent="Diego's VCF sandbox";
	document.getElementById('pickFile').addEventListener('change', fileSelected, false);
	$("#myButton").click(function(){
		$("#myTable_wrapper").fadeToggle(); // "#myTable_wrapper" is created when page loads dataTable;
	});
	$("#myGraphButton").click(function(){


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
		VCFparse(vcfTxt);
		//from here, the object y will be accessible
		console.log(reader.result.substring(0, 100));
		//call findVariationsOnGenes()
		var variantsFound = findVariantsOnGenes(y.body);
		//fetch data for myTable
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
					y.body[i-i0][F[j]]=L[j].match(/\d|x|y/i)[0];
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
