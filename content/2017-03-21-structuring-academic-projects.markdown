Title: Structuring academic project directories
Date: 2017-03-21
Author: Andy Reagan
Category: Programming
Tags:

Organizing the basic structure of your computer is tremendously helpful in keeping track of things. You’re a good person, so I’ll start by assuming that you’re already using unix. Still, it’s easy to get overwhelmed when poking through old directories that full of folders named “attempt1”, “attempt2”, etc. Ryan Gallagher, a fellow student from the [Computational Story Lab](http://compstorylab.org/), who is defending his Master’s Thesis today (good luck Ryan!), sums up the problem like this:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">past me from June 21st is why we can&#39;t have nice things <a href="https://t.co/r5cMselk6G">pic.twitter.com/r5cMselk6G</a></p>&mdash; Ryan Gallagher (@ryanjgallag) <a href="https://twitter.com/ryanjgallag/status/843845937097334784?ref_src=twsrc%5Etfw">March 20, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

In the great tradition of stealing, most of my setup is inspired by (read: copied from) my PhD Advisor [Peter Dodds](http://uvm.edu/pdodds/). Next, we’ll take a look at the project directories themselves.
For projects that I have worked on, the strategies employed are varied (of course), but the best structure I have found has a division of labour like this:

    .

The root directory for the project. Inside here are all of the relevant folders. Don’t set up a git repo up here, that’s one thing that have the code/paper/etc in separate folders is going to help with.

    bin/

For all of the code. If it’s Python, R, MATLAB, Perl, Julia, a Jupyter notebook…it belongs here. Now that the code is in it’s own folder, you can keep it under a clean version control, share with colleagues, and publish it to github for #openscience!

```
paper/
```

All of the tex files!

    data/

The data. The code can look for `../data` to get everything it needs. Some caveats here: it’s often large (not to be included in GitHub), and not always in this directory. Code and data aren’t easy (or always sensible) to separate: YMMV.

    figures/

Written to by the scripts, and read from for the paper. Also, tables go here! You might as well call it “shared”.
And that’s it! Other folders that show up a lot at the top level include `presentations`, `media`, and `output` for non-figure code output.
