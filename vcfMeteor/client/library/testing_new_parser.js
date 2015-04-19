"use strict";
/*jshint multistr: true */  //use while developing
/*jslint devel: true */

//functions in use
var set_context_rec = function generate_context(domain, object){
	var res={};
	for (var key in object) {
		if (key != "@context"){
		res[key]=domain+key	
			if (!Array.isArray(object[key]) && typeof object[key] === "object"){
				var res_temp=(generate_context(domain, object[key]))
				for (var attr in res_temp){
					res[attr]=res_temp[attr]
				}
			}
		}
	}
	return res;
}

//test variables
var mystring = '##fileformat=VCFv4.0\n\
##fileDate=20111031\n\
##center=UCSC\n\
##source="bambam pipeline v1.4"\n\
##reference=<ID=grch37-lite,source="ftp://ftp.ncbi.nih.gov/genbank/genomes/Eukaryotes/vertebrates_mammals/Homo_sapiens/GRCh37/special_requests/GRCh37-lite.fa.gz">\n\
##phasing=none\n\
##INDIVIDUAL=TCGA-AN-A0FN\n\
##SAMPLE=<ID=NORMAL,SampleUUID=cab9af86-5f00-4d36-8d62-424add7d7492,SampleTCGABarcode=TCGA-AN-A0FN-10A-01W-A055-09,Individual=TCGA-AN-A0FN,Description="Normal Sample",File=/inside/home/cwilks/bb_pipeline/runs/brca_freeze/bams/TCGA-AN-A0FN-10A-01W-A055-09_IlluminaGA-DNASeq_exome.bam,Platform=Illumina,Source=CGHub,Accession=14870d32-bbf4-4ec0-8d06-f42d4f7eb869,SequenceSource=WXS,softwareName=<bambam>,sotwareVer=<1.4>,softwareParam=<minSuppSNP=1,minSuppIndel=1,minSuppSV=2,minQ=20,minNQS=10,minMapQ=20,minMapQIndel=1,avgMapQ=10,inProb=0.97,lProb=0.999,tProb=0.001,fracGerm=0.1>>\n\
##INFO=<ID=fa20,Number=0,Type=Flag,Description="Fraction of ALT below 20% of reads">\n\
##FILTER=<ID=q10,Description="Genotype Quality < 10">\n\
##FILTER=<ID=blq,Description="Position overlaps 1000 Genomes Project mapping quality blacklist">\n\
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	NORMAL	PRIMARY\n\
1	888659	rs3748597	T	C	81.0	PASS	ProtCh=p.I97V;SS=1;DB;VT=SNP;DP=41;EFF=missense_variant(MODERATE|MISSENSE|Atc/Gtc|p.Ile300Val/c.898A>G|749|NOC2L|protein_coding|CODING|NM_015658.3|9|C)	GT:DP:AD:BQ:MQ:SB:FA:SS:SSC:MQA	1/1:21:0,21:0,37:0:0,0.81:1.0:0:81:0,53.0	1/1:20:0,20:0,36:0:0,0.75:1.0:1:81:0,55.7\n\
1	889158	rs56262069	G	C	26.0	PASS	SS=1;VT=SNP;DB;DP=11;EFF=splice_region_variant+intron_variant(LOW|||c.888+4C>G|749|NOC2L|protein_coding|CODING|NM_015658.3|8|C)	GT:DP:AD:BQ:MQ:SB:FA:SS:SSC:MQA	1/1:5:0,5:0,36:0:0,0.2:1.0:0:26:0,60.0	1/1:6:0,6:0,35:0:0,0.167:1.0:1:26:0,60.0\n\
1	889159	rs13302945	A	C	26.0	PASS	SS=1;VT=SNP;DB;DP=11;EFF=splice_region_variant+intron_variant(LOW|||c.888+3T>G|749|NOC2L|protein_coding|CODING|NM_015658.3|8|C)	GT:DP:AD:BQ:MQ:SB:FA:SS:SSC:MQA	1/1:5:0,5:0,36:0:0,0.2:1.0:0:26:0,60.0	1/1:6:0,6:0,35:0:0,0.167:1.0:1:26:0,60.0'

//TODO ##INFO=<ID=VT,Number=1,Type=String,Description="Variant type, can be SNP, INS or DEL">\n\ 
// fix the parser to handle correctly this line. I should capture <>, "", and then \,

//vcf_file
var vcf={};
vcf.head={};
vcf.body={};

function parse_head_line(head_line){
	var res = {}
	res.name=""
	res.data={}
	//create context object
	//res["@context"] = {};
	//console.log("function called");
	//head = head.split("\n"); //split on new line caracter

	//for (var item in head){
		//var head_line=head[item]
		//if (head_line.slice(0,2) === "##"){
			head_line=head_line.slice(2) //drop ## at start of the line
			.replace(/\>$/,"")
			.replace(/\"/g,"")
			.split(",")
			.map(function(a){return a.split("=")});

			console.log(head_line)

			for (var j in head_line){
				if (head_line[j].length==2){
					res.name=head_line[j][0]
					res.data= head_line[j][1]
				} else if (head_line[j].length > 2){
				if (head_line[j].length == 3 && head_line[0][1]== "<ID"){					
					var key = head_line[0][0]+"_ID_"+head_line[0][2]
					res.name=key
					for (var i = 1; i < head_line.length; i++){
						var h = head_line[i]
						res.data[h[0]] = h[1]
					}
				}
			}
		//}else{
		}
			return res
		}
	//}

function parse_format(FORMAT){
	return FORMAT.split(":").map(function(a){return "FORMAT_ID_"+a})
}

function parse_info(INFO){
	var res={}
	res.INFO={}
	
	INFO
		.split(";")
		.map(function(a){
			return a.split("=")
		})
		.map(function(a){
			if (a.length === 1){
				res.INFO[a[0]]=true;
			} else if (a.length ===2) {
				res.INFO[a[0]]=a[1]
			} else if (a.length ===3) {
				console.log("error found on INFO field.")
			};
		})

	return res
}


function parse_sample(FORMAT, Sample){
	var res = {}
	res.FORMAT = {}
	Sample = Sample.split(":")
	if (FORMAT.length != Sample.length){
		console.log("FORMAT does not have the same length of Sample")
	}else{		
		for (var i=0; i<FORMAT.length; i++){
			res.FORMAT[FORMAT[i]]=Sample[i]
		}
	}
	return res
}

function parse_gt(gt){
	var res = {}
	res.gt = {}
	gt = gt.split(/([\/\|])/)

	if (gt.length>3){
		console.log("polyploid found, parser is compromised")
	} else if (gt.length===3){
		res.gt.firstParentalAllele = gt[0]
		res.gt.secondParentalAllele = gt[2]

		if (gt[1]=="|"){
			res.gt.phased = true
		} else	if (gt[1]=="/"){
			res.gt.phased = false
		}
	} else if (gt.length ===1){
		res.gt.allele = gt[0]
	}

	return res
}

function parse_alt(alt){
	return alt.split(",")

}

function parse_colnames(colnames){
		return colnames.slice(1).split(/\t/)
	}

function parse_body_line(body_line, colnames, n_line){
	var res = {};
	res.name=""
	//var rows = body.split("\n"); //split on new line caracter
	//var colnames=[];
	//for (var i in rows){
		//var row = rows[i]
		//console.log(row[0], row[1])
		//if (row[0] == "#" && row[1] != "#"){
			//colnames=row.slice(1).split(/\t/) //drop # at start of the line
			//console.log(colnames)
			//} else if (row[0] != "#"){
	body_line = body_line.split(/\t/)
	var myobj = {}
	for (var i = 0; i < body_line.length; i++){
		myobj[colnames[i]] = body_line[i]
	}

	res.name="row_"+n_line
	res.data=myobj
	//res["row_"+n_line]=myobj
	return res
}	
	//}

function parse_vcf(vcf){
	vcf = vcf.split("\n");
	var res={}
	res.head={}
	res.body={}
	var colnames=[]

	for (var i =0; i < vcf.length; i++){
		var line
		if (vcf[i].slice(0,2) === "##"){
			line=parse_head_line(vcf[i])
			res.head[line.name]=line.data
		} else	if (vcf[i][0] == "#" && vcf[i][1] != "#"){
			colnames=parse_colnames(vcf[i])
		} else	if (vcf[i][0] != "#"){
			line = parse_body_line(vcf[i], colnames, i)
			res.body[line.name]=line.data
		}
	}
	return res
}

function t_main (){
var mydomain = "http://vcf/"

var shortstring = '##source="bambam pipeline v1.4"\n\
##reference=<ID=grch37-lite,source="ftp://ftp.ncbi.nih.gov/genbank/genomes/Eukaryotes/vertebrates_mammals/Homo_sapiens/GRCh37/special_requests/GRCh37-lite.fa.gz">\n\
##INFO=<ID=DB,Number=0,Type=Flag,Description="dbSNP membership">\n\
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	NORMAL	PRIMARY\n\
1	888659	rs3748597	T	C	81.0	PASS	ProtCh=p.I97V;SS=1;DB;VT=SNP;DP=41;EFF=missense_variant(MODERATE|MISSENSE|Atc/Gtc|p.Ile300Val/c.898A>G|749|NOC2L|protein_coding|CODING|NM_015658.3|9|C)	GT:DP:AD:BQ:MQ:SB:FA:SS:SSC:MQA	1/1:21:0,21:0,37:0:0,0.81:1.0:0:81:0,53.0	1/1:20:0,20:0,36:0:0,0.75:1.0:1:81:0,55.7\n\
1	888659	rs3748597	T	C	81.0	PASS	ProtCh=p.I97V;SS=1;DB;VT=SNP;DP=41;EFF=missense_variant(MODERATE|MISSENSE|Atc/Gtc|p.Ile300Val/c.898A>G|749|NOC2L|protein_coding|CODING|NM_015658.3|9|C)	GT:DP:AD:BQ:MQ:SB:FA:SS:SSC:MQA	1/1:21:0,21:0,37:0:0,0.81:1.0:0:81:0,53.0	1/1:20:0,20:0,36:0:0,0.75:1.0:1:81:0,55.7'

vcf=parse_vcf(mystring)
//console.log(vcf)

//vcf.head = parse_head_line('##INFO=<ID=DB,Number=0,Type=Flag,Description="dbSNP membership">')
//vcf.colnames = parse_colnames('#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	NORMAL	PRIMARY')
//vcf.body = parse_body_line('1	888659	rs3748597	T	C	81.0	PASS	ProtCh=p.I97V;SS=1;DB;VT=SNP;DP=41;EFF=missense_variant(MODERATE|MISSENSE|Atc/Gtc|p.Ile300Val/c.898A>G|749|NOC2L|protein_coding|CODING|NM_015658.3|9|C)	GT:DP:AD:BQ:MQ:SB:FA:SS:SSC:MQA	1/1:21:0,21:0,37:0:0,0.81:1.0:0:81:0,53.0	1/1:20:0,20:0,36:0:0,0.75:1.0:1:81:0,55.7', vcf.colnames, 123)
//vcf = parse_vcf(mystring)
//for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }
//console.log(vcf)

vcf["@context"]=set_context_rec(mydomain, vcf)

console.log(vcf.body.row_13.FORMAT)

//console.log(JSON.stringify(vcf.head))
//console.log(JSON.stringify(vcf.colnames))
//console.log(JSON.stringify(vcf.body))
console.log(JSON.stringify(vcf))


// var lele = {}
// lele["@context"]={}
// lele.body = split_body(mystring)
// lele["@context"]=set_context_rec(mydomain, lele)
// console.log("------------")
//console.log(JSON.stringify(lele))

//parse_format (lele.body.FORMAT)
}
