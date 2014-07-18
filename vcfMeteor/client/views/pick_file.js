    Template.pickFile.events({
    'change input': function (event) {
      // template data, if any, is available in 'this'
   
   var input = event.target;
	var reader = new FileReader();
	reader.onload = function(event){
	var reader = event.target;
	
	var vcfTxt = reader.result;
	//calling VCFparse();
	console.log('triggered change input');
		console.log(VCFparse(vcfTxt));
		//from there, the object y may be accessible
	console.log(reader.result.substring(0, 100));
		};
	
	
	reader.readAsText(input.files[0]);
	
	
        
    }
    });