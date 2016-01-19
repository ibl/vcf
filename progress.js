console.log('progressive genomic series being compiled at ',new Date())

vcfUi.innerHTML='<h4>Incremental genomic variation</h4>'

setTimeout(function(){
    var div=document.createElement('div')
    div.id = "sourcesCompiled"
    vcfUi.appendChild(div)
    var h=new Date()
    h+='<p>Source files</p>'
    div.innerHTML=h


},1000)
