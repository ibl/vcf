console.log('vcf loaded');

// this will come handy if you're hosting this form GDrive
// find . -name "Icon*" -exec rm -f '{}' +


VCF=function(txt){ // this is the class, for regular VCF functions like parsing come later
	
this.buildUI=function(id){
	id = id || jmat.uid('vcf');
	var div = document.getElementById(id)
	if(!div){
		div = document.createElement('div');div.id=id;
		document.body.appendChild(div);	
	}
	div.innerHTML='vcf';
	
	
	
	console.log('ui build')
}

if(!!txt){
	this.txt=txt;
} else {
	this.txt="";
}
	 
}

VCF.index={vcfs:[],fileName:[]}; // store parsed vcfs here
VCF.buildUI=function(id){
	
	id = id || jmat.uid('VCF');
	var div = document.getElementById(id)
	if(!div){
		div = document.createElement('div');div.id=id;
		document.body.appendChild(div);	
	}
	div.innerHTML='Load VCF file:';
	console.log('UI build')
	// Read local files
	var ipf = document.createElement('input'); // input file API
	ipf.type="file";
	ipf.setAttribute('multiple');
	ipf.onchange=function(evt){
		//var f=evt.target.files[0];
		for(var i=0;i<evt.target.files.length;i++){
			var reader = new FileReader();
			var fname = evt.target.files[i].name;
			VCF.index.fileName.push(fname);
			console.log('started parsing '+fname+' ...');
        	reader.onload=function(x){
				var txt=x.target.result;
				//console.log(txt);
    	    	VCF.index.vcfs.push(new VCF(txt));
				console.log('... done parsing '+fname);
	    	}
	    reader["readAsText"](evt.target.files[i]);			
		}
		
		//reader["readAsBinaryString"](f);
	}
	div.appendChild(ipf);
	// Read dropbox files
	drpBox = document.createElement('input');
	drpBox.type="dropbox-chooser";
	drpBox.setAttribute('name','selected-file');
	drpBox.style.visibility="hidden";
	drpBox.setAttribute('data-link-type','direct');
	drpBox.setAttribute('data-multiselect',true);
	//drpBox.setAttribute('data-extensions','.vcf');
	drpBox.addEventListener("DbxChooserSuccess",function(evt){
		for(var i=0;i<evt.files.length;i++){
			var fname=evt.files[i].name;
			VCF.index.fileName.push(fname);
			console.log('started parsing '+fname+' ...');
			jQuery.get(evt.files[i].link,function(txt){
				//console.log(txt);
				VCF.index.vcfs.push(new VCF(txt));
				console.log('... done parsing '+fname);
			})
		}
		
	})
	//drpBox.setAttribute('data-extensions','.ab1 .fsa');
	div.appendChild(drpBox);
	sp = document.createElement('script');
	sp.type='text/javascript';
	sp.src='https://www.dropbox.com/static/api/1/dropins.js';
	sp.id='dropboxjs';
	sp.setAttribute('data-app-key','8whwijxgl8iic3j');
	//document.body.appendChild(sp);
	setTimeout(function(){document.head.appendChild(sp)},1000);
	
}

VCF.parse=function(x){
	console.log(x);
}