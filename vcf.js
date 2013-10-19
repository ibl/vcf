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
	this.data=VCF.parse(txt);
} else {
	this.data=undefined;
}
	 
}

VCF.dir={vcfs:[],fileName:[]}; // store parsed vcfs here

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
		var i0=VCF.dir.fileName.length; // number of vcfs registered already
		for(var i=0;i<evt.target.files.length;i++){
			var reader = new FileReader();
			reader.i=i0+i;
			var fname = evt.target.files[i].name;
			VCF.dir.fileName[i0+i]=fname;
			console.log('started parsing '+fname+' ...');
			reader.onload=function(x){
				var txt=x.target.result;
				//console.log(txt);
    	    	VCF.dir.vcfs[this.i]=new VCF(txt);
				VCF.dir.vcfs[this.i].fileName=VCF.dir.fileName[this.i];
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
		var i0=VCF.dir.fileName.length; // number of vcfs registered already
		for(var i=0;i<evt.files.length;i++){
			var fname=evt.files[i].name;
			VCF.dir.fileName[i0+i]=fname;
			console.log('started parsing '+fname+' ...');
			var reader = function(txt){
				//console.log(txt);
				VCF.dir.vcfs[this.success.i]=new VCF(txt);
				VCF.dir.vcfs[this.success.i].fileName=VCF.dir.fileName[this.success.i];
				console.log('... done parsing '+fname);
			};
			reader.i=i0+i;
			jQuery.get(evt.files[i].link,reader)
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
	console.log('(parsing a '+x.length+' long string)');
	x=x.split(/\n/);
	var n=x.length; // number of lines in the file
	if(x[n-1].length==0){n=n-1}; // remove trailing blank
	y={head:{},body:{}};
	// parse ## head lines
	var i=0; // ith line
	var L = x[i].match(/^##(.*)/); // L is the line being parsed
	
	while(L.length>1){
		i++;
		L = L[1].match(/([^=]+)\=(.*)/);
		if(!y.head[L[1]]){y.head[L[1]]=[]}
		y.head[L[1]].push(L[2]);
		L = x[i].match(/^##(.*)/);
		if(L==null){L=[]}; // break	
	}
	// parse # body lines
	L=x[i].match(/^#([^#].*)/)[1]; // use fuirst line to define fields
	var F = L.split(/\t/); // fields
	for(var j=0;j<F.length;j++){
		y.body[F[j]]=[];
	}
	for(var i=i+1;i<n;i++){
		L = x[i].split(/\t/);
		for(var j=0;j<F.length;j++){
			y.body[F[j]][i]=L[j];
		}	
	}
	y.fields=F;
	return y;
}