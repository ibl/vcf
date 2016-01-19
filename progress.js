console.log('progressive genomic series being compiled at ',new Date())

vcfUi.innerHTML='<h4 style="color:blue">Compiling incremental genomic variation ...</h4>'

setTimeout(function(){
    vcfUi.innerHTML='<h4 style="color:navy">Incremental genomic variation</h4>'
    // compilation div
    var srcDiv=document.createElement('div')
    srcDiv.id = "sourcesCompiled"
    vcfUi.appendChild(srcDiv)
    var h=new Date()
    h+='<p>Source files</p>'
    if(VCF.dir.ids.slice(-1)[0].match('^sra_data')){ // if this is Tomasz data, sort it accordingly
        //x = x.slice(-1).concat(x.slice(0,-1))
        VCF.dir.ids = VCF.dir.ids.slice(-1).concat(VCF.dir.ids.slice(0,-1))
        VCF.dir.vcfs = VCF.dir.vcfs.slice(-1).concat(VCF.dir.vcfs.slice(0,-1))
    }
    VCF.dir.ids.forEach(function(fid){
        h+='<li style="color:green">'+fid+'</li>'
    })
    srcDiv.innerHTML=h

    // differential genomic variation div
    var difDiv=document.createElement('div')
    difDiv.id = "differentialVariation"
    vcfUi.appendChild(difDiv)
    // full list of variations
    var posAll=[]
    VCF.dir.vcfs.forEach(function(vcf){
        //console.log(vcf.data.body.POS)
        posAll=posAll.concat(vcf.data.body.POS)
    })
    posAll=jmat.unique(posAll)
    // index variations in each vcf
    VCF.dir.vcfs.forEach(function(vcf,i){
        var ind={}
        vcf.data.body.POS.forEach(function(pos){
            ind[pos]=true
        })
        VCF.dir.vcfs[i].ind=ind
    })
    // build table
    var tbl = document.createElement('table')
    tbl.cellPadding="5px"
    difDiv.appendChild(tbl)
    var thead = document.createElement('thead')
    tbl.appendChild(thead)
    var h='<tr><td>Position</td>'
    VCF.dir.vcfs.forEach(function(vcf){
        h+='<td style="color:blue">'+vcf.id.slice(0,15)+'...</td>'
    })
    h+='</tr>'
    thead.innerHTML=h
    var tbody = document.createElement('tbody')
    tbl.appendChild(tbody)
    // one row per variation
    posAll.forEach(function(pos){
        var tr = document.createElement('tr')
        var h = '<td style="color:blue">'+pos+'</td>'
        tr.innerHTML=h
        tbody.appendChild(tr)

    })











},1000)
