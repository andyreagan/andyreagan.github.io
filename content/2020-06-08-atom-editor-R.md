Title: Atom vs RStudio
Author: Andy Reagan
Category: Programming
Tags: R, development environment
Date: 2020-06-08

Let's talk about workflow.

Most R users that I know use RStudio.

Most programmers that I know use a text editor like Emacs,
or use what is embedded into an IDE like PyCharm or IntelliJ.
https://jstaf.github.io/2018/03/25/atom-ide.html

There are some things to like about RStudio (especially once you [get the layout right](https://www.r-bloggers.com/a-perfect-rstudio-layout/)),
but it's a still a primarily _point-and-click_ experience.
I want to be able to do text editor things that should never need a mouse:
open and close files,
comment out lines,
edit many lines of text at the same time.
At the same time I want to be able to do IDE things without excessive (or any) pointing and clicking around:
run bits of code,
run entire scripts,
view the contents of dataframes,
find where functions are defined.
All of this is possible in **Atom using Hydrogen**.

Let's run through a few examples of what this looks like in day-to-day use,
and then I'll share the nitty gritty on getting Atom+Hydrogen set up (it's not _quite_ as streamlined as just downloading RStudio).

## Create a file and start the editor

First, we need a file. Start in the project directory.

### Atom

Start Atom with `atom .` or jump through the file creation with `atom scratch.R`. If you just opened Atom with `atom .` (which I usually do), just `^x ^f`, type the path (let's just create `scratch.R`) and start typing. So far, we've spent a few seconds at the keyboard to create the file and type out `x = 10`.

### RStudio

We can start RStudio the same way, `RStudio .`, and create the new file with `Command+N`.
We can give it the filename by saving, `Command+s`. If the file already existed, we'd need to click the Files pane, navigate to it, and click the filename.
Click on the file, and type in `x = 10`.

## Run code

Now let's go ahead and start running code.

### Atom

To start the kernel first: Command+P, start typing "start" and hit enter to `Hydrogen: Start Local Kernel`.
You'll have to hit enter again to select "R" and then boom, you `10` printed after.
You could also just Shift+Enter on the line `x=10` and Atom will go ahead and start the kernel for you (you'll still need to hit enter to confirm "R").

### RStudio

This is about the same, Shift+Enter and your code runs in "Console" pane.

## Write more code

This where RStudio and Atom really get different.
In Atom, with `atomic-emacs`,
I can do all of the following things from the keyboard:

- Grab a block of code to indent, edit in multi-line mode, or comment it out.
    - In Rstudio, you could select with the mouse and use the menu or a keyboard shortcut to comment lines, or auto-indent lines.
- Move the cursor forward by whole words, and/or select parts of code this way.
    - Again, this is a point and click in R.

I guess this is really the biggest differentiator for me in Atom:
the ability to manipulate raw text very quickly and easily,
without any clicking around or selecting things.
Making tasks that take 15 seconds only take 3 seconds (like executing a specific part of a line, or block of code) adds up!

## Setting up Hydrogen

You still need base R,
and then to [install the IRKernel](https://github.com/IRkernel/IRkernel).

In one line:

    Rscript -e 'install.packages("IRkernel", repos="http://cran.us.r-project.org"); IRkernel::installspec(name = "ir351", displayname = "R 3.5.1");'

Install the following Atom packages:

- https://atom.io/packages/atom-language-r
- https://atom.io/packages/hydrogen

And in the Atom settings for Hydrogen,
under "language mapping",
set `{"ir351": "R"}`.
You may not need to set this, I didn't need to, but just in case.

Enjoy whichever editor you're using :)