 //Body 
 //Head 
 //HeadDetails
 
 var getMappingtriples = function(){
    var triples=[];
    for (var z = 0; z<Body.find().length; z++){
        var subject="<http://www.example.com/id#row"+z+">";
        var predicate = "<http://www.franz.com/hasMongoId>";
        var object = '"'+z+'"^^<http://www.w3.org/2001/XMLSchema#long>';
        
        triples.push(subject+","+predicate+","+object)
        } 
    }
 