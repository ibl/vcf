console.log('loaded listAll.js')


VCFmodule=function(div){
    console.log('listAll',div);
    var divBB = jQuery('#divBodyBody',div)[0];   
    divBB.textContent='... listing everything ... :-) :-)';
    divBB.style.color='green';
}
