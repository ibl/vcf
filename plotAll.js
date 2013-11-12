console.log('loaded plotAll.js');
// for debugging run directly as
// VCFmodule(VCF.dir.vcfs[0].div)
// after uncommenting module existance check in vcf.js

VCFmodule=function(div){
    var divBB = jQuery('#divBodyBody',div)[0];   
    divBB.textContent='... work in progress ...';
    divBB.style.color='red';
    sv = d3.select(divBB).append("svg"); // svg
    sv.attr("width", 500).attr("height", 1050); // 1000 x 1000 svg canvas
    var x0=25; // x=0 position
    // draw vertigal line 1000 points long
    ln = sv.append('line');
    ln.attr('x1',50).attr('y1',x0).attr('x2',50).attr('y2',1000).attr('style','stroke:rgb(0,0,0);stroke-width:2');
    
    console.log('plotAll',div);
    
}

//
