
vcf.rdfize = function(){
var answer=[]    
var w=this.head;
var fileName = 'fileNameString';
var prefix = 'vcf:'; //It's important to put : at the end of string. vcf: is a example'
var prefixUrl = 'http://vcf.este.mathbiol.org/'+fileName+"#";
var propertiesPrefix = 'prop:'; //It's important to put : at the end of string. vcf: is a example'
var propertiesPrefixUrl = 'http://vcf.este.mathbiol.org/properties/';
var locationPrefix = 'genomemaps:'
var locationPrefixUrl = 'http://genomemaps.org/?region='

//inserts prefix at the file begining
answer.push('@prefix '+ prefix + ' <' + prefixUrl + '> .');
answer.push('@prefix '+ propertiesPrefix + ' <' + propertiesPrefixUrl + '> .');
answer.push('@prefix '+ locationPrefix + ' <' + locationPrefixUrl + '> .');

answer.push('');// inserts a white line between prefixs and statements 
    
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
    
w=this.body;
    
        for (var x in w){
        
            if (typeof w[x] === 'object'){
            
            for (var y in w[x]){
               //answer.push(prefix + x + ' ' + propertiesPrefix + "hasId " + y +' .');
                
                if (typeof w[x][y] === 'object'){
                    for (var z in w[x][y]){
                        if (Array.isArray(w[x][y][z])){
                            for (var a in w[x][y][z]){
                                answer.push("<"+locationPrefixUrl + w[x]['CHROM']+':'+w[x]['POS']+'> ' +propertiesPrefix+z+'_'+a+' "' + w[x][y][z][a] + '" .');
                            }
                        } else {
                        //answer.push('<'+prefix + fileName+ '/'+x+'/> <'+prefix +y+'/'+z+'/> "'+w[x][y][z]+'" .');
                        }   
                    }
                } else if (Array.isArray(w[x][y])){
                    for (var z in w[x][y]){
                        
                        //answer.push('<'+prefix + fileName+ '/' +x+'/> <'+prefix +y+'/'+z+'/> "'+w[x][y][z]+'" .');
                        
                    }
                } else if (typeof w[x][y] === 'string'){
                    ////for (var z in w[x][y]){
                        //answer.push('<'+prefix + fileName+ '/' +x+'/> <'+prefix +y+'/> "'+w[x][y]+'" .');
                    ////}
                }
            }
        }
    }    
    
    
return answer;       
};
