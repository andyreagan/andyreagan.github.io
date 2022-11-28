Title: Cross repository version control, using symbolic links
Date: 2015-07-09
Author: Andy Reagan
Category: Programming
Tags: git

So, you've been writing lots and lots of awesome code.
As your codebase amasses, you can rely on snippets that you've already written, in different projects, by copying them around and upgrading as you go: productivity++.
And, because you're a good person, you use `git` to version control your projects.

But now, you have so many cool functions that you want to use them everything, and are left with 20 different versions across projects, each with the their own goodies.
Combining them into one library is painstaking, but you do it, and import that library into each of your projects.

Every time you upgrade it for a project, you have to load the latest version into each project, and make sure it all still works.
The pain of updating and versioning your own code has overwhelmed you.

So you put all the shared code into it's own project, and symbolically link it from all of your other projects.
Success!
But now, when you upload to github, and deploy through git, only the link get's included, and not the file.
Damnit!

Git doesn't follow symbolic links and this is generally good practice.
But, you need it to.
Here is my super ugly solution: use the `.git/hooks/pre-commit` and `post-commit` to replace the links with the files, commit, then replaces the files back with the links!
Only problem now is that `git` thinks that the mode has changed between every commit...too bad.

```
# .git/hooks/pre-commit
#!/bin/sh
LINKED_DIR=/Users/andyreagan/work/2015/07-hedotools/js
cd $GIT_DIR
cd ..
for FILE in d3.andy.js hedotools.init.js hedotools.shifter.js topojson.js urllib.js
do
\rm js/$FILE
cp $LINKED_DIR/$FILE js
git add js/$FILE
done
```

```
# .git/hooks/post-commit
#!/bin/sh
LINKED_DIR=/Users/andyreagan/work/2015/07-hedotools/js
cd $GIT_DIR
cd ../js

# now, copy over the files
for FILE in d3.andy.js hedotools.init.js hedotools.shifter.js topojson.js urllib.js
do
\rm $FILE
ln -s $LINKED_DIR/$FILE $FILE
done
```
