Title: Using github pages for a project
Date: 2016-01-12
Author: Andy Reagan
Category: Programming
Tags: github

If you're unfamiliar with git, start by reading this: [the git parable](http://tom.preston-werner.com/2009/05/19/the-git-parable.html). It was recommended to my by Prof. Jim Bagrow, and I wasted a lot of time trying to understand git before reading it.

Now, we're going to use git (and the git hosting site: github) to version control and share our project. First things first, if you don't want to share your code to world right away, since you're a student go ahead and grab the [github student pack](http://andyreagan.github.io/2016/01/12/using-github-pages-for-a-project/) (thanks Mark for pointing this out). Among other things, it includes 5 free private repositories hosted on github.

Getting right to it, if you're not using git already in your project:

```
git init
```

and then go ahead and just add everything (but don't include your huge (>50MB) data files).

Do your first commit, connect to github, and push your master branch up to github. If that's unclear, there are better explanations on the web than any I could offer (see the parable above).

Now, create a new branch like this:

```
git checkout --orphan gh-pages
```

I found that here: [random git help](http://bitflop.com/tutorials/how-to-create-a-new-and-empty-branch-in-git.html).

And carefully remove everything in it that you don't want on the website version. (Keep stuff you're sharing, and don't remove stuff not tracked by git!). I won't fully recommend this command: `\rm -rf *`. Now, commit that branch, and push it to github:

```
git commit -am "first commit of gh-pages branch
git push origin gh-pages
```

(Assuming you added github as origin).

You now have a github pages project for your repo! Your URL (consult the [github docs](https://help.github.com/articles/user-organization-and-project-pages) if you want to know more) is `http(s)://<orgname>.github.io/<projectname>`.

You're done! Checkout master to keep working, grab files from that into gh-pages (checkout gh-pages and do `git checkout master myfile`), create an index.html in the root of your gh-pages, have fun!

