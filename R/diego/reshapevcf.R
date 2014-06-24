#relies on a a y$body object as paramether

reshapeVCF <- function(body){
  
  body <- body[ , c(1:3, 10:length(body))]
  body <- melt(body, id=c("CHROM", "POS", "ID"))
  body["GT"] <- substring (body$value, 1, 3)
  body["fistParentalAllele"]<- substring (body$value, 1, 1) #first GT allele. 
  body["secondParentalAllele"]<- substring (body$value, 3, 3) #second GT allele
  body["isPhased"]<- substring (body$value, 2, 2)=="|" #Phased? Is allele origin knowed?
  groups <- read.csv("~/Documents/Patients VCFs/groups.csv") ##study_id field must be present
  body <- body
  # Done, return y
  return (body)
}