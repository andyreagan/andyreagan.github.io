# #!/usr/bin/env python
# -*- coding: utf-8 -*- #
# from __future__ import unicode_literals
from pelican.readers import MarkdownReader

AUTHOR = 'andy reagan'
SITENAME = 'andy reagan'
SITEURL = 'https://andyreagan.github.io'

PATH = 'content'
PLUGIN_PATHS = ['plugins/pelican-plugins']
PLUGINS = ['yaml_metadata']


TIMEZONE = 'Europe/Paris'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         ('Python.org', 'http://python.org/'),
         ('Jinja2', 'http://jinja.pocoo.org/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('twitter', 'http://twitter.com/andyreagan'),
          ('github', 'http://github.com/andyreagan'),)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True

################
# custom settings

THEME='theme/finnigan'

TWITTER_USERNAME='andyreagan'

# static paths will be copied without parsing their contents
STATIC_PATHS = [
    'images',
    'presentations',
    'files',
    'teaching',
    ]

READERS = {'html': None, 'Rmd': None}

# IGNORE_FILES = ['*.Rmd']
STATIC_EXCLUDE_SOURCES = False

MARKDOWN = {
    'extension_configs': {
        'markdown.extensions.codehilite': {'css_class': 'highlight'},
        'markdown.extensions.extra': {},
        'markdown.extensions.meta': {},
    },
    'output_format': 'html5',
}
MARKDOWN_EXT = ('md',)

# get a homepage on the menu bar
MENUITEMS = [
    ("Blog","/pages/blog.html",),
    ("About", "/pages/about-me.html"),
    # ("CV", "/pages/cv.html"),
    ("Publications", "/pages/publications.html"),
    ("Teaching", "/pages/teaching.html"),
    ("Visualizations", "/pages/visualizations.html")
]

# make the URL's look nice
ARTICLE_URL = '{date:%Y}/{date:%m}/{date:%d}/{slug}/'
ARTICLE_SAVE_AS = '{date:%Y}/{date:%m}/{date:%d}/{slug}/index.html'
YEAR_ARCHIVE_SAVE_AS = '{date:%Y}/index.html'
MONTH_ARCHIVE_SAVE_AS = '{date:%Y}/{date:%b}/index.html'

# add the wordpress directory
ARTICLE_PATHS = ['']

# try to get it to only read new files
# LOAD_CONTENT_CACHE = True
CACHE_PATH = 'cache'
CHECK_MODIFIED_METHOD = 'mtime'

# PAGE_EXCLUDES = ['index.html',]
