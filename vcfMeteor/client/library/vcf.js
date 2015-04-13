console.log("loaded vcf.js");

var vcf = {};

vcf.getSumVariants = function () {
  var summary = [];
  var data = this.findVariantsOnGenes(vcf.body);
  var c = 0;
  var urlFilter = /'(.*?)'/;
  for (var z=0; z < data.length; z++){
				
    if (z==0){
	
     summary[c]={"gene":data[z]["gene"], "hit":1, "url":data[z]["gene"].match(urlFilter)[1]};
     
      }else if (data[z]["gene"]===data[z-1]["gene"]){
        summary[c].hit ++;
      } else {
        c++;	
        summary[c]={"gene":data[z]["gene"], "hit":1, "url":data[z]["gene"].match(urlFilter)[1]};
      }
}
return summary;	
};

//function that find variations on GPS oncogenes.
//
vcf.findVariantsOnGenes = function(){
  var sample = vcf.body;
  var list = getGeneList();
  var variantsFound = [];

  for (var counter = 0; counter < sample.length; counter++){

    for (var counter2 = 0; counter2 < list.length; counter2++){


    if (sample[counter]['CHROM']==list[counter2]['Chromosome Name'].match(/\d|x|y/i)[0]){
      if (sample[counter]['POS']>list[counter2]['Gene Start (bp)']&&
      sample[counter]['POS']< list[counter2]['Gene End (bp)']){
		  
		  var zzz = sample[counter]['ID'].match(/(\.)|[rs]+(.+)/)[2];
		  var z = getPathogenicSnpList().indexOf(zzz);

		variantsFound.push({
          'chromosome':sample[counter]['CHROM'],
          'position':"<a href='http://genomemaps.org?region=" + sample[counter]['CHROM'] + ":" + sample[counter]['POS'] + "' & target='_blank' >" +sample[counter]['POS'] +"</a>",
          'strand':list[counter2]['Strand'],
		  'ID':"<a href='http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs="+sample[counter]['ID'].match(/(\.)|[rs]+(.+)/)[2]+" '& target='_blank'>"+sample[counter]['ID']+"</a>",
		  'Pathogenic':z,
          'gene':"<a href='https://dcc.icgc.org/genes/" + list[counter2]['Ensembl Gene ID'] +"'\
          target='_blank' title='"+list[counter2]['Description']+"'>"+ list[counter2]['HGNC symbol'] + "</a>"
        });
      }
    }

  }
}
return  variantsFound;
}

//VCFparse

vcf.parse=function(x){
	vcf._id = "UUID-"+Math.uuid(); //ad a UUID to vcf.
	console.log('(parsing a '+x.length+' long string)');
	x=x.split(/\n/);// transforms into a array finding new line caracter
	var n=x.length; // number of lines in the file
	console.log("file has "+ n +  " lines")
	this.numberOfLines = n;
	if(x[n-1].length==0){n=n-1}; // remove trailing blank
	//vcf={head:{},body:[]};//create y object. It will be the parsed VCF
	vcf.head=[];
    vcf.body=[];
	// parse ## head lines
	var i=0; // ith line
	var L = x[i].match(/^##(.*)/); // L is the line being parsed

	if(L==null){
		throw(x[i]);
	}

	while(L.length>1){
		i++;
		L = L[1].match(/([^=]+)\=(.*)/);
		if(!vcf.head[i-1]){
			vcf.head[i-1]={};
			}
		vcf.head[i-1]={"fieldName":L[1],
		"fieldDetail": L[2],
		"file_id": vcf._id};
		L = x[i].match(/^##(.*)/);
		if(L==null){L=[]}; // break
	}
	// parse # body lines
	console.log	("parse # body lines");
	
	L=x[i].match(/^#([^#].*)/)[1]; // use first line to define fields
	var F = L.split(/\t/);
	var i0=i+1;
	for(var i=i0;i<n;i++){ //go from the first line of data on body to the end of vcf
		L = x[i].split(/\t/);
		vcf.body[i-i0]={};
		//vcf.body[i-i0]['line']=i-i0;
		//console.log("Parse line " + (i-i0));
		for(var j=0;j<F.length;j++){
			vcf.body[i-i0][F[j]]=L[j];
	}
			//Work with these lines to insert on mongoDB collection
			//var xx = {};
			//xx=y.body[i-i0];
			//Body.insert(xx);



	}
	vcf.fields=F;
	
	//workaround to parse CSQ data 
for (var x = 0; x < this.length; x++) {
	for(var y = 0; y< this.body[x].length["CSQ"]; y++){
		this.body[x]["CSQ"][y]=this.body[x]["CSQ"][y].split("|")
	}
}


	vcf.parseHead(vcf); // parse head further

	for (var i in vcf['head']){


		if (vcf['head'][i] === Object(vcf['head'][i])){
		//Head.insert({'title':i});
			for (var j in vcf['head'][i]){
		//Work with these lines to insert on mongoDB collection
		//var xx = {};
		//xx = y['head'][i][j];
		//xx.ID = j;
		//xx.title = i;
		//HeadDetails.insert(xx);

			};
		};
    };
	
return vcf;
};
//VCFparseHead
vcf.parseHead = function(dt){ // go through a data file and parses data.head
	console.log	("parsing head");
	var fields = Object.getOwnPropertyNames(dt.head);
	var newHead={}; // parse old head into here
	var f, v, str, ID; // place holder for fields, their values, the string line, and IDs during parsing
	var AV, AVk; // attribute=value pairs during parsing of array fields
	for(var i=0;i<dt.head.length;i++){
		//ID=str.match(/ID=([^\,\>]+)/)[1];
		//dt.head.INFO[ID]={
		// array entries are pushed with <> entries
		
		//f = fields[i];

		dt.head[i]._id="UUID-"+Math.uuid()

		if(dt.head[i]["fieldDetail"][0]!='<' && dt.head[i]["fieldDetail"][0]!='"' ){ // the non array head fields
			dt.head[i]["value"]=dt.head[i]["fieldDetail"];
		} else if(dt.head[i]["fieldDetail"][0]!='<' && dt.head[i]["fieldDetail"][0]=='"'){ // the non array head fields
			dt.head[i]["value"]=dt.head[i]["fieldDetail"].match(/(?:\")(.+)(?:\")/)[1];
		} else { // the array head fields
			//v={};
			//for(j=0;j<dt.head[i]["fieldDetail"].length;j++){
				//str=dt.head[i]["fieldDetail"][j];
				str=dt.head[i]["fieldDetail"];
				
				ID=str.match(/ID=([^\,\>]+)/)[1];
				
				//v[ID]={};
				dt.head[i]["ID"]=ID;
				AV = str.match(/([^\,\<]+=[^\,\>]+)/g);
				
				for(k=1;k<AV.length;k++){ // k=0 is if ID's AV
					AVk=AV[k].match(/[^=\"]+/g);
					//v[ID][AVk[0]]=AVk[1];
					dt.head[i][AVk[0]]=AVk[1];
				}
			
			//}
			//dt.head[i]["final"]=v;
		}
		delete dt.head[i]["fieldDetail"];
	};
	// return dt <-- no need, dt was passed by reference

};

			//Parse field values
 vcf.getRows = function () {
	//var y = this.fields

	var rows = [];

	for (var x in this.body){
		var myObject = {};
					myObject['_id'] = Math.uuid(); //Look later if _id must be set by mongoDB
					//cheating. This string must be passed as a parameter
					myObject['file_id'] = vcf._id;
					//myObject['sampleName']=y;
					myObject['row']=x;
		for	(var y in this.body[x]){

			

			switch (y){
				// ID - semi-colon separated list
				//
				case 'ALT': //coma separated list
					myObject.ALT = this.body[x][y].split(/\,/);
					break;
				case 'INFO': //semi-colon separeted list of keys:(coma separated values list/ It could be one per allele)
					var splited = this.body[x][y].split(/\;/);
					//var myObject = {};
					for (var z = 0 ; z < splited.length; z++){
						if (splited[z].search(/\=/)==-1){
							myObject["flags"]=splited[z];
							}else{
								var splitedFurther = splited[z].split(/\=/);
								var myParamether = splitedFurther[0];
								var myValue = [];
								myValue = splitedFurther[1].split(/\,/);
								myObject["INFO_"+myParamether]=myValue;
							}
						//rows.push(myObject);
					}
					break;
				case 'FORMAT':
					myObject.FORMAT = "FORMAT_"+this.body[x][y].split(/\:/);
					break;

				case 'CHROM': // need to handle more chromossomes than just numbers plus x and y
					myObject.CHROM = this.body[x][y].match(/\d{1,}|x|y/i)[0]; 
					break;
				default:
					if (this.body[x][y].search(":")==-1 & this.body[x][y]!="./.") { // Search for ":" on others fields values, if din't find, isn't sample
						myObject[y]=(this.body[x][y]);
					}
				//this.body[x]['SAMPLE'].push(myObject);
			}
			//rows.push(myObject);
		}
		rows.push(myObject);
	}

	return rows;
}

vcf.getSamples = function () {
	//var y = this.fields
	var sampleNodes = [];


	for (var x in this.body){
		for	(var y in this.body[x]){
			if (y!= 'ALT' & y!='INFO' & y!='FORMAT' & y!='CHROM'){
					if (this.body[x][y].search(":")==-1) { // Search for ":" on others fields values
						//rows.push(this.body[x][y]);
					}else{
						//If found, it suposes that is a sample filed.
						//vcf.body[x][y]=body[x][y].split(/\:/); //erase it
					var splited = this.body[x][y].split(/\:/); // split to correspond to FORMAT field
					
					//this.body[x]['SAMPLE']=[];	
					//if (typeof this.body[x]['SAMPLE']=='undefined'){
					//		this.body[x]['SAMPLE']=[];	
					//	};
					
					var myObject = {};
					myObject['_id'] = Math.uuid(); //Look later if _id must be set by mongoDB
					myObject['file_id'] = vcf._id;
					myObject['sampleName']=y;
					myObject['row']=x; // starts from 1

					for (var z = 0 ; z < splited.length; z++){
						var splitedFurther = splited[z].split(/\,/);// for each value found, split on ","
						var myParamether = this.body[x]['FORMAT'].split(/\:/)[z];// find correspondent FORMAT
						myObject["FORMAT_"+myParamether]=splitedFurther;//join FORMAT and value
						
						if (myParamether==='FORMAT_GT'){ // go into details if FORMAT is genotype
						
							if (myObject['FORMAT_GT']=="./."){
								myObject['hasVariant']=false;
							} else {
								myObject['hasVariant']=true
							}
							if (myObject['FORMAT_GT'][0].search(/\|/)>-1){ // [0] is needed because GT is an array
								myObject['isPhased'] = true;
								} else if (myObject['GT'][0].search(/\//)>-1)	{
								myObject['isPhased'] = false;	
								};
							
							// Think in an array of alleles all[]: all[0]=REF, all[1]=ALT[1-1] , all[2]=ALT[2-1] and so on.
							var firstGtNumber = myObject['FORMAT_GT'][0].match(/(.+)(["\/|])(.+)/)[1];
							var secondGtNumber = myObject['FORMAT_GT'][0].match(/(.+)(["\/|])(.+)/)[3];
							
							if (firstGtNumber == 0){
								myObject['firstParentalAllele']=this.body[x]['REF'];
								}else{
								myObject['firstParentalAllele']=this.body[x]['ALT'][firstGtNumber-1];
								};
							
							if (secondGtNumber == 0){
								myObject['secondParentalAllele']=this.body[x]['REF'];	
								} else {
									myObject['secondParentalAllele']=this.body[x]['ALT'][secondGtNumber-1];
								};
								
						//if (typeof vcf.body[x]['SAMPLE']=='undefined'){
						//	this.body[x]['SAMPLE']=[];	
						//};
						 //this.body[x]['SAMPLE'].push(myObject);
								
								
								
								
								
						};
						
						//if (typeof (vcf.body[x]['SAMPLE']=='undefined')){
						//	vcf.body[x]['SAMPLE']=[];	
						//};
					//this.body[x]['SAMPLE'].push(myObject);
					};
					
					sampleNodes.push(myObject);
				}
				//sampleNodes.push(myObject);
				//this.body[x]['SAMPLE'].push(myObject);
			}
		}
	}
	return sampleNodes;
	//return rows;
}

