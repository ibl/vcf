    console.log('loaded mongoID.js');

    var lala = function (j){
        j._id = vcf._id
        
        //    delete j._id;
        //j = j.head;

        if  (j === 'undefined'){
            console.log ('undefined triggered')
            return  -1;
        }

        oneLevelParser(j, "vcf",  "prop:", "")
        
        for (var x in j){
        lala(j[x])
        }
    };
    
    var inDepthParser = function  (j, subPrefix, prePrefix, objPrefix) {
        var id = j._id;
        id = subPrefix+":UUID-"+id;
    //    delete j._id;
    j = j.head;

        if (r){}
            else{var r = []};
        
        if  (j === 'undefined'){
            console.log ('undefined triggered')
            return  -1;
        }
        for (var x in j){
            if (typeof j[x] === 'undefined'){
                console.log ('undefined triggered inside for in')
                return -1;
            }
            else if (typeof j[x] == 'string' | typeof j[x] == 'number' | typeof j[x] == 'boolean'){
                //r.push(subPrefix+x + ' a ' + objPrefix + typeof (j[x]));
                r.push(id +' '+prePrefix+x+' "'+j[x]+'"');
            }
            else if (Array.isArray(j[x])) {
                //r.push(x + ' is Array')
                var orderedTriples=id +' '+ prePrefix + x +' (';
                for (var y in j[x]) {
                    orderedTriples = orderedTriples + objPrefix + j[x][y] + ' ';

                    
                };
                orderedTriples=orderedTriples+")"
                r.push(orderedTriples);
            }
            else if (typeof j[x]=='object') {
                r.push(x + ' is Object');
                for (var y in j[x]) {
                    r.push(id +' '+ prePrefix+x+'_'+y +' '+objPrefix+j[x][y])
                    //console.log(Object.getOwnPropertyNames(j[x]) + ' is Object propertie(s)')
                    };
                //recursion
                 

                //not ready yet
                    inDepthParser(j[x], subPrefix, prePrefix, objPrefix);
                    
                
            };
        
        };

        var reponse ="";

        for (var x = 0; x<r.length; x++){
            reponse = reponse + r[x] + " ." + "\n";

        }


        return reponse;
    };

    var oneLevelParser = function  (j, subPrefix, prePrefix, uuidPreText) {
        // j is suposed to have _id  propertie.
        // added "UUID-" at beggining because the first caracter can't be a number
            var id = ""
            if (uuidPreText){
             id = uuidPreText+j['_id']; 
            } else  {
              id = j['_id']; 
            }

        //id = subPrefix+id;
        delete j['_id'];
        
        var totriple = function (mySubject, myPredicate, myObject){
            //return {'subject':subject, 
            //        'predicate':predicate,
            //        'object':object
            //        }

            var x = subPrefix+':'+mySubject+' '+prePrefix+':'+myPredicate+' '
            if (Array.isArray(myObject) && myObject.length >1){
                x = x+'('
                for (var i = 0; i < myObject.length; i++){
                    if (i == myObject.length-1){
                        x = x+'"'+myObject[i]+'") .';
                    } else {
                        x = x+'"'+myObject[i]+'" '
                    }
                }
            } else {
                x = x +'"'+ myObject+'" .'
                }
        return x
        }

        if (r){}
            else{var r = []};
        
        if  (j === 'undefined'){
            console.log ('undefined triggered')
            return  -1;
        }
        for (var x in j){
            if (typeof j[x] === 'undefined'){
                console.log ('undefined triggered inside for in')
                return -1;
            }
            else if (typeof j[x] == 'string' | typeof j[x] == 'number' | typeof j[x] == 'boolean'){
                //r.push(subPrefix+x + ' a ' + objPrefix + typeof (j[x]));
                r.push(totriple(id, x, j[x]))
                //r.push(id +' '+prePrefix+x+' "'+j[x]+'"');
            }
            else if (Array.isArray(j[x])) {
                //r.push(x + ' is Array')
                //var orderedTriples=id +' '+ prePrefix + x +' (';
                var orderedObj=[];
                for (var y in j[x]) {
                    orderedObj.push(j[x][y]);
                };
                r.push(totriple(id, x, orderedObj));
            }
            else if (typeof j[x]=='object') {
                r.push(x + ' is Object');
                for (var y in j[x]) {
                    r.push(id +' '+ prePrefix+x+'_'+y +' '+j[x][y])
                    //console.log(Object.getOwnPropertyNames(j[x]) + ' is Object propertie(s)')
                    };
                //recursion
                 

                //not ready yet
                   // innerParser(j[x], subPrefix, prePrefix, objPrefix);
                    
                
            };
        
        };
        var rdfString = "";

        for (var x in r){
            rdfString=rdfString+r[x]+"\n"
        }
        return rdfString;
    };