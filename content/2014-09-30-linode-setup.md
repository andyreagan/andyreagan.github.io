Title: Django on Linode: My Deployment Strategy
Date: 2014-09-30
Modified: 2014-10-06
Author: Andy Reagan
Category: Programming
Tags: hedonometer, sysadmin

Over the past six months, I definitely haven't figured out the best Django deployment strategy, but I've come a long way. The following is all set up on a [linode](https://www.linode.com/) running Ubuntu 12.04.5 LTS.
There are a few key considerations to the setup of hedonometer.org:

1. We're using a virtual machine for full control over the server
2. [Django](https://www.djangoproject.com/), because it's a python MVC framework and has good templating
3. Data files stored statically for visualizations (asynchronous loads)
4. [d3](http://d3js.org/) for the data visualization

Evolution of the server
-----------------------

At first, the whole thing was running off of the django development server, directly through nginx.
This lasted a long time.
To edit code on the server...it was edited live, through emacs (requiring root acess and port 22 open (at least only ssh keys)) and the django development server was restarted to show changes.
Static files we're collected, they were just edited in place, since this created another step in the way of editing.
Everything for the app was in `/usr/share/nginx/wiki/mysite` due to some terrible folder creation.

```bash
hedonometer.org -> nginx -> django
```

Too many times the site went down due to typos while editing, so I moved to having two separate folders, one served by nginx through dev.hedonometer.org, and the production through hedonometer.org.
This worked well enough, but the code was still edited on the server, in place, and the security was still lacking.
The files were now separated out in `/usr/share/nginx/dev`, `/usr/share/nginx/prod`, `/usr/share/nginx/data`.

```bash
hedonometer.org -> nginx -> django
dev.hedonometer.org -> nginx -> django
hedonometer.org/data -> nginx -> /usr/share/nginx/data
```

Then along came uWSGI. This got us away from the django development server, a good step forward...but we were just running two uwsgi servers from root.

```bash
hedonometer.org -> nginx -> uwsgi -> django
dev.hedonometer.org -> nginx -> uwsgi -> django
hedonometer.org/data -> nginx -> /usr/share/nginx/data
```

With a great leap, I spawned uWSGI in emporer mode, created user accounts with empty git repositories for each version of the site, and could push the site up through git, where uwsgi would restart with post commit hook, static files would be collected, etc.
The user accounts were `prod` and `dev`, so the site was hosted in `/home/prod/hedonometer` and `/home/dev/hedonometer`.
Getting a local version running with mysql on the mac was a pain, but then I could actually run the site locally.
And things were better.
Since most of the data is loaded from static data files, I started using full URL paths for the data.

And that leaves us at now.
A final upgrade removed all of the private settings in python files, and moved them all to the environment...so that the whole project could be shared on [github](https://github.com/andyreagan/hedonometer).

Setting up this strategy
------------------------

First, rip through the [security guide](https://www.linode.com/docs/security/securing-your-server) from linode. By that, I mean take a good couple days.
Then:

1. [Set up nginx](https://www.linode.com/docs/websites/nginx/websites-with-nginx-on-ubuntu-12-04-lts-precise-pangolin)
2. [Get mysql running](https://www.linode.com/docs/databases/mysql/using-mysql-relational-databases-on-ubuntu-12-04-lts-precise-pangolin)

Basically, we're going to create a user account, some settings for uwsgi and nginx to serve this account, and start the bare git repository that will be used to host it.
I've pulled these settings together from a lot of different places, mainly the docs for each service, and I also want to acknowledge that I found a [blog post by Braden MacDonald](http://bradenmacdonald.com/blog/2013/hosting-django-apps-ubuntu-nginx-uwsgi) that has a very similar strategy.
All of this can be accomplised with a long bash script, which I'll post someday, and here is the blow by blow:

Since you followed the linode security guide, log in to your user account on the linode. For me, this is `user0`.

```bash
ssh user0@hedonometer.org
su root
```

We're going to create an app called `storybreaker`, and serve it at `storybreaker.hedonometer.org`. First, make it a database:

```
echo "create database storybreaker" | mysql --user=root --password=${DJ_DB_PASSWORD}
```

Create a user account:

```
useradd -d /home/storybreaker -G www-data -m -U -s /bin/bash storybreaker
```

Log into that user account and make the git repo.

```bash
su storybreaker # log in as storybreaker
cd
mkdir .ssh && chmod 700 .ssh && touch .ssh/authorized_keys
mkdir $USER.git
cd $USER.git
git init --bare
cd ..
mkdir storybreaker
mkdir uwsgi
```

Now, while you're in as `storybreaker`, edit the post recieve hook in `~/storybreaker.git/hooks/post-recieve` to do some stuff:

```bash
#!/bin/bash
export GIT_WORK_TREE=/home/storybreaker/storybreaker
git checkout -f

python /home/storybreaker/storybreaker/manage.py collectstatic --noinput

cd ~/uwsgi
cp config{.base,.tmp}
echo "env = DJ_SECRET_KEY=${DJ_SECRET_KEY}" >> config.tmp
echo "env = DJ_DEBUG=${DJ_DEBUG}" >> config.tmp
echo "env = DJ_DB_ENGINE=${DJ_DB_ENGINE}" >> config.tmp
echo "env = DJ_DB_NAME=${DJ_DB_NAME}" >> config.tmp
echo "env = DJ_DB_USER=${DJ_DB_USER}" >> config.tmp
echo "env = DJ_DB_PASSWORD=${DJ_DB_PASSWORD}" >> config.tmp
echo "env = DJ_DB_HOST=${DJ_DB_HOST}" >> config.tmp
echo "env = DJ_DB_PORT=${DJ_DB_PORT}" >> config.tmp
echo "env = DJ_STATIC_ROOT=${DJ_STATIC_ROOT}" >> config.tmp
cp config{.tmp,}
```

where the `~/uwsgi/config.base` looks like:

```bash
[uwsgi]

# setting from braden
socket = /home/storybreaker/uwsgi/socket
chmod-socket = 666
master = true
processes = 10

# for python
virtualenv = /home/storybreaker/storybreaker/pyenv
pythonpath = /home/storybreaker/storybreaker
module = mysite.wsgi

pidfile2 = /home/storybreaker/uwsgi/pid
daemonize = /home/storybreaker/uwsgi/log
```

Make sure to get a newline at the end of the `config.base`.

And the `.env` file storying the settings for the app looks like (make sure this is sourced in `~/.bashrc`:

```bash
# /home/storybreaker/.env
export DJ_SECRET_KEY="not telling"
export DJ_DEBUG=FALSE
export DJ_DB_ENGINE=django.db.backends.mysql
export DJ_DB_NAME=storybreaker
export DJ_DB_USER=root
export DJ_DB_PASSWORD="not telling either"
export DJ_DB_HOST=127.0.0.1
export DJ_DB_PORT=3306
export DJ_STATIC_ROOT=/home/storybreaker/storybreaker/mysite/static
```

So now you can see what the post recieve hook does: copy over the files, collect static, and make a new config file for uWSGI.
Once this new config file is copied over, the server will restart, because we're about to link to it the folder that the uWSGI emporer is watching.

Copy over the ssh keys to their account:
```bash
cat ~/.ssh/authorized_keys >> /home/storybreaker/.ssh/authorized_keys
```

Now is a good time to push up the app, test the database connection, and install the requirements in the `virtualenv`.
To push from the local repo:

```bash
# locally
git remote add linode storybreaker@hedonometer.org:storybreaker.git
git push linode master
```

I store the requirements in a file called `requirements.txt`, and so setting up from here (under the storybreaker user) looks like:

```bash
# as storybreaker
env # check the the DJ_ settings are in the environment
cd ~/storybreaker
./manage.py dbshell # make sure we can log into the db
./manage.py collectstatic # check static file collection
virtualenv pyenv # set up virtualenv
. pyenv/bin/activate
pip install -r requirements.txt
```

Now, if everything worked, we just need to create and link a nginx configuration, and link the uwsgi configuration.
The nginx config file:

```bash
# the upstream component nginx needs to connect to
upstream storybreaker {
    server unix:///home/storybreaker/uwsgi/socket; # for a file socket
}

# configuration of the server
server {
    # the port your site will be served on
    listen      80;
    # the domain name it will serve for
    server_name storybreaker.hedonometer.org;
    charset     utf-8;

    # max upload size
    client_max_body_size 75M;   # adjust to taste
    # set this for local development
    # add_header 'Access-Control-Allow-Origin' 'http://127.0.0.1:54043';

    rewrite  ^/(\?.*)?$  /index.html$1  permanent;

    location /static {
        autoindex on;
        alias /home/storybreaker/storybreaker/mysite/static; # your Django project's static files - amend as required
    }

    location /data {
        autoindex on;
        alias /usr/share/nginx/data; # your Django project's static files - amend as required
    }

    # Finally, send all non-media requests to the Django server.
    location / {
        uwsgi_pass storybreaker;
        include /home/storybreaker/uwsgi_params; # the uwsgi_params file you installed
    }
}
```

```bash
# link this config
ln -s /home/storybreaker/nginx.conf /etc/nginx/sites-enabled/storybreaker
```

```bash
# from root, copy over this file we made
mv /home/panometer/uwsgi/config /etc/uwsgi/panometer.ini
# double check that they own this
chown storbreaker:www-data /etc/uwsgi/panometer.ini
# as panometer, make a link
su panometer
ln -s /etc/uwsgi/panometer.ini ~/uwsgi/config
```

Finally, just restart nginx and it should be working!

```bash
nginx -s reload
```

Things I'm looking to do
------------------------

To avoid duplicating, there are a whole host of issues that I still have, and I've posted them on the github repository: [https://github.com/andyreagan/hedonometer/issues](https://github.com/andyreagan/hedonometer/issues).


