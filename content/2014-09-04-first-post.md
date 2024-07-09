Title: Github pages with Pelican
Date: 2014-09-04
Author: Andy Reagan
Category: Programming
Tags: python, github

If I get this on github pages, it will be a miracle.

So, I did. Here's how.

1. Note the date on this post, things may have changed.
2. Be ready with homebrew (on your Mac) and a github account.

Install virtualenv (with pip).

Create a new directory, i.e. "website", and start a virtual environment.
I use autoenv (brew install autoenv), which executes a .env file if it exists when you change into a directory.
Autoenv will ask you to confirm the .env file is correct.

```bash
cd website
virtualenv pyenv
echo "source /Users/andyreagan/website/pyenv/bin/activate" > .env
cd .
```

Now your prompt should be prefixed by "(pyenv)". Now start installing pelican.

```bash
pip install pelican
pip install markdown
pip install ghp-import
```

If you're going to migrate over posts from somewhere else (wordpress for me), get pandoc.

```bash
brew install pandoc
```

Now you can get started building the website with Pelican. First, make sure the github is set up. Follow the instructions on https://pages.github.com/, and leave the repository empty.
Clone it into your working directory (website) with

```bash
git clone https://github.com/andyreagan/andyreagan.github.io .
```

Finally, build the website with Pelican. I just followed the tutorial on their documentation, which is excellent: http://docs.getpelican.com/en/3.4.0/quickstart.html

Once you've got something showing in localhost, it's time to push it up to github. Hold your breath.
The publishing script that I use, very simple is:
```bash
# publishsimple.sh

pelican content -s pelicanconf.py
ghp-import output
git push -f origin gh-pages:master
```

Some other goodies. All of this is well documented within Pelican's docs, but here it is. This is the tail of my pelicanconf.py:

```python
# static paths will be copied without parsing their contents
STATIC_PATHS = [
    'images',
    'files',
    ]

# get a homepage on the menu bar
MENUITEMS = [("Home","/index.html",),]

# make the URL's look nice
ARTICLE_URL = '{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = '{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'
YEAR_ARCHIVE_SAVE_AS = '{date:%Y}/index.html'
MONTH_ARCHIVE_SAVE_AS = '{date:%Y}/{date:%b}/index.html'
```

And I did fork my own theme. Copied over the theme from "pyenv/lib/python2.7/site-packages/pelican/themes/simple/templates/" into "theme/finnigan".
I also created the "static" folder alongside "templates," and put the "css" and "js" and "images" folders inside static.

Then set this to be the theme in "pelicanconf.sh":

```python
THEME='theme/finnigan'
```

If you've made it this far, start writing!

Cheers!



