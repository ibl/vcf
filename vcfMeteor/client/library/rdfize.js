console.log("loaded rdfize.js");
//function to generate UUID



vcf.rdfize = function(){
var answer=[]    
var w=this.head;
//var fileName = 'fileNameString';
var prefix = 'este:'; //It's important to put : at the end of string. vcf: is a example'
var prefixUrl = 'http://vcf.este.mathbiol.org/';
var propertiesPrefix = 'prop:'; //It's important to put : at the end of string. vcf: is a example'
var propertiesPrefixUrl = 'http://vcf.este.mathbiol.org/properties/';
var locationPrefix = 'genomemaps:'
var locationPrefixUrl = 'http://genomemaps.org/?region='

//inserts prefix at the file begining


answer.push('@prefix '+ prefix + ' <' + prefixUrl + '> .');
answer.push('@prefix '+ propertiesPrefix + ' <' + propertiesPrefixUrl + '> .');
answer.push('@prefix '+ locationPrefix + ' <' + locationPrefixUrl + '> .');

answer.push('');// inserts a white line between prefixs and statements 

//inserts a few lines before the digested file
var vcfURL = 'http://dbpedia.org/resource/Variant_Call_Format'
answer.push( prefix+vcf.id + ' a <' + vcfURL+ '> .');
answer.push( prefix+vcf.id +' '+ propertiesPrefix + 'fileName "' + vcf.fileName +'" .');
answer.push( prefix+vcf.id +' '+ propertiesPrefix + 'fileSize ' + vcf.fileSize +' .');
    
        for (var x in w){
            
            if (x.search(/\./) > -1){
                answer.push ( '<'+ prefixUrl + x + '> a ' + prefix + 'header .')
                    }else{
                        answer.push ( prefix + x + ' a ' + prefix + 'header .')
                }; 
            
            if (typeof w[x] === 'string' && x.search(/\./) > -1){
                answer.push( '<'+prefixUrl + x +'> ' + propertiesPrefix + 'value "'+w[x]+'" .');
            }else if (typeof w[x] === 'string' && x.search(/\./)=== -1) {
                answer.push( prefix + x +' ' + propertiesPrefix + 'value' +' "'+w[x]+'" .');
                
            }else if (Array.isArray(w[x])){ //did't find any array on Head
            
                for (var y in w[x]){
                    answer.push(prefix +'/'+ w[x][y]+' '+prefix+'is "'+x+'" .');
                }
        
            } else if (typeof w[x] === 'object'){
            
            for (var y in w[x]){
                
                answer.push(prefix + y +' a ' +prefix + x + ' .');
                
                if (typeof w[x][y] === 'object'){
                    for (var z in w[x][y]){
                        answer.push(prefix + y +' '+propertiesPrefix +z+' "'+w[x][y][z]+'" .');
                    }
                }
            }
        }
    }
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
