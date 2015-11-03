console.log('loaded listAll.js')
// for debugging run directly as
// VCFmodule(VCF.dir.vcfs[0].div)
// after uncommenting module existance check in vcf.js


VCFmodule=function(div){
    //lala = div
    console.log('listAll',div);
    var divBB = jQuery('#divBodyBody',div)[0];   
    divBB.textContent='... listing everything ... :-) :-)';
    divBB.style.color='green';
    divBB.innerHTML=""; // clear
    var n = div.dt.body.CHROM.length;
    var tb = document.createElement('table');divBB.appendChild(tb);
    tb.style.fontSize='x-small'; tb.id = "listVariantCalls";
    var tbd = document.createElement('tbody');tb.appendChild(tbd);
    var tr,td1,td2,td3;
    for (var i=0;i<n;i++){
        tr = document.createElement('tr');tbd.appendChild(tr);
        td1 = document.createElement('td');tr.appendChild(td1);
        td1.textContent=div.dt.body.CHROM[i];
        td2 = document.createElement('td');tr.appendChild(td2);
        td2.textContent=div.dt.body.POS[i];
        td3 = document.createElement('td');tr.appendChild(td3);
        if(div.dt.body.ID[i].length>1){  // SNPs
            td3.innerHTML='<a href="https://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs='+div.dt.body.ID[i]+'" target="_blank">'+div.dt.body.ID[i]+'</a>';
        } else{
            td3.textContent=div.dt.body.ID[i];textContent=div.dt.body.ID[i];
        }
    }
    // table head
    var tbh = document.createElement('thead');tb.appendChild(tbh);
    tr = document.createElement('tr');tbh.appendChild(tr);
    var th1 = document.createElement('th');tr.appendChild(th1);
    th1.textContent='CHROM';
    var th2 = document.createElement('th');tr.appendChild(th2);
    th2.textContent='POS';
    var th3 = document.createElement('th');tr.appendChild(th3);
    th3.textContent='ID';
    // add field selector to header
    var run=function(){
    console.log(div.dt.fields)
    div.fieldSelector=function(){
        var i = this.i;
        var F = Object.getOwnPropertyNames(this.dt.body); // fields
        var tr = jQuery('#listVariantCalls > thead > tr',this)[0];
        var th = document.createElement('th');tr.appendChild(th);
        var se = document.createElement('select');th.appendChild(se);
        se.dt = this.dt.body;
        var opt = document.createElement('option');se.appendChild(opt);opt.textContent='Parm:';
        for(var j=0;j<F.length;j++){
            var opt = document.createElement('option');se.appendChild(opt);opt.textContent=F[j];
        }
        se.onchange = function(evt){
            var F = this.value; // field
            var V = this.dt[F]; // values
            var trs = this.parentElement.parentElement.parentElement.parentElement.tBodies[0].childNodes;
            for(var i=0;i<V.length;i++){
                td = document.createElement('td');td.textContent=V[i];trs[i].appendChild(td);
            }
            this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.fieldSelector();
            this.parentElement.innerHTML=F;
            // add delete column option
            var thr = listVariantCalls.childNodes[1].childNodes[0]
            var n = thr.children.length
            var th = thr.children[n-2]
            var sp = document.createElement('span')
            sp.i=n-2
            sp.style.color='red'
            sp.textContent=' X'
            th.appendChild(sp)
            sp.onclick=function(evt){ // remove column
                that = this
                var i=this.i
                console.log('i',i)
                var thr = listVariantCalls.childNodes[1].childNodes[0]
                for(var j=i+1;j<thr.children.length;j++){
                    thr.children[j].children[0].i=thr.children[j].children[0].i-1
                }
                // remove header
                var thr = listVariantCalls.childNodes[1].childNodes[0]
                thr.removeChild(thr.children[i])
                // remove cells
                Object.getOwnPropertyNames(listVariantCalls.children[0].children).forEach(function(c,j){
                    var tr = listVariantCalls.children[0].children[j]
                    tr.removeChild(tr.children[i])
                })
            }
        }
                
        
    }
    div.fieldSelector()
    }
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
            //*/
            // add new features
            //div.dt.fields.push('features')

            run();
            var trs = listVariantCalls.children[0]
            var n = trs.childElementCount
            var spFun=function(evt){
                //console.log(this)
                //var i = this.i
                //lala=this
                if(this.textContent.slice(1)=='+'){
                    this.textContent=' -'
                    var pre = document.createElement('pre')
                    pre.style.fontSize=9
                    // extract annotation from features
                    //pre.innerHTML=new Date()
                    var pos=parseInt(this.parentElement.parentElement.children[1].textContent)
                    var h = VCF.dir.features.head.slice(0,9)+'<a href="http://www.ncbi.nlm.nih.gov/nuccore/87125858?report=graph&mk='+pos+'|'+pos+'&v='+Math.max(0,pos-10000)+':'+(pos+10000)+'" target="_blank">'+VCF.dir.features.head.slice(9)+pos+'</a>'
                    VCF.dir.features.posStart.forEach(function(p,i){
                        if(VCF.dir.features.posStart[i]>=pos){
                            if(VCF.dir.features.posEnd[i]<=pos){
                                h+='<br>'+VCF.dir.features.posStart[i]+'-'+VCF.dir.features.posEnd[i]
                                h+=' '+VCF.dir.features.txt[i].replace(/;/g,'<br>')
                            }
                        }
                    })
                    pre.innerHTML=h
                    this.parentNode.appendChild(pre)
                }else{
                    this.parentElement.removeChild(this.parentElement.children[1])
                    this.textContent=' +'
                }
                

            }
            for(var i=0 ; i<n ; i++){
                var sp = document.createElement('sp')
                sp.i=i
                sp.textContent=' +'
                sp.style.color='blue'
                sp.onclick=spFun
                trs.children[i].children[2].appendChild(sp)
            }
        })
        
    }else{
        run();
    }
    
}
