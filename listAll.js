console.log('loaded listAll.js')
// for debugging run directly as
// VCFmodule(VCF.dir.vcfs[0].div)
// after uncommenting module existance check in vcf.js


VCFmodule=function(div){
    console.log('listAll',div);
    var divBB = jQuery('#divBodyBody',div)[0];   
    divBB.textContent='... listing everything ... :-) :-)';
    divBB.style.color='green';
    divBB.innerHTML=""; // clear
    var n = div.dt.body.CHROM.length;
    var tb = document.createElement('table');divBB.appendChild(tb);
    tb.style.fontSize='x-small'; 
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
    div.fieldSelector=function(){
        4
    }
    div.fieldSelector();
}
