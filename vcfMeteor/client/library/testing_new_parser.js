"use strict";
/*jshint multistr: true */  //use while developing
/*jslint devel: true */
var mystring = '##fileformat=VCFv4.0\n\
##fileDate=20111031\n\
##center=UCSC\n\
##source="bambam pipeline v1.4"\n\
##reference=<ID=grch37-lite,source="ftp://ftp.ncbi.nih.gov/genbank/genomes/Eukaryotes/vertebrates_mammals/Homo_sapiens/GRCh37/special_requests/GRCh37-lite.fa.gz">\n\
##phasing=none\n\
##INDIVIDUAL=TCGA-AN-A0FN\n\
##SAMPLE=<ID=NORMAL,SampleUUID=cab9af86-5f00-4d36-8d62-424add7d7492,SampleTCGABarcode=TCGA-AN-A0FN-10A-01W-A055-09,Individual=TCGA-AN-A0FN,Description="Normal Sample",File=/inside/home/cwilks/bb_pipeline/runs/brca_freeze/bams/TCGA-AN-A0FN-10A-01W-A055-09_IlluminaGA-DNASeq_exome.bam,Platform=Illumina,Source=CGHub,Accession=14870d32-bbf4-4ec0-8d06-f42d4f7eb869,SequenceSource=WXS,softwareName=<bambam>,sotwareVer=<1.4>,softwareParam=<minSuppSNP=1,minSuppIndel=1,minSuppSV=2,minQ=20,minNQS=10,minMapQ=20,minMapQIndel=1,avgMapQ=10,inProb=0.97,lProb=0.999,tProb=0.001,fracGerm=0.1>>\n\
##SAMPLE=<ID=PRIMARY,SampleUUID=8f583981-b257-43ee-9c9e-71a192a49d38,SampleTCGABarcode=TCGA-AN-A0FN-01A-11W-A050-09,Individual=TCGA-AN-A0FN,Description="Primary Tumor",File=/inside/home/cwilks/bb_pipeline/runs/brca_freeze/bams/TCGA-AN-A0FN-01A-11W-A050-09_IlluminaGA-DNASeq_exome.bam,Platform=Illumina,Source=CGHub,Accession=9916ae94-ee9a-469d-a560-d5b457c9e02a,SequenceSource=WXS,softwareName=<bambam>,sotwareVer=<1.4>,softwareParam=<minSuppSNP=1,minSuppIndel=1,minSuppSV=2,minQ=20,minNQS=10,minMapQ=20,minMapQIndel=1,avgMapQ=10,inProb=0.97,lProb=0.999,tProb=0.001,fracGerm=0.1>>\n\
##INFO=<ID=DB,Number=0,Type=Flag,Description="dbSNP membership">\n\
##INFO=<ID=SOMATIC,Number=0,Type=Flag,Description="Indicates if record is a somatic mutation">\n\
##INFO=<ID=DB,Number=0,Type=Flag,Description="dbSNP membership">\n\
##INFO=<ID=SOMATIC,Number=0,Type=Flag,Description="Indicates if record is a somatic mutation">\n\
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth across samples">\n\
##INFO=<ID=DEL,Number=1,Type=Integer,Description="Deletion X bps away">\n\
##INFO=<ID=INS,Number=1,Type=Integer,Description="Insertion X bps away">\n\
##INFO=<ID=VT,Number=1,Type=String,Description="Variant type, can be SNP, INS or DEL">\n\
##INFO=<ID=ProtCh,Number=1,Type=String,Description="Protein change due to somatic variant">\n\
##INFO=<ID=SS,Number=1,Type=Integer,Description="Somatic status of sample">\n\
##INFO=<ID=fa20,Number=0,Type=Flag,Description="Fraction of ALT below 20% of reads">\n\
##FILTER=<ID=q10,Description="Genotype Quality < 10">\n\
##FILTER=<ID=blq,Description="Position overlaps 1000 Genomes Project mapping quality blacklist">\n\
1	888659	rs3748597	T	C	81.0	PASS	ProtCh=p.I97V;SS=1;DB;VT=SNP;DP=41;EFF=missense_variant(MODERATE|MISSENSE|Atc/Gtc|p.Ile300Val/c.898A>G|749|NOC2L|protein_coding|CODING|NM_015658.3|9|C)	GT:DP:AD:BQ:MQ:SB:FA:SS:SSC:MQA	1/1:21:0,21:0,37:0:0,0.81:1.0:0:81:0,53.0	1/1:20:0,20:0,36:0:0,0.75:1.0:1:81:0,55.7\n\
1	889158	rs56262069	G	C	26.0	PASS	SS=1;VT=SNP;DB;DP=11;EFF=splice_region_variant+intron_variant(LOW|||c.888+4C>G|749|NOC2L|protein_coding|CODING|NM_015658.3|8|C)	GT:DP:AD:BQ:MQ:SB:FA:SS:SSC:MQA	1/1:5:0,5:0,36:0:0,0.2:1.0:0:26:0,60.0	1/1:6:0,6:0,35:0:0,0.167:1.0:1:26:0,60.0\n\
1	889159	rs13302945	A	C	26.0	PASS	SS=1;VT=SNP;DB;DP=11;EFF=splice_region_variant+intron_variant(LOW|||c.888+3T>G|749|NOC2L|protein_coding|CODING|NM_015658.3|8|C)	GT:DP:AD:BQ:MQ:SB:FA:SS:SSC:MQA	1/1:5:0,5:0,36:0:0,0.2:1.0:0:26:0,60.0	1/1:6:0,6:0,35:0:0,0.167:1.0:1:26:0,60.0'


var vcf={};
vcf.head={};
vcf.body={};
//vcf_file

function t_main (){

function parse_head_line(head){
	var res = {}
	res["@context"] = {};
	console.log("function called");
	head = head.split("\n"); //split on new line caracter

	for (var item in head){
		var head_line=head[item]
		//console.log(head[i].slice(0,2))
		if (head_line.slice(0,2) === "##"){
			head_line=head_line.slice(2); //drop ## at start of the line
			head_line=head_line.replace(/\>$/,"")
			head_line=head_line.replace(/\"/g,"")
			head_line=head_line.split(",")
			head_line=head_line.map(function(a){return a.split("=")});

			console.log(head_line.length)
			for (var j in head_line){
				if (head_line.length==1){
					//console.log(head_line[j])
					res[head_line[j][0]]= head_line[j][1]
				}
			
			}
				//console.log(head_line)
				//res[head_line[0][0]]=head_line[0][1]

			if (head_line.length > 2){

					if (head_line[0].length == 3 && head_line[0][1]== "<ID"){
						
						var key = head_line[0][0]+"_ID_"+head_line[0][2]
						res[key]={}

						for (var i = 1; i < head_line.length; i++){
							var h = head_line[i]
							h[0]
							h[1]

							//res[key]={}
							//if (!res[key][head_line[i][0]]){res[key][head_line[i][0]]=[]}
							//res[key][head_line[i][0]] = []
							res[key][h[0]] = h[1]
						}
					}

				}
	}
}
//create context object
var mydomain = "http://diegopenhanut.github.io/vcf-resources/v4_2/"
//res["@context"] = {};
for (var key in res) {
	if (key != "@context"){
		res["@context"][key]=mydomain+key	
	}
	for (var innerkey in res[key]){
		if (typeof res[key]=="object"){
			res["@context"][innerkey]=mydomain+innerkey		
		}
	}


}
//console.log(context)

return res;
}
console.log(JSON.stringify(parse_head_line(mystring)))
}


