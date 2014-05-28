var vcf = {};

vcf.getHeadTree = function () {
	
}

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
        variantsFound.push({
          'chromosome':sample[counter]['CHROM'],
          'position':"<a href='http://genomemaps.org?region=" + sample[counter]['CHROM'] + ":" + sample[counter]['POS'] + "' & target='_blank' >" +sample[counter]['POS'] +"</a>",
          'strand':list[counter2]['Strand'],
          //'linkLessGene':list[counter2]['HGNC symbol'],
          'gene':"<a href='https://dcc.icgc.org/genes/" + list[counter2]['Ensembl Gene ID'] +"'\
          target='_blank' title='"+list[counter2]['Description']+"'>"+ list[counter2]['HGNC symbol'] + "</a>"
          
          //'Gene Start (bp)':list[counter2]['Gene Start (bp)'],
          //'Gene End (bp)':list[counter2]['Gene End (bp)'],
          //'Band':list[counter2]['Band']
        });
      }
    }

  }
}
return  variantsFound;
}

//VCFparse

vcf.parse=function(x){
	console.log('(parsing a '+x.length+' long string)');
	x=x.split(/\n/);// transforms into a array finding new line caracter
	var n=x.length; // number of lines in the file
	if(x[n-1].length==0){n=n-1}; // remove trailing blank
	//vcf={head:{},body:[]};//create y object. It will be the parsed VCF
	vcf.head={};
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
		if(!vcf.head[L[1]]){
			vcf.head[L[1]]=[];
			}
		vcf.head[L[1]].push(L[2]);
		L = x[i].match(/^##(.*)/);
		if(L==null){L=[]}; // break
	}
	// parse # body lines
	L=x[i].match(/^#([^#].*)/)[1]; // use first line to define fields
	var F = L.split(/\t/);
	var i0=i+1;
	for(var i=i0;i<n;i++){ //go from the first line of data on body to the end of vcf
		L = x[i].split(/\t/);
		vcf.body[i-i0]={};
		vcf.body[i-i0]['line']=i-i0;
		for(var j=0;j<F.length;j++){

			//Parse field values
			switch (F[j]){
				// ID - semi-colon separated list
				//
				case 'ALT': //coma separated list
					vcf.body[i-i0][F[j]]=L[j].split(/\,/);
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
						vcf.body[i-i0][F[j]]=myObject;
					}
					break;
				case 'FORMAT':
					vcf.body[i-i0][F[j]]=L[j].split(/\:/);
					break;
				case 'CHROM':
					vcf.body[i-i0][F[j]]=L[j].match(/\d{1,}|x|y/i)[0];
					break;
				default:
					if (L[j].search(":")==-1) { // Search for ":" on others fields values
						vcf.body[i-i0][F[j]]=L[j];
					}else{
						vcf.body[i-i0][F[j]]=L[j].split(/\:/); //If found, it suposes that is a sample filed.

					var splited = L[j].split(/\:/);
					var myObject = {};
					for (var z = 0 ; z < splited.length; z++){
						var splitedFurther = splited[z].split(/\,/);
						var myParamether = vcf.body[i-i0]['FORMAT'][z];
						myObject[myParamether]=splitedFurther;

					}
					vcf.body[i-i0][F[j]]=myObject;
					}
		}
	}
			//Work with these lines to insert on mongoDB collection
			//var xx = {};
			//xx=y.body[i-i0];
			//Body.insert(xx);

	}
	vcf.fields=F;


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


var getGeneList = function(){

  var geneList = [
  {
    "Ensembl Gene ID":"ENSG00000117400",
    "Description":"myeloproliferative leukemia virus oncogene [Source:HGNC Symbol;Acc:7217]",
    "Chromosome Name":"1",
    "Gene Start (bp)":43803478,
    "Gene End (bp)":43818443,
    "Strand":1,
    "Band":"p34.2",
    "Associated Gene Name":"MPL",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":2,
    "% GC content":48.47,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":4352,
    "HGNC ID(s)":7217,
    "HGNC symbol":"MPL"
  },
  {
    "Ensembl Gene ID":"ENSG00000213281",
    "Description":"neuroblastoma RAS viral (v-ras) oncogene homolog [Source:HGNC Symbol;Acc:7989]",
    "Chromosome Name":"1",
    "Gene Start (bp)":115247090,
    "Gene End (bp)":115259515,
    "Strand":-1,
    "Band":"p13.2",
    "Associated Gene Name":"NRAS",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":1,
    "% GC content":39.00,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":4893,
    "HGNC ID(s)":7989,
    "HGNC symbol":"NRAS"
  },
  {
    "Ensembl Gene ID":"ENSG00000165731",
    "Description":"ret proto-oncogene [Source:HGNC Symbol;Acc:9967]",
    "Chromosome Name":"10",
    "Gene Start (bp)":43572475,
    "Gene End (bp)":43625799,
    "Strand":1,
    "Band":"q11.21",
    "Associated Gene Name":"RET",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":4,
    "% GC content":55.73,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":5979,
    "HGNC ID(s)":9967,
    "HGNC symbol":"RET"
  },
  {
    "Ensembl Gene ID":"ENSG00000171862",
    "Description":"phosphatase and tensin homolog [Source:HGNC Symbol;Acc:9588]",
    "Chromosome Name":"10",
    "Gene Start (bp)":89622870,
    "Gene End (bp)":89731687,
    "Strand":1,
    "Band":"q23.31",
    "Associated Gene Name":"PTEN",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":5,
    "% GC content":35.77,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":5728,
    "HGNC ID(s)":9588,
    "HGNC symbol":"PTEN"
  },
  {
    "Ensembl Gene ID":"ENSG00000184937",
    "Description":"Wilms tumor 1 [Source:HGNC Symbol;Acc:12796]",
    "Chromosome Name":"11",
    "Gene Start (bp)":32409321,
    "Gene End (bp)":32457176,
    "Strand":-1,
    "Band":"p13",
    "Associated Gene Name":"WT1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":9,
    "% GC content":46.45,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":7490,
    "HGNC ID(s)":12796,
    "HGNC symbol":"WT1"
  },
  {
    "Ensembl Gene ID":"ENSG00000149311",
    "Description":"ataxia telangiectasia mutated [Source:HGNC Symbol;Acc:795]",
    "Chromosome Name":"11",
    "Gene Start (bp)":108093211,
    "Gene End (bp)":108239829,
    "Strand":1,
    "Band":"q22.3",
    "Associated Gene Name":"ATM",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":25,
    "% GC content":37.52,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":472,
    "HGNC ID(s)":795,
    "HGNC symbol":"ATM"
  },
  {
    "Ensembl Gene ID":"ENSG00000118058",
    "Description":"lysine (K)-specific methyltransferase 2A [Source:HGNC Symbol;Acc:7132]",
    "Chromosome Name":"11",
    "Gene Start (bp)":118307205,
    "Gene End (bp)":118397539,
    "Strand":1,
    "Band":"q23.3",
    "Associated Gene Name":"KMT2A",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":15,
    "% GC content":41.25,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":4297,
    "HGNC ID(s)":7132,
    "HGNC symbol":"KMT2A"
  },
  {
    "Ensembl Gene ID":"ENSG00000133703",
    "Description":"Kirsten rat sarcoma viral oncogene homolog [Source:HGNC Symbol;Acc:6407]",
    "Chromosome Name":"12",
    "Gene Start (bp)":25357723,
    "Gene End (bp)":25403870,
    "Strand":-1,
    "Band":"p12.1",
    "Associated Gene Name":"KRAS",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":4,
    "% GC content":36.37,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":3845,
    "HGNC ID(s)":6407,
    "HGNC symbol":"KRAS"
  },
  {
    "Ensembl Gene ID":"ENSG00000179295",
    "Description":"protein tyrosine phosphatase, non-receptor type 11 [Source:HGNC Symbol;Acc:9644]",
    "Chromosome Name":"12",
    "Gene Start (bp)":112856155,
    "Gene End (bp)":112947717,
    "Strand":1,
    "Band":"q24.13",
    "Associated Gene Name":"PTPN11",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":4,
    "% GC content":43.16,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":5781,
    "HGNC ID(s)":9644,
    "HGNC symbol":"PTPN11"
  },
  {
    "Ensembl Gene ID":"ENSG00000122025",
    "Description":"fms-related tyrosine kinase 3 [Source:HGNC Symbol;Acc:3765]",
    "Chromosome Name":"13",
    "Gene Start (bp)":28577411,
    "Gene End (bp)":28674729,
    "Strand":-1,
    "Band":"q12.2",
    "Associated Gene Name":"FLT3",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":5,
    "% GC content":43.22,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":2322,
    "HGNC ID(s)":3765,
    "HGNC symbol":"FLT3"
  },
  {
    "Ensembl Gene ID":"ENSG00000139687",
    "Description":"retinoblastoma 1 [Source:HGNC Symbol;Acc:9884]",
    "Chromosome Name":"13",
    "Gene Start (bp)":48877887,
    "Gene End (bp)":49056122,
    "Strand":1,
    "Band":"q14.2",
    "Associated Gene Name":"RB1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":6,
    "% GC content":36.91,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":5925,
    "HGNC ID(s)":9884,
    "HGNC symbol":"RB1"
  },
  {
    "Ensembl Gene ID":"ENSG00000142208",
    "Description":"v-akt murine thymoma viral oncogene homolog 1 [Source:HGNC Symbol;Acc:391]",
    "Chromosome Name":"14",
    "Gene Start (bp)":105235686,
    "Gene End (bp)":105262088,
    "Strand":-1,
    "Band":"q32.33",
    "Associated Gene Name":"AKT1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":18,
    "% GC content":64.08,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":207,
    "HGNC ID(s)":391,
    "HGNC symbol":"AKT1"
  },
  {
    "Ensembl Gene ID":"ENSG00000182054",
    "Description":"isocitrate dehydrogenase 2 (NADP+), mitochondrial [Source:HGNC Symbol;Acc:5383]",
    "Chromosome Name":"15",
    "Gene Start (bp)":90626277,
    "Gene End (bp)":90645736,
    "Strand":-1,
    "Band":"q26.1",
    "Associated Gene Name":"IDH2",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":5,
    "% GC content":52.54,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":3418,
    "HGNC ID(s)":5383,
    "HGNC symbol":"IDH2"
  },
  {
    "Ensembl Gene ID":"ENSG00000141510",
    "Description":"tumor protein p53 [Source:HGNC Symbol;Acc:11998]",
    "Chromosome Name":"17",
    "Gene Start (bp)":7565097,
    "Gene End (bp)":7590856,
    "Strand":-1,
    "Band":"p13.1",
    "Associated Gene Name":"TP53",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":17,
    "% GC content":48.85,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":7157,
    "HGNC ID(s)":11998,
    "HGNC symbol":"TP53"
  },
  {
    "Ensembl Gene ID":"ENSG00000141736",
    "Description":"v-erb-b2 avian erythroblastic leukemia viral oncogene homolog 2 [Source:HGNC Symbol;Acc:3430]",
    "Chromosome Name":"17",
    "Gene Start (bp)":37844167,
    "Gene End (bp)":37886679,
    "Strand":1,
    "Band":"q12",
    "Associated Gene Name":"ERBB2",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":24,
    "% GC content":52.09,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":2064,
    "HGNC ID(s)":3430,
    "HGNC symbol":"ERBB2"
  },
  {
    "Ensembl Gene ID":"ENSG00000118046",
    "Description":"serine/threonine kinase 11 [Source:HGNC Symbol;Acc:11389]",
    "Chromosome Name":"19",
    "Gene Start (bp)":1189406,
    "Gene End (bp)":1228428,
    "Strand":1,
    "Band":"p13.3",
    "Associated Gene Name":"STK11",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":9,
    "% GC content":58.47,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":6794,
    "HGNC ID(s)":11389,
    "HGNC symbol":"STK11"
  },
  {
    "Ensembl Gene ID":"ENSG00000126934",
    "Description":"mitogen-activated protein kinase kinase 2 [Source:HGNC Symbol;Acc:6842]",
    "Chromosome Name":"19",
    "Gene Start (bp)":4090319,
    "Gene End (bp)":4124126,
    "Strand":-1,
    "Band":"p13.3",
    "Associated Gene Name":"MAP2K2",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":11,
    "% GC content":57.42,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":5605,
    "HGNC ID(s)":6842,
    "HGNC symbol":"MAP2K2"
  },
  {
    "Ensembl Gene ID":"ENSG00000119772",
    "Description":"DNA (cytosine-5-)-methyltransferase 3 alpha [Source:HGNC Symbol;Acc:2978]",
    "Chromosome Name":"2",
    "Gene Start (bp)":25455845,
    "Gene End (bp)":25565459,
    "Strand":-1,
    "Band":"p23.3",
    "Associated Gene Name":"DNMT3A",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":15,
    "% GC content":53.50,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":1788,
    "HGNC ID(s)":2978,
    "HGNC symbol":"DNMT3A"
  },
  {
    "Ensembl Gene ID":"ENSG00000171094",
    "Description":"anaplastic lymphoma receptor tyrosine kinase [Source:HGNC Symbol;Acc:427]",
    "Chromosome Name":"2",
    "Gene Start (bp)":29415640,
    "Gene End (bp)":30144432,
    "Strand":-1,
    "Band":"p23.1",
    "Associated Gene Name":"ALK",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":4,
    "% GC content":43.51,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":238,
    "HGNC ID(s)":427,
    "HGNC symbol":"ALK"
  },
  {
    "Ensembl Gene ID":"ENSG00000138413",
    "Description":"isocitrate dehydrogenase 1 (NADP+), soluble [Source:HGNC Symbol;Acc:5382]",
    "Chromosome Name":"2",
    "Gene Start (bp)":209100951,
    "Gene End (bp)":209130798,
    "Strand":-1,
    "Band":"q34",
    "Associated Gene Name":"IDH1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":9,
    "% GC content":41.27,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":3417,
    "HGNC ID(s)":5382,
    "HGNC symbol":"IDH1"
  },
  {
    "Ensembl Gene ID":"ENSG00000171456",
    "Description":"additional sex combs like 1 (Drosophila) [Source:HGNC Symbol;Acc:18318]",
    "Chromosome Name":"20",
    "Gene Start (bp)":30946155,
    "Gene End (bp)":31027122,
    "Strand":1,
    "Band":"q11.21",
    "Associated Gene Name":"ASXL1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":9,
    "% GC content":42.17,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":171023,
    "HGNC ID(s)":18318,
    "HGNC symbol":"ASXL1"
  },
  {
    "Ensembl Gene ID":"ENSG00000159216",
    "Description":"runt-related transcription factor 1 [Source:HGNC Symbol;Acc:10471]",
    "Chromosome Name":"21",
    "Gene Start (bp)":36160098,
    "Gene End (bp)":37376965,
    "Strand":-1,
    "Band":"q22.12",
    "Associated Gene Name":"RUNX1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":19,
    "% GC content":41.54,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":100506403,
    "HGNC ID(s)":10471,
    "HGNC symbol":"RUNX1"
  },
  {
    "Ensembl Gene ID":"ENSG00000159216",
    "Description":"runt-related transcription factor 1 [Source:HGNC Symbol;Acc:10471]",
    "Chromosome Name":"21",
    "Gene Start (bp)":36160098,
    "Gene End (bp)":37376965,
    "Strand":-1,
    "Band":"q22.12",
    "Associated Gene Name":"RUNX1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":19,
    "% GC content":41.54,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":861,
    "HGNC ID(s)":10471,
    "HGNC symbol":"RUNX1"
  },
  {
    "Ensembl Gene ID":"ENSG00000159216",
    "Description":"runt-related transcription factor 1 [Source:HGNC Symbol;Acc:10471]",
    "Chromosome Name":"21",
    "Gene Start (bp)":36160098,
    "Gene End (bp)":37376965,
    "Strand":-1,
    "Band":"q22.12",
    "Associated Gene Name":"RUNX1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":19,
    "% GC content":41.54,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":101928269,
    "HGNC ID(s)":10471,
    "HGNC symbol":"RUNX1"
  },
  {
    "Ensembl Gene ID":"ENSG00000100030",
    "Description":"mitogen-activated protein kinase 1 [Source:HGNC Symbol;Acc:6871]",
    "Chromosome Name":"22",
    "Gene Start (bp)":22108789,
    "Gene End (bp)":22221970,
    "Strand":-1,
    "Band":"q11.22",
    "Associated Gene Name":"MAPK1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":4,
    "% GC content":43.80,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":5594,
    "HGNC ID(s)":6871,
    "HGNC symbol":"MAPK1"
  },
  {
    "Ensembl Gene ID":"ENSG00000134086",
    "Description":"von Hippel-Lindau tumor suppressor, E3 ubiquitin protein ligase [Source:HGNC Symbol;Acc:12687]",
    "Chromosome Name":"3",
    "Gene Start (bp)":10182692,
    "Gene End (bp)":10193904,
    "Strand":1,
    "Band":"p25.3",
    "Associated Gene Name":"VHL",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":3,
    "% GC content":47.55,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":7428,
    "HGNC ID(s)":12687,
    "HGNC symbol":"VHL"
  },
  {
    "Ensembl Gene ID":"ENSG00000172936",
    "Description":"myeloid differentiation primary response 88 [Source:HGNC Symbol;Acc:7562]",
    "Chromosome Name":"3",
    "Gene Start (bp)":38179969,
    "Gene End (bp)":38184513,
    "Strand":1,
    "Band":"p22.2",
    "Associated Gene Name":"MYD88",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":11,
    "% GC content":54.39,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":4615,
    "HGNC ID(s)":7562,
    "HGNC symbol":"MYD88"
  },
  {
    "Ensembl Gene ID":"ENSG00000168036",
    "Description":"catenin (cadherin-associated protein), beta 1, 88kDa [Source:HGNC Symbol;Acc:2514]",
    "Chromosome Name":"3",
    "Gene Start (bp)":41236328,
    "Gene End (bp)":41301587,
    "Strand":1,
    "Band":"p22.1",
    "Associated Gene Name":"CTNNB1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":15,
    "% GC content":39.91,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":1499,
    "HGNC ID(s)":2514,
    "HGNC symbol":"CTNNB1"
  },
  {
    "Ensembl Gene ID":"ENSG00000121879",
    "Description":"phosphatidylinositol-4,5-bisphosphate 3-kinase, catalytic subunit alpha [Source:HGNC Symbol;Acc:8975]",
    "Chromosome Name":"3",
    "Gene Start (bp)":178865902,
    "Gene End (bp)":178957881,
    "Strand":1,
    "Band":"q26.32",
    "Associated Gene Name":"PIK3CA",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":4,
    "% GC content":35.78,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":5290,
    "HGNC ID(s)":8975,
    "HGNC symbol":"PIK3CA"
  },
  {
    "Ensembl Gene ID":"ENSG00000134853",
    "Description":"platelet-derived growth factor receptor, alpha polypeptide [Source:HGNC Symbol;Acc:8803]",
    "Chromosome Name":"4",
    "Gene Start (bp)":55095264,
    "Gene End (bp)":55164414,
    "Strand":1,
    "Band":"q12",
    "Associated Gene Name":"PDGFRA",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":10,
    "% GC content":43.65,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":5156,
    "HGNC ID(s)":8803,
    "HGNC symbol":"PDGFRA"
  },
  {
    "Ensembl Gene ID":"ENSG00000157404",
    "Description":"v-kit Hardy-Zuckerman 4 feline sarcoma viral oncogene homolog [Source:HGNC Symbol;Acc:6342]",
    "Chromosome Name":"4",
    "Gene Start (bp)":55524085,
    "Gene End (bp)":55606881,
    "Strand":1,
    "Band":"q12",
    "Associated Gene Name":"KIT",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":4,
    "% GC content":40.87,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":3815,
    "HGNC ID(s)":6342,
    "HGNC symbol":"KIT"
  },
  {
    "Ensembl Gene ID":"ENSG00000168769",
    "Description":"tet methylcytosine dioxygenase 2 [Source:HGNC Symbol;Acc:25941]",
    "Chromosome Name":"4",
    "Gene Start (bp)":106067032,
    "Gene End (bp)":106200973,
    "Strand":1,
    "Band":"q24",
    "Associated Gene Name":"TET2",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":11,
    "% GC content":36.29,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":54790,
    "HGNC ID(s)":25941,
    "HGNC symbol":"TET2"
  },
  {
    "Ensembl Gene ID":"ENSG00000134982",
    "Description":"adenomatous polyposis coli [Source:HGNC Symbol;Acc:583]",
    "Chromosome Name":"5",
    "Gene Start (bp)":112043195,
    "Gene End (bp)":112181936,
    "Strand":1,
    "Band":"q22.2",
    "Associated Gene Name":"APC",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":13,
    "% GC content":37.63,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":324,
    "HGNC ID(s)":583,
    "HGNC symbol":"APC"
  },
  {
    "Ensembl Gene ID":"ENSG00000181163",
    "Description":"nucleophosmin (nucleolar phosphoprotein B23, numatrin) [Source:HGNC Symbol;Acc:7910]",
    "Chromosome Name":"5",
    "Gene Start (bp)":170814120,
    "Gene End (bp)":170838141,
    "Strand":1,
    "Band":"q35.1",
    "Associated Gene Name":"NPM1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":12,
    "% GC content":43.60,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":4869,
    "HGNC ID(s)":7910,
    "HGNC symbol":"NPM1"
  },
  {
    "Ensembl Gene ID":"ENSG00000160867",
    "Description":"fibroblast growth factor receptor 4 [Source:HGNC Symbol;Acc:3691]",
    "Chromosome Name":"5",
    "Gene Start (bp)":176513887,
    "Gene End (bp)":176525145,
    "Strand":1,
    "Band":"q35.2",
    "Associated Gene Name":"FGFR4",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":17,
    "% GC content":60.18,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":2264,
    "HGNC ID(s)":3691,
    "HGNC symbol":"FGFR4"
  },
  {
    "Ensembl Gene ID":"ENSG00000091831",
    "Description":"estrogen receptor 1 [Source:HGNC Symbol;Acc:3467]",
    "Chromosome Name":"6",
    "Gene Start (bp)":151977826,
    "Gene End (bp)":152450754,
    "Strand":1,
    "Band":"q25.1",
    "Associated Gene Name":"ESR1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":13,
    "% GC content":39.66,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":2099,
    "HGNC ID(s)":3467,
    "HGNC symbol":"ESR1"
  },
  {
    "Ensembl Gene ID":"ENSG00000146648",
    "Description":"epidermal growth factor receptor [Source:HGNC Symbol;Acc:3236]",
    "Chromosome Name":"7",
    "Gene Start (bp)":55086714,
    "Gene End (bp)":55324313,
    "Strand":1,
    "Band":"p11.2",
    "Associated Gene Name":"EGFR",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":11,
    "% GC content":45.08,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":1956,
    "HGNC ID(s)":3236,
    "HGNC symbol":"EGFR"
  },
  {
    "Ensembl Gene ID":"ENSG00000105976",
    "Description":"met proto-oncogene [Source:HGNC Symbol;Acc:7029]",
    "Chromosome Name":"7",
    "Gene Start (bp)":116312444,
    "Gene End (bp)":116438440,
    "Strand":1,
    "Band":"q31.2",
    "Associated Gene Name":"MET",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":8,
    "% GC content":39.03,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":4233,
    "HGNC ID(s)":7029,
    "HGNC symbol":"MET"
  },
  {
    "Ensembl Gene ID":"ENSG00000157764",
    "Description":"v-raf murine sarcoma viral oncogene homolog B [Source:HGNC Symbol;Acc:1097]",
    "Chromosome Name":"7",
    "Gene Start (bp)":140419127,
    "Gene End (bp)":140624564,
    "Strand":-1,
    "Band":"q34",
    "Associated Gene Name":"BRAF",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":5,
    "% GC content":37.97,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":673,
    "HGNC ID(s)":1097,
    "HGNC symbol":"BRAF"
  },
  {
    "Ensembl Gene ID":"ENSG00000136997",
    "Description":"v-myc avian myelocytomatosis viral oncogene homolog [Source:HGNC Symbol;Acc:7553]",
    "Chromosome Name":"8",
    "Gene Start (bp)":128747680,
    "Gene End (bp)":128753674,
    "Strand":1,
    "Band":"q24.21",
    "Associated Gene Name":"MYC",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":5,
    "% GC content":53.81,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":4609,
    "HGNC ID(s)":7553,
    "HGNC symbol":"MYC"
  },
  {
    "Ensembl Gene ID":"ENSG00000096968",
    "Description":"Janus kinase 2 [Source:HGNC Symbol;Acc:6192]",
    "Chromosome Name":"9",
    "Gene Start (bp)":4985033,
    "Gene End (bp)":5128183,
    "Strand":1,
    "Band":"p24.1",
    "Associated Gene Name":"JAK2",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":5,
    "% GC content":37.53,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":3717,
    "HGNC ID(s)":6192,
    "HGNC symbol":"JAK2"
  },
  {
    "Ensembl Gene ID":"ENSG00000097007",
    "Description":"c-abl oncogene 1, non-receptor tyrosine kinase [Source:HGNC Symbol;Acc:76]",
    "Chromosome Name":"9",
    "Gene Start (bp)":133589333,
    "Gene End (bp)":133763062,
    "Strand":1,
    "Band":"q34.12",
    "Associated Gene Name":"ABL1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":3,
    "% GC content":44.47,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":25,
    "HGNC ID(s)":76,
    "HGNC symbol":"ABL1"
  },
  {
    "Ensembl Gene ID":"ENSG00000148400",
    "Description":"notch 1 [Source:HGNC Symbol;Acc:7881]",
    "Chromosome Name":"9",
    "Gene Start (bp)":139388896,
    "Gene End (bp)":139440314,
    "Strand":-1,
    "Band":"q34.3",
    "Associated Gene Name":"NOTCH1",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":3,
    "% GC content":63.39,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":4851,
    "HGNC ID(s)":7881,
    "HGNC symbol":"NOTCH1"
  },
  {
    "Ensembl Gene ID":"ENSG00000267910",
    "Description":"lysine (K)-specific methyltransferase 2A [Source:HGNC Symbol;Acc:7132]",
    "Chromosome Name":"HG122_PATCH",
    "Gene Start (bp)":118307205,
    "Gene End (bp)":118397539,
    "Strand":1,
    "Band":"q23.3",
    "Associated Gene Name":"KMT2A",
    "Associated Gene DB":"HGNC Symbol",
    "Transcript count":15,
    "% GC content":41.25,
    "Gene Biotype":"protein_coding",
    "Source (gene)":"ensembl_havana",
    "Status (gene)":"KNOWN",
    "EntrezGene ID":4297,
    "HGNC ID(s)":7132,
    "HGNC symbol":"KMT2A"
  }
]
return geneList;
}
