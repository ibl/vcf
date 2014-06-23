# VCF4R parsing VCF by JSA
# also a chance to learn a bit of R
# http://cran.r-project.org/doc/manuals/R-intro.pdf
# http://cran.r-project.org/doc/manuals/r-release/R-lang.html
# quick introduction to dataypes: http://www.r-tutor.com/r-introduction
# debugging with RStudio:
# https://support.rstudio.com/hc/en-us/articles/200713843-Debugging-with-RStudio

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