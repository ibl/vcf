console.log('loaded Module.js')
// for debugging run directly as
// VCFmodule(VCF.dir.vcfs[0].div)
// after uncommenting module existance check in vcf.js


VCFmodule=function(div){
    var divBB = jQuery('#divBodyBody',div)[0];
    divBB.innerHTML=""; // clear
}
