Title: Developing with hedonometer.org
Date: 2014-10-02
Modified: 2019-12-30
Author: Andy Reagan
Category: Programming
Tags: hedonometer, sysadmin

~This is a draft.~

Edit: 2019-12-30 this _was_ a draft, I'm just going to publish it.

Long story short, you'll need to clone the git repository on bitbucket (if you don't have a bitbucket account let me know and I'll move it to github, they're the same kind of thing).
Then you can add a remote that is the linode, (you ssh keys are already in all of the new user accounts on the linode under which the apps run), change the code, and then push to the linode.

For me editing the master branch (this is fine since you're just changing text) looks like:

```bash
git pull origin master # update the local version
source pyenv/bin/activate # initialize python virtual environment
./manage.py runserver 54043
# edit the code
# all the changes are viewable at 127.0.0.1:54043
C-c # to close the server
git status # check what you changed
git add newfile.html # add any new files
git commit -am "simple commit" # commit all changes to watched files
git push origin master # push to the bitbucket
git push production master # push to the linode
```

The remote should look like:

```bash
happy% git remote -v
origin https://andrewreagan@bitbucket.org/andrewreagan/linode-backup.git (fetch)
origin https://andrewreagan@bitbucket.org/andrewreagan/linode-backup.git (push)
production prod@hedonometer.org:prod.git (fetch)
production prod@hedonometer.org:prod.git (push)
test dev@hedonometer.org:dev.git (fetch)
test dev@hedonometer.org:dev.git (push)
```

Which is setup with `git remote add production prod@hedonometer.org:prod.git`.

The specific files that you'll want to edit are in `hedonometer/templates/hedonometer/*.html`.
Once you've cloned the repository, you can set up the virtual python environment using `virtualenv pyenv`, installed from `brew install virtualenv`. Then source the virtualenv, and use pip to install the following:

```python
Django==1.6
South
django-tastypie
django-sekizai
MySQL-python
```

Oh, also, for the site to run locally, you need a local mysql server and to put the connection settings into your environment. Getting the mysql server running (installed with `brew install mysql`) was annoying at best, but then once you've got it running and created a database, my local environment settings are in a .env file in the repository:

```bash
export DJ_SECRET_KEY=******
export DJ_DEBUG=1
export DJ_DB_ENGINE=django.db.backends.mysql
export DJ_DB_NAME=testdb
export DJ_DB_USER=root
export DJ_DB_PASSWORD=arret3
export DJ_DB_HOST=
export DJ_DB_PORT=
export DJ_STATIC_ROOT=/Users/andyreagan/work/2014/2014-09hedonometer/mysite/static
alias minify="yuicompressor"
```

So...wow that sounds a lot more complicated than I thought it would be.

A lot of the fuss is to get the site running locally, but as long as you don't need to see changes until they're on the site, you wouldn't need to get the site running locally...you could just clone the git repository, and push changes up the site.
