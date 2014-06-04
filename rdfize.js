
vcf.rdfize = function(){
var answer=[]    
    w=this.head
    
        for (var x in w){
        
            if (typeof w[x] === 'string'){
                answer.push("<"+x+"><hasValue><"+w[x]+">");    
        
            } else if (Array.isArray(w[x])){
            
                for (var y in w[x]){
                    answer.push("<"+w[x][y]+"><is><"+x+">");
                }
        
            } else if (typeof w[x] === 'object'){
            
            for (var y in w[x]){
                answer.push("<"+x+"><hasID><"+y+">");
                
                if (typeof w[x][y] === 'object'){
                    for (var z in w[x][y]){
                        answer.push("<"+y+"><"+z+"><"+w[x][y][z]+">");
                    }
                }
            }
        }
    }
return answer;       
};

vcf.rdfizeBody = function(){
var answer=[]    
    w=this.body;
    
        for (var x in w){
        
            if (typeof w[x] === 'object'){
            
            for (var y in w[x]){
                answer.push("<"+x+"><hasID><"+y+">");
                
                if (typeof w[x][y] === 'object'){
                    for (var z in w[x][y]){
                        answer.push("<"+x+"><"+y+"><"+w[x][y][z]+">");
                    }
                } else if (Array.isArray(w[x][y])){

                        answer.push("<"+x+"><"+y+"><"+w[x][y]+">");
                    
                } else if (typeof w[x][y] === 'string'){
                    //for (var z in w[x][y]){
                        answer.push("<"+x+"><"+y+"><"+w[x][y]+">");
                    //}
                }
            }
        }
    }
return answer;       
};

var blastOff;
blastOff = function (n){
    
    if (n===0){
        return "blastOff"
    }
    
    return n+"..."+blastOff(n-1);
    
    
}

blastOff = function f (n){
    
    if (n===0){
        return "blastOff"
    }
    
    return n+"..."+f (n-1);
    
    
}
