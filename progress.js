console.log('progressive genomic series being compiled at ',new Date())

vcfUi.innerHTML='<h4>Incremental genomic variation</h4>'

setTimeout(function(){
    var div=document.createElement('div')
    div.id = "sourcesCompiled"
    vcfUi.appendChild(div)
    var h=new Date()
    h+='<p>Source files</p>'
    
    if(VCF.dir.ids.slice(-1)[0].match('^sra_data')){ // if this is Tomasz data, sort it accordingly
        //x = x.slice(-1).concat(x.slice(0,-1))
        VCF.dir.ids = VCF.dir.ids.slice(-1).concat(VCF.dir.ids.slice(0,-1))
        VCF.dir.vcfs = VCF.dir.vcfs.slice(-1).concat(VCF.dir.vcfs.slice(0,-1))
    }

    VCF.dir.ids.forEach(function(fid){
        h+='<li>'+fid+'</li>'
    })
    div.innerHTML=h


},1000)
