Title: Using labMT-simple to make wordshifts
Date: 2014-09-24
Author: Andy Reagan
Category: Programming
Tags: python, javascript, d3, hedonometer

I just merged updates to the d3 wordshift plotting into labMTsimple, and combined with phantom crowbar (see previous post), it's easier than ever to use the labMT data set to compare texts.

To make an html page with the shift, you'll just need to have labMT-simple installed.
To automate the process into generating svg files, you'll need the phantom crowbar, which depends on phantomjs.
To go all the way to pdf, you'll also need inkscape.

Let's get set up to make shifts automatically.
Since they're aren't many dependencies all the way down, start by getting phantomjs installed, then the phantom-crowbar.

Installing phantom-crowbar
--------------------------

For the phantomjs, I prefer to use homebrew:

```bash
brew update
brew upgrade
brew install phantomjs
```

Then to get the crowbar, clone the git repository.

```bash
cd ~
git clone https://github.com/andyreagan/phantom-crowbar
```

To use it system-wide, I use the bash alias:

```bash
alias phantom-crowbar="/usr/local/bin/phantomjs ~/phantom-crowbar/phantom-crowbar.js"
```

Without too much detail, I recommend adding this to your `~/.bash_profile` so that it's loaded every time you start a terminal session.

Installing inkscape
----------------------

You only need inkscape if you want to go from svg to pdf (and there are other ways too), but this one is easy with, again, homebrew.

```bash
brew install inkscape
```

Installing labMTsimple
----------------------

There are two ways to get it: using pip of cloning the git repo.
If you're not sure, use pip.
I think pip makes it easier to keep it up to date, etc.

```bash
pip install labMTsimple
```

Making your first shift
-----------------------

If you cloned the git repository, install the thing and then you can check out the example in `examples/example.py`.
If you went with pip, see that file on [github](https://github.com/andyreagan/labMT-simple/blob/master/examples/example.py).

The basic idea is to generate the word vectors, and then pass them to `shiftHtml()`.
In a little bit more detail, the key pieces are:

```python
# load the module
from labMTsimple.storyLab import *

# get word, and word score frequency vectors
labMT,labMTvector,labMTwordList = emotionFileReader(stopval = 0.0, returnVector=True)

# see the example file, but assuming there are two strings to score
# named "saturday" and "tuesday", generate their word frequency vectors
saturdayValence,saturdayFvec = emotion(saturday,labMT,shift=True,happsList=labMTvector)
tuesdayValence,tuesdayFvec = emotion(tuesday,labMT,shift=True,happsList=labMTvector)

# apply the traditional lens to the frequency vectors
# this sets the frequency of words with score between
# 4 and 6 (corresponding to stopval of 1)
tuesdayStoppedVec = stopper(tuesdayFvec,labMTvector,labMTwordList,stopVal=1.0)
saturdayStoppedVec = stopper(saturdayFvec,labMTvector,labMTwordList,stopVal=1.0)

# generate an html file
# and make a static directory
shiftHtml(labMTvector,labMTwordList,tuesdayStoppedVec,saturdayStoppedVec,"wordshift.html")

```

That last call actually does quite a few things, in detail:

1. Creates a directory called `static`, in your working directory
2. Copies in a handful of files into `static`
3. Writes a javascript file called `static/wordshift.js` that has the lens, words, and both frequency vectors written out. The name is based off the root of the html file you've told it to write.
4. Writes an html file, which loads all the javascript in static.

Phew! We've made the html file. You can open it directly in Chrome (or your browser of choice...IE not tested).

The optional, final step is to make the svg and/or pdf:

```bash
phantom-crowbar wordshift.html shiftsvg wordshift.svg
inkscape -f wordshift.svg -A wordshift.pdf
```

Finally, check out wordshift.pdf for the file!
And I'm working on upgrades, like optionally removing the shift button or putting numbers on the axes, so look out for more.

And feel free to tweet suggestions at [@andyreagan](https://twitter.com/andyreagan), and submit pull requests to the [source code](https://github.com/andyreagan/labMT-simple)!


