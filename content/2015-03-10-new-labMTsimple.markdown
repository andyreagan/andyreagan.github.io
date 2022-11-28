Title: labMTsimple: upgrades!
Date: 2015-03-10
Author: Andy Reagan
Category: Programming
Tags: hedonometer, python

As part of an ongoing effort to evaluate different sentiment analysis tools, I've pushed a handful of upgrades to labMTsimple.
Namely:

1. Python 3 compatible
2. New module "speedy," aiming for speed (also using numpy)
3. Class-based sentiment object
4. ANEW, MPQA, and Liu's dictionaries are included
5. Using "marisa-trie" and "datrie" for fast prefix matching

It's all available on [github](https://github.com/andyreagan/labMT-simple) as well as on [pypi](https://pypi.python.org/pypi/labMTsimple/2.2.2.1) for installation via pip.

Of course, the vectors produced for the labMT set in english by the speedy module are ordered the same.
Also, no other languages for labMT on speedy yet.

Stay tuned for the results of performance tests from these other dictionaries on a variety of corpuses.
