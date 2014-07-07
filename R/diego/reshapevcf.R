#' --- 
#' Alternate Visual Analysis - Glioma Data
#' ---
#' Emanuel Diego S Penha, Jul 2014
#' 
#'
vcfFile<-"~/Dropbox/DiegoUAB/data/glioma100.vcf"
groupFile<-"~/Dropbox/DiegoUAB/data/groups.csv"
#' #### 1. dependencies and file manipulations
require("reshape")
require("vcf4r")

#' function to read GT and turn it a boolean variable
read2num<-function(xi){
  if(xi=="./."){
    xi=NA
  } else if(substr(xi,1,3)=="0/0"){
    xi=0
  } else {
    xi=1
  }
  xi
}
#' study_id field must be present
#groups <- read.csv("~/Dropbox/DiegoUAB/data/groups.csv",header = TRUE)  
vcf<-vcf2r(vcfFile)  
body<-vcf$body
#cbody<-body[body$ID != ".", ]  
body<-body[body$CHROM == "chr7", ]
body<-body[body$POS > 55086714 & body$POS < 55324313, ]
#body<-body[body$POS == 55182253, ]
#body<-body[body$sex == "Female", ]
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
# body <- melt(body, id=c("CHROM", "POS", "ID", "value", "GT", "isPhased"))
colnames(body)[4] <- c("study_id")
#' #### 2. join study data
joint <- merge(body, group, ID="study_id") 
#' #### 3. create a boolean field to save if sample has variant
#joint["hasVariant"]<-joint$GT != "0/0" & joint$GT !="./."
joint["hasVariant"]<- read2num(joint$GT)
#' #### 4. create a model object m,
m<- glm(joint$hasVariant ~ joint$casestatus + joint$sex + joint$AA, family=binomial )

#jointmelted <- melt(joint, id=c("study_id", "CHROM" ,"POS", "ID", "sampleFullData", "GT", "isPhased", "study_idinemaillist", "casestatus", "AA", "age_consented_round", "sex"))
#freqtable<-ftable(joint$AA, joint$casestatus, joint$secondParentalAllele)
#ftable(group$AA, group$casestatus, group$sex)
#' #### 5. return summary of m
summary(m)

