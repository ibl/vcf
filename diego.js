 diego=function(){
   document.getElementById('diegoDiv').textContent="Diego's VCF sandbox";
   //
   document.getElementById('pickFile').addEventListener('change', fileSelected, false);
   


 };
 
 fileSelected=function (event) {
      // template data, if any, is available in 'this'
   
   var input = event.target;
	var reader = new FileReader();
	
	reader.onload = function(event){
	var reader = event.target;
	
	var vcfTxt = reader.result;
	//calling VCFparse();
	console.log('triggered change input');
	//call VCFparse function
	VCFparse(vcfTxt);
		//from here, the object y will be accessible
	console.log(reader.result.substring(0, 100));
	
		var columnsTitle = [];
		for (x=0; x<y.fields.length; x++){
			columnsTitle[x]={"title":y['fields'][x], //this goes to title itself
			"data":y['fields'][x]};//this is the column key
		};
		
		
	//populate myTable
	    $('#myTable').dataTable({
		
		"data": y.body,
		
        "columns": columnsTitle,
    } );
	
		};
		
		
        reader.readAsText(input.files[0]);
	

		
	};
    
    VCFparse=function(x){
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
	
	//trying to create docs with # of line
	/*
	for(var j=0;j<F.length;j++){
		y.body[F[j]]=[];
	}
	*/
	var i0=i+1;
	
	for(var i=i0;i<n;i++){ //go ahead from the first line of data on body to the end of vcf
		
		L = x[i].split(/\t/);
		y.body[i-i0]={};
		y.body[i-i0]['line']=i-i0;
		for(var j=0;j<F.length;j++){
			y.body[i-i0][F[j]]=L[j];
		}
			var xx = {};
			xx=y.body[i-i0];			
			
	}
	y.fields=F;//this line will be deleted
	
	
	VCFparseHead(y); // parse head further
		
	//var headLines = Object.getOwnPropertyNames(y.head);
	for (var i in y['head']){
	
			
		if (y['head'][i] === Object(y['head'][i])){
			for (var j in y['head'][i]){
		
		
		var xx = {};
		xx = y['head'][i][j];
		xx.ID = j;
		xx.title = i;
		
		//, 'details':y['head'][i]});
			};
		};
    };
	
	return y;
	
	
};

VCFparseHead=function(dt){ // go through a data file and parses data.head
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
 
 
