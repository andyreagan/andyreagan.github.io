Title: Atom vs RStudio
Author: Andy Reagan
Date: 2020-06-08
Status: draft


Let's talk about workflow.

Most R users that I know use RStudio.

Most programmers that I know use a "proper" text editor like Emacs,
or use what is embedded into an IDE like PyCharm or IntelliJ.
https://jstaf.github.io/2018/03/25/atom-ide.html

There are some things to like about RStudio (especially once you [get the layout right]()),
but it's a still a primarily point-and-click experience.
I want to be able to do text editor things that should never need a mouse:
open and close files,
comment out lines,
edit many lines of text at the same time.
At the same time I want to be able to do IDE things without excessive (or any) pointing and clicking around:
run bits of code,
run entire scripts,
view the contents of dataframes.
All of this is possible in Atom using Hydrogen.

Let's run through a few examples of what this looks like in day-to-day use,
and then I'll share the nitty gritty on getting Atom+Hydrogen set up (it's not _quite_ as streamlined as just downloading RStudio).

First, we need a file.
Start in the project directory
Atom: Start Atom with `atom .` or jump through the file creation with `atom scratch.R`. If you just opened Atom with `atom .` (which I usually do), just `^x ^f`, type the path (let's just create `scratch.R`) and start typing. So far, we've spent a few seconds at the keyboard to create the file and type out `x = 10`.
RStudio: We can start RStudio the same way, `RStudio .`, and create the new file with `Command+N`.
We can give it the filename by saving, `Command+s`. If the file already existed, we'd need to click the Files pane, navigate to it, and click the filename.

Now let's go ahead and start running code.
Atom: To start the kernel first: Command+P, start typing "start" and hit enter to `Hydrogen: Start Local Kernel`.
You'll have to hit enter again to select "R" and then boom, you `10` printed after.
You could also just Shift+Enter on the line `x=10` and Atom will go ahead and start the kernel for y ou (you'll still need to hit enter to confirm "R").
RStudio: this is about the same, Shift+Enter and your code runs in "Console" pane.

...

## Setting up Hydrogen


