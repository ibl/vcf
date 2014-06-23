myfunction <- function(file, groups){
  #test on second commit
  ##file = "~/Documents/Patients VCFs/glioma.vcf"
  ##groups <- read.csv("~/Documents/Patients VCFs/groups.csv") ##study_id field must be present
  groups <- read.csv(groups)
  vcf <- readLines(file)
  #vcf.head = grep ("^##",vcf , value=TRUE)
  #vcf.head.splitted =strsplit(vcf.head, "[=,],", fixed = FALSE, perl = TRUE, useBytes = FALSE)
  ##vcf.head.splittedAgain =strsplit(vcf.head.splitted[], "[=]", fixed = FALSE, perl = TRUE, useBytes = FALSE)
  vcf.fields = grep ("^#[^#]", vcf , value=TRUE)
  vcf.body = grep ("^[^#]", vcf , value=TRUE)
  #get only a small data subset to improve speed while developing the function
  #remove this line to process all lines
  vcf.body = vcf.body[1:20] 
  vcf.fields.splitted = strsplit(vcf.fields, "\t", fixed = FALSE, perl = TRUE, useBytes = FALSE)
  vcf.body.splitted = strsplit(vcf.body, "\t", fixed = FALSE, perl = TRUE, useBytes = FALSE)
  vcf.body.splitted[["fields"]]=vcf.fields.splitted
  df <- data.frame(vcf.fields.splitted, vcf.body.splitted)
  #dft <- t(df)
  row.names(df) <- df[[1]]
  #df = df[-1,]
  #df = df[,-1]
  colnames(df) = paste("line", 1:length(df)) #paste lines # as column name
  positionData <- data.frame(t(df[1:2,1:length(df)])) #get CHROM and POS data and transpose it in a data.frame
  positionData["line"]<-row.names(positionData) #add "line" column to merge "joint" later
  #positionData = positionData[-1,]
  df <- df[c(10:length(df[[1]])),]  #get only the sample data
  df <- melt(df, id=(colnames(df[1]))) #melt data to only one variable
  colnames(df) <- c("study_id","line", "fullSampleColumn") #rename columns
  #If cbind.data.frame is not used, columns will be added as a character
  df["GT"]<- cbind.data.frame(substring(df[[3]], 1, 3)) # full genotype data (GT)
  df["fistParentalAllele"]<- cbind.data.frame(substring(df[[3]], 1, 1)) #first GT allele. 
  df["secondParentalAllele"]<- cbind.data.frame(substring(df[[3]], 3, 3)) #second GT allele
  df["isPhased"]<- cbind.data.frame(substring(df[[3]], 2, 2))=="|" #Phased? Is allele origin knowed?
  joint <- merge(df, groups, ID="study_id") #join study data
  joint <- merge (joint, positionData, ID="line") #join position data
  #joint <- as.data.frame(joint)
  return(joint)
}


