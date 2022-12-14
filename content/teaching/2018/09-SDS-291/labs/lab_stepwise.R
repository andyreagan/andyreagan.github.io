require(knitr)
opts_chunk$set(eval=FALSE)
require(mosaic)
require(Stat2Data)
data(FirstYearGPA)
head(FirstYearGPA)
# install.packages("leaps")
require(leaps)
# Reports the two best models for each number of predictors
best <- regsubsets(GPA ~ ., data=FirstYearGPA, nbest=2)
with(summary(best), data.frame(rsq, adjr2, cp, rss, outmat))
backward <- regsubsets(GPA ~ ., data=FirstYearGPA, nbest = 1, nvmax = 6, method = "backward")
summary(backward)
with(summary(backward), data.frame(cp, outmat))
forward <- regsubsets(GPA ~ ., data=FirstYearGPA, nbest = 1, nvmax = 6, method = "forward")
with(summary(forward), data.frame(cp, outmat))
stepwise <- regsubsets(GPA ~ ., data=FirstYearGPA, nbest = 1, nvmax = 6, method = "seqrep")
with(summary(stepwise), data.frame(cp, outmat))
