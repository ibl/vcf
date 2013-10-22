console.log('vcf.js loaded');

// this will come handy if you're hosting this form GDrive
// find . -name "Icon*" -exec rm -f '{}' +



VCF=function(txt,id){ // this is the class, for regular VCF functions like parsing come later

/////// methods of a VCF instance ////////////

this.buildUI=function(id){
	if(!id){id=this.id}
	var div=document.getElementById(id);
	if(div==null){ // if this is a new element
		div=document.createElement('div');
		div.id=id;
		VCF.div.appendChild(div);
	}
	div.innerHTML='<p style="color:navy"> ID: '+id+'</p>';
	
	//console.log('building uizito for '+id);		
}

if(!id){id=VCF.uid('vcf')};
if(!!txt){
	this.data=VCF.parse(txt);
	this.id=id; // the file name if txt was got be a reader
	if(!!VCF.div){ // check that there is a registered div for VCF data
		this.buildUI();
	}
} else {
	this.data=undefined;
}
	 
}

//////// methods of the VCF class //////////

VCF.dir={vcfs:[],fileName:[]}; // store parsed vcfs here

VCF.uid=function(prefix){ // create unique ids
	if(!prefix){prefix='UID'}
	var uid=prefix+Math.random().toString().slice(2);
	return uid
};

VCF.startUI=function(id){  // prepare div for a vcf instance
	var div = document.createElement('div');
	div.id=id;
	div.innerHTML='<p style="color:blue"> ID: '+id+' (processing)</p>';
	VCF.div.appendChild(div);
};

VCF.buildUI=function(id){ // main UI
	
	id = id || VCF.uid('VCF');
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
			VCF.startUI(fname); // a div for this vcf file
			console.log('started parsing '+fname+' ...');
			reader.onload=function(x){
				var txt=x.target.result;
				//console.log(txt);
    	    	VCF.dir.vcfs[this.i]=new VCF(txt,VCF.dir.fileName[this.i]);
				//VCF.dir.vcfs[this.i].fileName=VCF.dir.fileName[this.i];
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
			VCF.startUI(fname); // a div for this vcf file
			console.log('started parsing '+fname+' ...');
			var reader = function(txt){
				//console.log(txt);
				VCF.dir.vcfs[this.success.i]=new VCF(txt,VCF.dir.fileName[this.success.i]);
				//VCF.dir.vcfs[this.success.i].fileName=VCF.dir.fileName[this.success.i];
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
	VCF.div=div; // registering the div element so vcf instances can find it
	
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