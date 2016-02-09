console.log('progressive genomic series being compiled at ',new Date())
// http://ibl.github.io/vcf/?then=tomasz.js#features=CP000255.1.txt

vcfUi.innerHTML='<h4 style="color:blue">Compiling incremental genomic variation ...</h4>'

tomasz=function(){
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
    posAll=jmat.unique(posAll).map(function(p){
        return parseInt(p)
    })
    posAll=jmat.sort(posAll)[0].map(function(p){
        return ''+p
    })
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
        //h+='<td style="color:blue;transform:rotate(90deg);g-origin:50% 50%">'+vcf.id.slice(0,15)+'...</td>'
        h+='<td style="color:blue">'+vcf.id.slice(0,10)+'...</td>'
    })
    h+='</tr>'
    thead.innerHTML=h
    var tbody = document.createElement('tbody')
    tbl.appendChild(tbody)
    // one row per variation
    VCF.dir.onFeature=function(that){
        console.log('on',that)
        that.textContent=that.textContent.slice(0,-1)+"-"
        that.onclick=function(){VCF.dir.offFeature(that)}
        var pre = document.createElement('pre')
        that.parentNode.appendChild(pre)
        var pos=parseInt(that.textContent.match(/[0-9]*/)[0])
        var h = '>Feature <a href="http://www.ncbi.nlm.nih.gov/nuccore/87125858?report=graph&mk='+pos+'|'+pos+'&v='+(pos-10000)+':'+(pos+10000)+'" target="_blank">gb|CP000255.1|'+pos+'</a>'
        var ind = NaN

        VCF.dir.features.posStart.forEach(function(pStart,i){
            var pEnd=VCF.dir.features.posEnd[i]
            if((pStart<=pos)&&(pEnd>=pos)){
                ind=i-1
            }
        })
        if(isNaN(ind)){
            console.log('not found')
        }else{
            console.log('found it:',VCF.dir.features.posStart[ind],VCF.dir.features.posEnd[ind]) 
            h+='\n>'+VCF.dir.features.txt[ind].replace(/;\s*/g,'; ')
            h+='\n>'+VCF.dir.features.txt[ind+1].replace(/;\s*/g,'; ')

            4
        }

        pre.innerHTML=h

        //lala=that
    }
    VCF.dir.offFeature=function(that){
        console.log('off',that)
        that.onclick=function(){VCF.dir.onFeature(that)}
        that.textContent=that.textContent.slice(0,-1)+"+"
        $('pre',that.parentElement).remove()
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
            //if(fun){}
        })
    }

    posAll.forEach(function(pos){
        var tr = document.createElement('tr')
        tr.id='pos_'+pos
        tr.pos = pos
        var h = '<td><span style="color:blue" onclick="VCF.dir.onFeature(this)">'+pos+'+</span></td>'
        tr.innerHTML=h
        tbody.appendChild(tr)
    })
    // ready to fill the table
    VCF.dir.vcfs.forEach(function(vcf){
        posAll.forEach(function(pos){
            var tr = document.getElementById('pos_'+pos)
            var td = document.createElement('td')
            tr.appendChild(td)
            posInd = vcf.data.body.POS.indexOf(pos)
            if(posInd>-1){
                td.textContent=vcf.data.body.QUAL[posInd]+' ('+vcf.data.body.REF[posInd]+'>'+vcf.data.body.ALT[posInd]+')'
            }
            4
        })
        4
    })

}


setTimeout(function(){
    tomasz()
},1000)
