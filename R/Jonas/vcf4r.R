#' converts a VCF text file into an R structure with a head and a body
#' @param fname is the file name
#' @seealso \code{\link{r2vcf}} does the opposite
vcf2r <- function(fname){
  fid = file(fname,"r") # opens file channel for reading
  y = list(head=list(c("fileformat")),body=data.frame());
  L <- readLines(fid,n=1)
  # 1. make sure this is a VCF file
  if(substr(L,1,13)=="##fileformat="){
    y$head$fileformat=substr(L,14,nchar(L))
  }else{
    stop("this doesn't look like a VCF file: first line should be ##fileformat=...")
  }
  # 2. VCF metadata (head)
  while(substr(L,1,2)=="##"){
    #cat(L,'\n')
    L = readLines(fid,n=1)
    sep = regexpr("=",L) # find separator between A=V
    A = substr(L,3,sep-1)
    V = substr(L,sep+1,nchar(L))
    # if field doesn't exist, create it
    if(is.null(y$head[A][[1]])){ 
      y$head[A][[1]]=c(V)
    } else{
      y$head[A][[1]]=c(y$head[A][[1]],V)
    }
  }
  close.connection(fid) # reading line by line is over
  # 3. VCF body will contain the data.frame 
  # 3.1. Column headers await in L
  colNm = strsplit(substr(L,2,nchar(L)),"\t")
  # 3.2. Since all lines starting with "#" will be ignored by table.read, we can use it to read the data
  y$body=read.table(fname,header=FALSE)
  colnames(y$body)<-colNm[[1]]
  # Done, return y
  y
}

#' converts a list structure created by vcf2r back onto a VCF text file
#' @param y is a list with a $head and a $body
#' @param fname is the file name
#' @seealso vcf2r does the opposite
r2vcf <- function(y,fname){ # write the reverse conversion, of a vcf list structure back to a vcf text file
  # make sure this is a vcf list
  if(is.null(y$head$fileformat)){
    stop("sorry, this doesn't look like a VCF list")
  }
  # 1. Start by file format
  fid = file(fname,"w") # opens file channel for writing
  L = paste("##fileformat=",y$head$fileformat,sep="")
  writeLines(L, con = fid, sep="\n")
  # 2. Write the rest of the head
  for(h in names(y$head)){
    if((nchar(h)>0)&&(h!="fileformat")){
      for(i in 1:length(y$head[h][[1]])){
        L=paste("##",h,"=",y$head[h][[1]][i],sep="")
        writeLines(L, con = fid, sep="\n")
      }
    }
  }
  # 3. write row headers of the body
  L=paste("#",paste(colnames(y$body),collapse="\t"),sep="")
  writeLines(L, con = fid, sep="\n")
  for(i in 1:nrow(y$body)){
    L=paste(as.vector(t(y$body[i,])),collapse="\t")
    writeLines(L, con = fid, sep="\n")
  }
  close.connection(fid) # done writing
  x=y
}

#' shortens a vcf structure created by vcf2r by sampling n lines
#' @param vcf a named lst created by vcf2r
#' @param n is teh number of lines
#' @seealso vcf2r, whcih creates the vcf, and r2vcf which writes it back to a .vcf text file
vcfn <- function(vcf,n=10){
  # shorten $body file to consider only n random rows
  vcf$body=vcf$body[sample(1:nrow(vcf$body),n),]
  vcf
}

