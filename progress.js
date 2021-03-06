console.log('progressive genomic series being compiled at ',new Date())
// http://ibl.github.io/vcf/?then=progress.js#features=CP000255.1.txt

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
            ind[pos]=vcf.data.body.POS.indexOf(pos)
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
    VCF.dir.onFeature=function(that){
        console.log(that)
        lala=that
    }
    VCF.getUrlParms()
    if(VCF.urlParms.features){
        $.get(VCF.urlParms.features).then(function(txt){
            if(!VCF.dir.features){
                VCF.dir.features={}
            }
            //VCF.dir.features[VCF.urlParms.features]={}

            L = txt.split('\n')
            Ft={
                head:L[0],
                posStart:[],
                posEnd:[],
                txt:[]
            }
            n=L.length, j=-1, val=[], Li='' // i lines, j features
            ///*
            //div.dt.body.features=div.dt.body.ID.map(function(x,i){
            //    return '+'
            //})
            for(var i=1 ; i<n ; i++){
                Li=L[i]
                if(Li[0]!=='\t'){ // it's a feature position'
                    j++
                    val=Li.split(/\t/)
                    Ft.posStart[j]=parseInt(val[0])
                    Ft.posEnd[j]=parseInt(val[1])
                    Ft.txt[j]=val[2]
                    
                }else{
                    //console.log(Li)
                    Ft.txt[j]=Ft.txt[j]+'; '+Li
                }
            }
            VCF.dir.features=Ft
        })
    }

    posAll.forEach(function(pos){
        var tr = document.createElement('tr')
        tr.pos = pos
        var h = '<td style="color:blue" onclick="VCF.dir.onFeature(this)">'+pos+' +</td>'
        tr.innerHTML=h
        tbody.appendChild(tr)
    })












},1000)
