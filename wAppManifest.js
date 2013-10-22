wApps.manifest.apps.push(

    {
    "name" : 'VCF',
    "description" : 'web app to handle <a href="http://vcftools.sourceforge.net/specs.html" target="_blank">Variant Calling Format</a> genomic data.',
    "url" : 'https://github.com/ibl/vcf',
    "author" : 'Jonas Almeida',
    buildUI : function(id){ 
        this.require('https://raw.github.com/ibl/vcf/gh-pages/vcf.js', 
            function () {
                VCF.buildUI(id);
            }
        )}
    }
);

wApps.manifest.authors.push(
    {
    "name":"Jonas Almeida",
    "url":"http://jonasalmeida.info"
    }
)