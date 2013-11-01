console.log('loaded plotAll.js');
// for debugging run directly as
// VCFmodule(VCF.dir.vcfs[0].div)
// after uncommenting module existance check in vcf.js

VCFmodule=function(div){
    console.log('plotAll',div);
    var divBB = jQuery('#divBodyBody',div)[0];   
    divBB.textContent='... ploting it all ...';
    divBB.style.color='red';
}

//
