console.log("loaded rdfize.js");
//function to generate UUID

vcf.vcf2rdf=function (){

fileMetaData =  {"_id": vcf._id, "fileName": vcf.fileName, "fileSize": vcf.fileSize, "file_id": vcf._id}

return "@prefix vcf: <http://vcf.este.mathbiol.org/> ."+"\n"+
"@prefix prop: <http://vcf.este.mathbiol.org/properties/> ."+"\n"+

"@prefix dbpedia: <http://dbpedia.org> ."+"\n"+
"\n"+
"prop:file_id a dbpedia:Variant_Call_Format ."+"\n"+
"prop:fieldName a vcf:meta_information ."+"\n"+
"prop:CHROM a <http://dbpedia.org/ontology/chromosome> ."+"\n"+
"prop:POS a vcf:field ."+"\n"+
"prop:REF a vcf:field ."+"\n"+
"prop:ALT a vcf:field ."+"\n"+
"prop:QUAL a vcf:field ."+"\n"+
"prop:FILTER a vcf:field ."+"\n"+
"prop:FORMAT a vcf:field ."+"\n"+
oneLevelParser(fileMetaData, "vcf", "prop", "") +
 vcf.head2rdf() + vcf.rows2rdf() + vcf.samples2rdf();

 //the ID is ambiguous in nature on vcfs files. The next line could be troublesome if implemented
//because ID is present in header and as a field with different meanings

//"vcf:ID rdf:subClassOf prop:fieldName ."+"\n"+

}

/*used only one time to get geneTable and convert it to triples
vcf.vcf2rdf_backup=function (){

//fileMetaData =  {"_id": vcf._id, "fileName": vcf.fileName, "fileSize": vcf.fileSize}

return "@prefix gene: <http://vcf.este.mathbiol.org/gene/> ."+"\n"+
"@prefix prop: <http://vcf.este.mathbiol.org/propertie/> ."+"\n"+"\n"+
//oneLevelParser(fileMetaData, "vcf", "prop", "") +
 //vcf.head2rdf() + vcf.rows2rdf() + vcf.samples2rdf();
 vcf.geneTable2rdf();
}
*/

vcf.samples2rdf = function() {
    var samples = vcf.getSamples();
    //oneLevelParser(vcf.getSamples()[90], 'vcf', 'prop', '');
    var a = "";
    for (var x = 0 ; x < samples.length; x++){
        a = a +  oneLevelParser(samples[x], 'vcf', 'prop', 'UUID-');
    }
    return a;
}

vcf.rows2rdf = function() {
    var rows = vcf.getRows();
    //oneLevelParser(vcf.getSamples()[90], 'vcf', 'prop', '');
    var a = "";
    for (var x = 0 ; x < rows.length; x++){
        a = a +  oneLevelParser(rows[x], 'vcf', 'prop', 'UUID-');
    }
    return a;
}

vcf.head2rdf = function() {
    //var rows = vcf.getRows();
    //oneLevelParser(vcf.getSamples()[90], 'vcf', 'prop', '');
    var a = "";
    for (var x = 0 ; x < vcf.head.length; x++){
        a = a +  oneLevelParser(vcf.head[x], 'vcf', 'prop', '');
    }
    return a;
}

var convertGeneTableToRdf = function(){

    var a = "";
    for (var x = 0 ; x < geneTable.length; x++){
        //add a id field without ^UUID
        geneTable[x]._id = Math.uuid();
        a = a +  oneLevelParser(geneTable[x], 'gene', 'prop', 'UUID-');
    }
    return a;
}



vcf.rdfize = function(){
    //vcf._id="UUID-"+vcf._id
var answer=[]    
var w=this.head;
//var fileName = 'fileNameString';
var prefix = 'vcf:'; //It's important to put : at the end of string. vcf: is a example'
var prefixUrl = 'http://vcf.este.mathbiol.org/';
var propertiesPrefix = 'prop:'; //It's important to put : at the end of string. vcf: is a example'
var propertiesPrefixUrl = 'http://vcf.este.mathbiol.org/properties/';
//var locationPrefix = 'genomemaps:'
//var locationPrefixUrl = 'http://genomemaps.org/?region='

//inserts prefix at the file begining


//answer.push('@prefix '+ prefix + ' <' + prefixUrl + '> .');
//answer.push('@prefix '+ propertiesPrefix + ' <' + propertiesPrefixUrl + '> .');
//answer.push('@prefix '+ locationPrefix + ' <' + locationPrefixUrl + '> .');

//answer.push('');// inserts a white line between prefixs and statements 

//inserts a few lines before the digested file
var vcfURL = 'http://dbpedia.org/resource/Variant_Call_Format'
answer.push( prefix+vcf._id + ' a <' + vcfURL+ '> .');
//answer.push( prefix+vcf.id +' '+ propertiesPrefix + 'fileName "' + vcf.fileName +'" .');
//answer.push( prefix+vcf.id +' '+ propertiesPrefix + 'fileSize ' + vcf.fileSize +' .');
    
        for (var x in w){
            
            if (x.search(/\./) > -1){
                answer.push ( '<'+ prefixUrl + x + '> a ' + prefix + 'header .')
                    }else{
                        answer.push ( prefix + x + ' a ' + prefix + 'header .')
                }; 
            
            if (typeof w[x] === 'string' && x.search(/\./) > -1){
                answer.push( '<'+prefixUrl + vcf._id +' ' + prefix + x + ' "'+w[x]+'" .');
            }else if (typeof w[x] === 'string' && x.search(/\./)=== -1) {
                answer.push( prefix +vcf._id +' ' + prefix + x +' "'+w[x]+'" .');
                
            }else if (Array.isArray(w[x])){ //did't find any array on Head
            
                for (var y in w[x]){
                    answer.push(prefix +'/'+ w[x][y]+' '+prefix+'is "'+x+'" .');
                }
        
            } else if (typeof w[x] === 'object'){
            
            for (var y in w[x]){
                
                answer.push(prefix + y +' a ' +prefix + x + ' .');
                
                if (typeof w[x][y] === 'object'){
                    for (var z in w[x][y]){
                        answer.push(prefix + vcf._id +' '+prefix +y+' "'+w[x][y][z]+'" .  -INFO-');
                    }
                }
            }
        }
    }
    return answer;
}

    /*
w=this.fields;

for (var x in w){
    answer.push(prefix + w[x] + ' a ' + prefix + 'field .');
};
    
    
w=this.body;
    
        for (var x in w){
            answer.push(prefix + 'row' + x + ' ' + propertiesPrefix + 'position <' + locationPrefixUrl + w[x]['CHROM']+':'+w[x]['POS']+'> .');
            

        
            if (typeof w[x] === 'object'){
            
            for (var y in w[x]){
               //answer.push(prefix + x + ' ' + propertiesPrefix + "hasId " + y +' .');
                
                 if (Array.isArray(w[x][y])){
                    for (var z in w[x][y]){
                        
                        if (typeof (w[x][y][z])!=='object') {
                            answer.push(prefix + 'row' + x + ' ' + prefix + y + ' ' + prefix + w[x][y][z] + ' .');
                            } else if (typeof (w[x][y][z])==='object'){
                                
                                
                                if (typeof (counter)==='undefined'){
                                var counter = 0;    
                                };
                                
                                var sNode = 'sampleNode' + counter;
                                answer.push(prefix + 'row' + x + ' ' + propertiesPrefix + 'has' + ' ' + prefix + sNode + ' .');


                                for (var a in w[x][y][z]){
                                    

                                    
                                    answer.push(prefix + sNode + ' ' + prefix +  a + ' "' + w[x][y][z][a] + '" .');
                                    
                                    
                                    
                                }
                                counter ++;
                            };
                    }
                } else if (typeof w[x][y] === 'object'){
                    for (var z in w[x][y]){
                        
                     //   if  (y!==='SAMPLES') {answer.push(prefix + 'row' + x + ' ' + prefix + y + ' ' + prefix + z + ' .');}
                        
                    }
                    
                } else if (typeof w[x][y] === 'string'){
                    answer.push(prefix + 'row' + x + ' ' + prefix + y + ' "' + w[x][y] + '" .');

                    ////for (var z in w[x][y]){
                        //answer.push('<'+prefix + fileName+ '/' +x+'/> <'+prefix +y+'/> "'+w[x][y]+'" .');
                    ////}
                }
            }
        }
    }    
    
    
return answer;       
};
*/