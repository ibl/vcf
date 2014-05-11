var getGeneList = function(){

  var geneList = [
  {
    "Ensembl Gene ID":"ENSG00000117400",
    "Chromosome Name":"1",
    "Gene Start (bp)":43803478,
    "Gene End (bp)":43818443,
    "HGNC symbol":"MPL",
    "HGNC ID(s)":7217,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000213281",
    "Chromosome Name":"1",
    "Gene Start (bp)":115247090,
    "Gene End (bp)":115259515,
    "HGNC symbol":"NRAS",
    "HGNC ID(s)":7989,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000171862",
    "Chromosome Name":"10",
    "Gene Start (bp)":89622870,
    "Gene End (bp)":89731687,
    "HGNC symbol":"PTEN",
    "HGNC ID(s)":9588,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000165731",
    "Chromosome Name":"10",
    "Gene Start (bp)":43572475,
    "Gene End (bp)":43625799,
    "HGNC symbol":"RET",
    "HGNC ID(s)":9967,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000184937",
    "Chromosome Name":"11",
    "Gene Start (bp)":32409321,
    "Gene End (bp)":32457176,
    "HGNC symbol":"WT1",
    "HGNC ID(s)":12796,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000149311",
    "Chromosome Name":"11",
    "Gene Start (bp)":108093211,
    "Gene End (bp)":108239829,
    "HGNC symbol":"ATM",
    "HGNC ID(s)":795,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000118058",
    "Chromosome Name":"11",
    "Gene Start (bp)":118307205,
    "Gene End (bp)":118397539,
    "HGNC symbol":"KMT2A",
    "HGNC ID(s)":7132,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000133703",
    "Chromosome Name":"12",
    "Gene Start (bp)":25357723,
    "Gene End (bp)":25403870,
    "HGNC symbol":"KRAS",
    "HGNC ID(s)":6407,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000179295",
    "Chromosome Name":"12",
    "Gene Start (bp)":112856155,
    "Gene End (bp)":112947717,
    "HGNC symbol":"PTPN11",
    "HGNC ID(s)":9644,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000139687",
    "Chromosome Name":"13",
    "Gene Start (bp)":48877887,
    "Gene End (bp)":49056122,
    "HGNC symbol":"RB1",
    "HGNC ID(s)":9884,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000122025",
    "Chromosome Name":"13",
    "Gene Start (bp)":28577411,
    "Gene End (bp)":28674729,
    "HGNC symbol":"FLT3",
    "HGNC ID(s)":3765,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000142208",
    "Chromosome Name":"14",
    "Gene Start (bp)":105235686,
    "Gene End (bp)":105262088,
    "HGNC symbol":"AKT1",
    "HGNC ID(s)":391,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000182054",
    "Chromosome Name":"15",
    "Gene Start (bp)":90626277,
    "Gene End (bp)":90645736,
    "HGNC symbol":"IDH2",
    "HGNC ID(s)":5383,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000141736",
    "Chromosome Name":"17",
    "Gene Start (bp)":37844167,
    "Gene End (bp)":37886679,
    "HGNC symbol":"ERBB2",
    "HGNC ID(s)":3430,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000141510",
    "Chromosome Name":"17",
    "Gene Start (bp)":7565097,
    "Gene End (bp)":7590856,
    "HGNC symbol":"TP53",
    "HGNC ID(s)":11998,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000118046",
    "Chromosome Name":"19",
    "Gene Start (bp)":1189406,
    "Gene End (bp)":1228428,
    "HGNC symbol":"STK11",
    "HGNC ID(s)":11389,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000126934",
    "Chromosome Name":"19",
    "Gene Start (bp)":4090319,
    "Gene End (bp)":4124126,
    "HGNC symbol":"MAP2K2",
    "HGNC ID(s)":6842,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000245848",
    "Chromosome Name":"19",
    "Gene Start (bp)":33790840,
    "Gene End (bp)":33793470,
    "HGNC symbol":"CEBPA",
    "HGNC ID(s)":1833,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000119772",
    "Chromosome Name":"2",
    "Gene Start (bp)":25455845,
    "Gene End (bp)":25565459,
    "HGNC symbol":"DNMT3A",
    "HGNC ID(s)":2978,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000138413",
    "Chromosome Name":"2",
    "Gene Start (bp)":209100951,
    "Gene End (bp)":209130798,
    "HGNC symbol":"IDH1",
    "HGNC ID(s)":5382,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000171094",
    "Chromosome Name":"2",
    "Gene Start (bp)":29415640,
    "Gene End (bp)":30144432,
    "HGNC symbol":"ALK",
    "HGNC ID(s)":427,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000171456",
    "Chromosome Name":"20",
    "Gene Start (bp)":30946155,
    "Gene End (bp)":31027122,
    "HGNC symbol":"ASXL1",
    "HGNC ID(s)":18318,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000159216",
    "Chromosome Name":"21",
    "Gene Start (bp)":36160098,
    "Gene End (bp)":37376965,
    "HGNC symbol":"RUNX1",
    "HGNC ID(s)":10471,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000100030",
    "Chromosome Name":"22",
    "Gene Start (bp)":22108789,
    "Gene End (bp)":22221970,
    "HGNC symbol":"MAPK1",
    "HGNC ID(s)":6871,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000121879",
    "Chromosome Name":"3",
    "Gene Start (bp)":178865902,
    "Gene End (bp)":178957881,
    "HGNC symbol":"PIK3CA",
    "HGNC ID(s)":8975,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000168036",
    "Chromosome Name":"3",
    "Gene Start (bp)":41236328,
    "Gene End (bp)":41301587,
    "HGNC symbol":"CTNNB1",
    "HGNC ID(s)":2514,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000172936",
    "Chromosome Name":"3",
    "Gene Start (bp)":38179969,
    "Gene End (bp)":38184513,
    "HGNC symbol":"MYD88",
    "HGNC ID(s)":7562,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000134086",
    "Chromosome Name":"3",
    "Gene Start (bp)":10182692,
    "Gene End (bp)":10193904,
    "HGNC symbol":"VHL",
    "HGNC ID(s)":12687,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000134853",
    "Chromosome Name":"4",
    "Gene Start (bp)":55095264,
    "Gene End (bp)":55164414,
    "HGNC symbol":"PDGFRA",
    "HGNC ID(s)":8803,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000157404",
    "Chromosome Name":"4",
    "Gene Start (bp)":55524085,
    "Gene End (bp)":55606881,
    "HGNC symbol":"KIT",
    "HGNC ID(s)":6342,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000168769",
    "Chromosome Name":"4",
    "Gene Start (bp)":106067032,
    "Gene End (bp)":106200973,
    "HGNC symbol":"TET2",
    "HGNC ID(s)":25941,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000134982",
    "Chromosome Name":"5",
    "Gene Start (bp)":112043195,
    "Gene End (bp)":112181936,
    "HGNC symbol":"APC",
    "HGNC ID(s)":583,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000181163",
    "Chromosome Name":"5",
    "Gene Start (bp)":170814120,
    "Gene End (bp)":170838141,
    "HGNC symbol":"NPM1",
    "HGNC ID(s)":7910,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000160867",
    "Chromosome Name":"5",
    "Gene Start (bp)":176513887,
    "Gene End (bp)":176525145,
    "HGNC symbol":"FGFR4",
    "HGNC ID(s)":3691,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000091831",
    "Chromosome Name":"6",
    "Gene Start (bp)":151977826,
    "Gene End (bp)":152450754,
    "HGNC symbol":"ESR1",
    "HGNC ID(s)":3467,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000157764",
    "Chromosome Name":"7",
    "Gene Start (bp)":140419127,
    "Gene End (bp)":140624564,
    "HGNC symbol":"BRAF",
    "HGNC ID(s)":1097,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000105976",
    "Chromosome Name":"7",
    "Gene Start (bp)":116312444,
    "Gene End (bp)":116438440,
    "HGNC symbol":"MET",
    "HGNC ID(s)":7029,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000146648",
    "Chromosome Name":"7",
    "Gene Start (bp)":55086714,
    "Gene End (bp)":55324313,
    "HGNC symbol":"EGFR",
    "HGNC ID(s)":3236,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000136997",
    "Chromosome Name":"8",
    "Gene Start (bp)":128747680,
    "Gene End (bp)":128753674,
    "HGNC symbol":"MYC",
    "HGNC ID(s)":7553,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000148400",
    "Chromosome Name":"9",
    "Gene Start (bp)":139388896,
    "Gene End (bp)":139440314,
    "HGNC symbol":"NOTCH1",
    "HGNC ID(s)":7881,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000097007",
    "Chromosome Name":"9",
    "Gene Start (bp)":133589333,
    "Gene End (bp)":133763062,
    "HGNC symbol":"ABL1",
    "HGNC ID(s)":76,
    "Status (gene)":"KNOWN"
  },
  {
    "Ensembl Gene ID":"ENSG00000096968",
    "Chromosome Name":"9",
    "Gene Start (bp)":4985033,
    "Gene End (bp)":5128183,
    "HGNC symbol":"JAK2",
    "HGNC ID(s)":6192,
    "Status (gene)":"KNOWN"
  }
]
  
  


return geneList;
};

//function that find variations on GPS oncogenes.
var findVariantsOnGenes = function(vcfBody){
  var sample = vcfBody;
  var list = getGeneList();
  var variantsFound = [];
  
  for (var counter = 0; counter < sample.length; counter++){//sample.length; x++){
    
    for (var counter2 = 0; counter2 < list.length; counter2++){//yy < list.length; y++){
     
      
    if (sample[counter]['CHROM']=="chr"+list[counter2]['Chromosome Name']){
      if (sample[counter]['POS']>list[counter2]['Gene Start (bp)']&&
      sample[counter]['POS']< list[counter2]['Gene End (bp)']){
        variantsFound.push({
          'gene':list[counter2]['HGNC symbol'],
          'chromosome':sample[counter]['CHROM'],
          'position':sample[counter]['POS'],
          'vcfLine':counter,
        });
    }
    }
    
  }
}
return  variantsFound;
}