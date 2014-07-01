#' --- 
#' Alternate Visual Analysis - Glioma Data
#' ---
#' Emanuel Diego S Penha, Jul 2014
reshapeVCF <- function(vcfFile, groupFile){
#' depends on   
  require("reshape")
  require("vcf4r")

#'  study_id field must be present
  #groups <- read.csv("~/Dropbox/DiegoUAB/data/groups.csv",header = TRUE)  
  vcf<-vcf2r(vcfFile)  
  body<-vcf$body
  body<-body[body$ID != ".", ]  
  body<-body[body$CHROM == "chr7", ]
  body<-body[body$POS > 55086714 & body$POS < 55324313, ]
  #body<-body[body$POS == 55182253, ]
  #body<-body[body$sex == "Female", ]
  
#'
  group <- read.csv(groupFile) 
  body <- body[ , c(1:3, 10:length(body))]
  body <- melt(body, id=c("CHROM", "POS", "ID"))
  body["GT"] <- cbind.data.frame(substring (body$value, 1, 3))
#' first GT allele.
  body["firstParentalAllele"]<- cbind.data.frame(substring (body$value, 1, 1))
#' second GT allele
  body["secondParentalAllele"]<- cbind.data.frame(substring (body$value, 3, 3)) 
#' Phased? Is allele origin knowed?
  body["isPhased"]<- cbind.data.frame(substring (body$value, 2, 2)=="|") 
#'  body <- melt(body, id=c("CHROM", "POS", "ID", "value", "GT", "isPhased"))
  colnames(body)[4] <- c("study_id")
#' join study data
  joint <- merge(body, group, ID="study_id") 
  freqtable<-ftable(joint$AA, joint$casestatus, joint$secondParentalAllele)
  freqtable
  heatmap(as.matrix(freqtable))
  return (joint)
}