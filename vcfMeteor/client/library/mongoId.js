    id = Math.uuid();
    var inDepthParser = function  (j, subPrefix, prePrefix, objPrefix) {
    //    id = j._id;
        id = subPrefix+id;
    //    delete j._id;

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
                    orderedTriples = orderedTriples + subPrefix + j[x][y] + ' ';

                    
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
                    innerParser(j[x], subPrefix, prePrefix, objPrefix);
                    
                
            };
        
        };
        return r;
    };

    var oneLevelParser = function  (j, subPrefix, prePrefix, objPrefix) {
    //    id = j._id;
        id = subPrefix+id;
    //    delete j._id;

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
                    orderedTriples = orderedTriples + subPrefix + j[x][y] + ' ';

                    
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
                    innerParser(j[x], subPrefix, prePrefix, objPrefix);
                    
                
            };
        
        };
        return r;
    };