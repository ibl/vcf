console.log('vcf.js loaded :-) !');

// this will come handy if you're hosting this form GDrive
// find . -name "Icon*" -exec rm -f '{}' +
// about VCFs:
// one page: http://vcftools.sourceforge.net/VCF-poster.pdf
// get variant summary: jQuery.get('https://www.googledrive.com/host/0BwwZEXS3GesiTjlHSmlOcEJaeDA/vcf/variant_summary.txt')

VCF=function(txt,id,i){ // this is the class, for regular VCF functions like parsing come later

/////// methods of a VCF instance ////////////

this.buildUI=function(id){
	if(!id){id=this.id}
	var div=document.getElementById(id);
	if(div==null){ // if this is a new element
		div=document.createElement('div');
		div.id=id;
		VCF.div.appendChild(div);
	}
	div.innerHTML='<span style="color:navy"> ID: '+id+'</span><br>';
	this.div=div; // register the div to the instance it is the UI of
	var dt = this.data; // that's where the fun is :-)
	this.div.dt=dt;
	//if(typeof(this.i)=="undefined"){this.i=0}
	this.div.i=this.i; // // the ith vcf
	// show head and body
	var divHead = document.createElement('div');divHead.id="divHead";
	div.appendChild(divHead);
	var divHeadHead = document.createElement('div');divHeadHead.id="divHeadHead";
	divHead.appendChild(divHeadHead);
	var divHeadBody = document.createElement('pre');divHeadBody.id="divHeadBody";
	divHeadBody.style.fontSize='x-small';
	divHead.appendChild(divHeadBody);
	var heads = Object.getOwnPropertyNames(dt.head).sort();
	for(var i=0;i<heads.length;i++){
		var a = document.createElement('a');
		a.textContent=" "+heads[i];
		a.style.fontSize="x-small";
		//a.style.color="red";
		a.i=i;
		a.dt=dt.head[heads[i]];
		divHeadHead.appendChild(a);
		a.onclick=function(){
			//lala = this;
			divHeadBody.textContent=JSON.stringify(this.dt,undefined,1);
			//lala = divHeadBody;
		}
	}
	var divBody = document.createElement('div');divBody.id="divBody";
	div.appendChild(divBody);

	var divBodyHead = document.createElement('div');divBodyHead.id="divBodyHead";
	divBody.appendChild(divBodyHead);
	var sel = document.createElement('select');divBodyHead.appendChild(sel);
	sel.style.fontSize='x-small';
	for(var i=0;i<VCF.modules.length;i++){
		var opti = document.createElement('option');
		opti.value=i;
		opti.textContent=VCF.modules[i].name;
		sel.appendChild(opti);
	}
	sel.style.verticalAlign="top";
	var lst = document.createElement('select');divBodyHead.appendChild(lst);
	lst.style.fontSize='x-small';
	var lsti = document.createElement('option');lst.appendChild(lsti);lsti.textContent='Workflow Log:';
	lst.size=2;
	sel.lst = lst;
	sel.onchange=function(){
		var i = parseInt(this.value);
		var j = this.parentElement.parentElement.parentElement.i;
		//if(typeof(j)=="undefined"){
		//	this.parentElement.parentElement.parentElement.i=0
		//	j=0
		//}
		if(true){ // uncomment when debugging modules
		//if(!VCF.modules[i].fun){ // comment when debugging modules
			var s = document.createElement('script');
			s.i = i;
			s.j = j;
			s.src = VCF.modules[i].url;
			s.onload = function(){
				VCF.modules[this.i].fun=jmat.clone2(VCFmodule);
				VCF.modules[this.i].fun(VCF.dir.vcfs[this.j].div);
			}
			document.body.appendChild(s);
		} else{
			VCF.modules[i].fun(VCF.dir.vcfs[j].div);
		}
		// register execution
		var lsti = document.createElement('option');sel.lst.appendChild(lsti);
		lsti.textContent=VCF.modules[i].name;
		lsti.selected=true;
	}
	// Body Body (analysis results)
	var divBodyBody = document.createElement('div');divBodyBody.id="divBodyBody";
	divBody.appendChild(divBodyBody);
	// if the URL opt = ..., go ahead and do so
	if(VCF.urlParms){
		if(VCF.urlParms.opt){
			Object.getOwnPropertyNames(sel.options).forEach(function(ith){
				var opt = sel.options[ith]
				if(opt.textContent==VCF.urlParms.opt){
					opt.selected=true
				}
			})
			sel.onchange()
		}
	}
}

if(!id){id=VCF.uid('vcf')};
if(!!txt){
	this.data=VCF.parse(txt);
	this.id=id; // the file name if txt was got be a reader
	this.i=i; // index in the dir.vcfs
	if(!!VCF.div){ // check that there is a registered div for VCF data
		this.buildUI();
	}
} else {
	this.data=undefined;
}

}

//////// methods of the VCF class //////////

VCF.dir={vcfs:[],ids:[]}; // store parsed vcfs here

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

VCF.getUrlParms=function(){
	if(location.hash.length>0){
		this.urlParms={}
		location.hash.slice(1).split('&').forEach(function(p){
			p = p.split('=')
			VCF.urlParms[p[0]]=p.slice(1).join('=')
		})
	}
}

VCF.buildUI=function(id){ // main UI
	this.getUrlParms()
	id = id || VCF.uid('VCF');
	var div = document.getElementById(id)
	if(!div){
		div = document.createElement('div');div.id=id;
		document.body.appendChild(div);
	}
	div.innerHTML='[<a href="https://github.com/ibl/vcf" target="_blank">source code</a>] Load VCF file:';
	console.log('UI build')
	// Read local files
	var ipf = document.createElement('input'); // input file API
	ipf.type="file";
	ipf.setAttribute('multiple','multiple');
	ipf.onchange=function(evt){
		//var f=evt.target.files[0];
		var i0=VCF.dir.ids.length; // number of vcfs registered already
		for(var i=0;i<evt.target.files.length;i++){
			var reader = new FileReader();
			reader.i=i0+i;
			var fname = evt.target.files[i].name;
			VCF.dir.ids[i0+i]=fname;
			VCF.startUI(fname); // a div for this vcf file
			console.log('started parsing '+fname+' ...');
			reader.onload=function(x){
				var txt=x.target.result;
				//console.log(txt);
    	    	VCF.dir.vcfs[this.i]=new VCF(txt,VCF.dir.ids[this.i],this.i);
				//VCF.dir.vcfs[this.i].fileName=VCF.dir.ids[this.i];
				console.log('... done parsing '+fname);

	    	}

	    reader["readAsText"](evt.target.files[i]);
		}

		//reader["readAsBinaryString"](f);
	}
	div.appendChild(ipf);
	// DropBox button
	
	// Read dropbox files
	/*
	var drpBox = document.createElement('input');
	drpBox.type="dropbox-chooser";
	drpBox.setAttribute('name','selected-file');
	drpBox.style.visibility="hidden";
	drpBox.setAttribute('data-link-type','direct');
	drpBox.setAttribute('data-multiselect',true);
	//drpBox.setAttribute('data-extensions','.vcf');
	drpBox.addEventListener("DbxChooserSuccess",function(evt){
		var i0=VCF.dir.ids.length; // number of vcfs registered already
		for(var i=0;i<evt.files.length;i++){
			var fname=evt.files[i].name;
			var thisi=i0+i;
			VCF.dir.ids[i0+i]=fname;
			VCF.startUI(fname); // a div for this vcf file
			console.log('started parsing '+fname+' ...');
			var reader = function(txt){
				//console.log(txt);
				VCF.dir.vcfs[this.success.i]=new VCF(txt,VCF.dir.ids[this.success.i],thisi);
				//VCF.dir.vcfs[this.success.i].fileName=VCF.dir.ids[this.success.i];
				console.log('... done parsing '+fname);
				// if all is parsed and then is there, let's do it
			};
			reader.i=i0+i;
			jQuery.get(evt.files[i].link,reader)
		}
		// look for something to do next
		var parms = {}
		location.search.slice(1).split('&').forEach(function(pp){
			pp = pp.split('=')
			parms[pp[0]]=pp[1]
			//console.log(pp)
		})
		if(parms.then){
			var s=document.createElement('script')
			s.src=parms.then
			setTimeout(function(){
				document.head.appendChild(s)
			},1000)
		}
	})

	
	//drpBox.setAttribute('data-extensions','.ab1 .fsa');
	div.appendChild(drpBox);
	*/
	var sp = document.createElement('script');
	sp.type='text/javascript';
	sp.src='https://www.dropbox.com/static/api/2/dropins.js';
	sp.id='dropboxjs';
	//sp.setAttribute('data-app-key','8whwijxgl8iic3j');
	sp.setAttribute('data-app-key','hg9y8nou75s22cx');
	sp.onload=function(){
		options = {
			// Required. Called when a user selects an item in the Chooser.
			success: function(files) {
				//console.log(files)
				//alert("lala Here's the file link: " + files[0].link)
				VCF.readFiles(files)
			},

			// Optional. Called when the user closes the dialog without selecting a file
			// and does not include any parameters.
			cancel: function() {

			},

			// Optional. "preview" (default) is a preview link to the document for sharing,
			// "direct" is an expiring link to download the contents of the file. For more
			// information about link types, see Link types below.
			linkType: "direct",

			// Optional. A value of false (default) limits selection to a single file, while
			// true enables multiple file selection.
			multiselect: true,

			// Optional. This is a list of file extensions. If specified, the user will
			// only be able to select files with these extensions. You may also specify
			// file types, such as "video" or "images" in the list. For more information,
			// see File types below. By default, all extensions are allowed.
			extensions: ['.vcf'],
		};
		var button = Dropbox.createChooseButton(options);
		document.getElementById("vcfUi").appendChild(button);
	}
	//document.body.appendChild(sp);
	setTimeout(function(){document.head.appendChild(sp)},1000);
	VCF.div=div; // registering the div element so vcf instances can find it
	// in case VCF file included in the URL has, get it
	if(VCF.urlParms){
		if(VCF.urlParms.vcf){
			// if from DropBox, redirect link to CORS served content
			var urlVCF=VCF.urlParms.vcf.replace('www.dropbox.com','dl.dropboxusercontent.com').replace('dl=0','dl=1')
			$.get(urlVCF).then(function(txt){
				console.log('parsing VCF from '+urlVCF)
				//VCF.dir.vcfs[this.i]=new VCF(txt,VCF.dir.ids[this.i],this.i);
				VCF.dir.vcfs[this.i]=new VCF(txt,urlVCF,this.i);
				//new VCF(txt)

			})
			4
		}
	}
}

VCF.readFiles=function(files){
	//var i0=VCF.dir.ids.length; // number of vcfs registered already
	console.log(files)
	var n = files.length
	var fun=[]
	for(var i=0;i<n;i++){
		var j=VCF.dir.ids.length
		var fname = files[i].name;
		VCF.dir.ids[j]=fname;
		VCF.startUI(fname); // a div for this vcf file
		console.log('started parsing '+fname+' ...');
		fun[i]=function(url,fname,i,j){
			$.get(files[i].link)
		 	.then(function(txt){
		 		VCF.dir.vcfs[j]=new VCF(txt,VCF.dir.ids[j],j);
				console.log('... done parsing '+i+'/'+n+': '+fname);
			})			
		}
		fun[i](files[i].link,fname,i,j)		
	}

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
	if(L==null){
		throw(x[i]);
	}

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
	var i0=i+1;
	for(var i=i0;i<n;i++){
		L = x[i].split(/\t/);
		for(var j=0;j<F.length;j++){
			y.body[F[j]][i-i0]=L[j];
		}
	}
	y.fields=F;
	VCF.parseHead(y); // parse head further
	return y;
};

VCF.parseHead=function(dt){ // go through a data file and parses data.head
	var fields = Object.getOwnPropertyNames(dt.head);
	var newHead={}; // parse old head into here
	var f, v, str, ID; // place holder for fields, their values, the string line, and IDs during parsing
	var AV, AVk; // attribute=value pairs during parsing of array fields
	for(var i=0;i<fields.length;i++){
		//ID=str.match(/ID=([^\,\>]+)/)[1];
		//dt.head.INFO[ID]={
		// array entries are pushed with <> entries
		f = fields[i];
		if(dt.head[f][0][0]!='<'){ // the non array head fields
			dt.head[f]=dt.head[f][0];
		} else { // the array head fields
			v={};
			for(j=0;j<dt.head[f].length;j++){
				str=dt.head[f][j];
				ID=str.match(/ID=([^\,\>]+)/)[1];
				v[ID]={};
				AV = str.match(/([^\,\<]+=[^\,\>]+)/g);
				for(k=1;k<AV.length;k++){ // k=0 is if ID's AV
					AVk=AV[k].match(/[^=\"]+/g);
					v[ID][AVk[0]]=AVk[1];
				}
			}
			dt.head[f]=v;
		}
	};
	// return dt <-- no need, dt was passed by reference

};

// Modules

VCF.modules=[

{
	name:'Modules',
	url:'Modules.js',
	fun:function(div){
		var divBB = jQuery('#divBodyBody',div)[0];
		divBB.innerHTML=""; // clear
	}
},

{
	name:'List variant calls',
	//url:'https://ibl.github.io/vcf/listAll.js',
	url:'listAll.js',
	//url:'https://www.googledrive.com/host/0BwwZEXS3GesiTjlHSmlOcEJaeDA/vcf/listAll.js'
	//fun:function(x){console.log(x)}
},

{
	name:'Plot variant calls',
	url:'https://ibl.github.io/vcf/plotAll.js',
	//url:'https://www.googledrive.com/host/0BwwZEXS3GesiTjlHSmlOcEJaeDA/vcf/plotAll.js'
	//fun:function(x){console.log(x)}
},


];


// Context dependent actions

if(!!window.IPE){ // check for the Integrated Pathology Ecosystem, http://ibl.github.io/IPE/
	IPE.ui.registerTab({id:'VCF',title:'VCFtbox',switchTab:true});
	VCF.buildUI('VCF');
}

// Dependencies

if(!window.d3){
	var s = document.createElement('script');
	s.src='https://cdnjs.cloudflare.com/ajax/libs/d3/3.3.9/d3.min.js';
	document.head.appendChild(s);

}

if(!window.jmat){
	var s = document.createElement('script');
	s.src='https://jmat.googlecode.com/git/jmat.js';
	document.head.appendChild(s);

}
