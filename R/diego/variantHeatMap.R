variantHeatMap <- function (body) {
#body<-body[body$secondParentalAllele !=".", ]  
#body<-body[body$fistParentalAllele !=".", ]
body<-body[body$CHROM == "chr7", ]
#body<-body[body$POS > 55086714 & body$POS < 55324313, ]
body<-body[body$POS == 55182253, ]

freqtable<-ftable(body$sex, body$AA, body$casestatus, body$secondParentalAllele)
heatmap(as.matrix(freqtable))
return(freqtable)
}