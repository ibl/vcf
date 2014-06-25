#relies on a a y$body object as paramether

reshapeVCF <- function(body, groupFile){
  #groups <- read.csv("~/Documents/Patients VCFs/groups.csv") ##study_id field must be present
  group <- read.csv(groupFile) ##study_id field must be present
  body <- body[ , c(1:3, 10:length(body))]
  body <- melt(body, id=c("CHROM", "POS", "ID"))
  body["GT"] <- cbind.data.frame(substring (body$value, 1, 3))
  body["firstParentalAllele"]<- cbind.data.frame(substring (body$value, 1, 1)) #first GT allele. 
  body["secondParentalAllele"]<- cbind.data.frame(substring (body$value, 3, 3)) #second GT allele
  body["isPhased"]<- cbind.data.frame(substring (body$value, 2, 2)=="|") #Phased? Is allele origin knowed?
  colnames(body)[4] <- c("study_id")
  joint <- merge(body, group, ID="study_id") #join study data
  joint<-joint[joint$firstParentalAllele !=".", ]  #filter "."
  joint<-joint[joint$secondParentalAllele !=".", ] #filter "." 
  
  return (joint)
}