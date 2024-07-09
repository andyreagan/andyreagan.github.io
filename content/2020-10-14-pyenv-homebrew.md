Title: Homebrew and Pyenv Python Playing Pleasantly in Partnership
Author: Andy Reagan
Category: Programming
Tags: python, development environment
Date: 2020-10-14

Like [many](https://towardsdatascience.com/how-to-setup-a-python-environment-for-machine-learning-354d6c29a264) [data](https://towardsdatascience.com/power-up-your-python-projects-with-visual-studio-code-401f78dd97eb) [scientists](https://towardsdatascience.com/the-python-dreamteam-27f6f9f08c34) and [Python](https://towardsdatascience.com/guide-of-choosing-package-management-tool-for-data-science-project-809a093efd46) [developers](https://towardsdatascience.com/how-to-setup-an-awesome-python-environment-for-data-science-or-anything-else-35d358cc95d5) [before](https://towardsdatascience.com/managing-virtual-environment-with-pyenv-ae6f3fb835f8) [me](https://towardsdatascience.com/power-up-your-python-projects-with-visual-studio-code-401f78dd97eb),
[I've](https://towardsdatascience.com/setting-up-your-data-science-work-bench-4a8d3a28205c) [given](https://towardsdatascience.com/python-environment-101-1d68bda3094d) [up](https://towardsdatascience.com/venvs-pyenvs-pipenvs-oh-my-2411149e2f43) [on](https://towardsdatascience.com/the-top-4-virtual-environments-in-python-for-data-scientists-5db1c01fd779) managing my own Python builds and turned to [pyenv](https://github.com/pyenv/pyenv) (links to chronological posts in Towards Data Science).
At various points in time, I built Python versions [from source myself](https://www.python.org/downloads/source/) or used the [prebuilt Framework installers](https://www.python.org/downloads/mac-osx/) on OSX, all while managing the links in `/usr/local/bin` by hand.
With either of those methods, I had no problem spinning virtual environments from any of the installed versions, but most recently my PATH and me got mixed up on whether we were using Homebrew's `python@3.8` or the Framework version I had installed.
Enter pyenv.
If you're looking for how to set up pyenv, [there](https://amaral.northwestern.edu/resources/guides/pyenv-tutorial) [are](https://opensource.com/article/20/4/pyenv) [no](https://www.liquidweb.com/kb/how-to-install-pyenv-on-ubuntu-18-04/) [shortage](https://wilsonmar.github.io/pyenv/) [of](https://mungingdata.com/python/how-pyenv-works-shims/) [articles](https://realpython.com/intro-to-pyenv/) [or](https://medium.com/python-every-day/python-development-on-macos-with-pyenv-2509c694a808) [blog](https://medium.com/@weights_biases/pyenv-tutorial-for-machine-learning-9638e43a790f) [posts](https://sourabhbajaj.com/mac-setup/Python/) [on](https://anil.io/blog/python/pyenv/using-pyenv-to-install-multiple-python-versions-tox/) [how](https://stackabuse.com/managing-python-environments-with-direnv-and-pyenv/) [to](https://duncanleung.com/set-up-python-pyenv-virtualenv-poetry/) [install](https://binx.io/blog/2019/04/12/installing-pyenv-on-macos/) [it](https://www.digitalocean.com/community/tutorials/how-to-manage-python-with-pyenv-and-direnv), however, I'd recommend sticking to the official documentation.
As some of these articles mention, there are many ways to get Python on your OSX systems:

- There's the built in Python 2.7.x (note: Python 2 is deprecated as of Dec 2019).
- Homebrew will provide a Python 3 build to satisfy it's own dependencies.
- You could have the Framework versions.
- You could have built it from source.
- Or as many would recommend, you can use pyenv to manage the versions.

Your system needs the built-in, and Homebrew is really only going to keep a single version of Python 3 for you, so you need to pick between the last three if you want to manage specific versions of Python 2 or 3.
I omitted Anaconda since I haven't needed it or taken the time to really understand how it works, but I have heard success stories for Windows users.
Here, we'll choose pyenv to manage python versions, but in doing so, we'll initially have multiple versions of both Python 2 and Python 3 on our system (those from pyenv in addition to the builtin version 2 and homebrew version 3).
Again, there's nothing we can do with the Python 2 builtin, OSX needs it.
**For Python 3, we can have Homebrew _use_ one of pyenv's Python versions to eliminate that source of redundancy.**
Before we get started, it's worth noting that you're [unlikely to experience conflicts](https://stackoverflow.com/questions/32018969/coexistence-of-homebrew-and-pyenv-on-macosx-yosemite/64364243#64364243) between pyenv and homebrew if you use your `PATH` like pyenv recommends, and [Homebrew warns against it](https://docs.brew.sh/Homebrew-and-Python); you're wading into the territory of relying on your own understanding to support this use case (as Homebrew states in their post).

## Use pyenv's Python to satisfy Homebrew dependencies

These [Stack Overflow answers](https://stackoverflow.com/questions/30499795/how-can-i-make-homebrews-python-and-pyenv-live-together) have the right idea of using symbolic links (symlinks), but from what I can tell they don't get the links quite right.
Let's get them right!

If you already have any traces of Homebrew's python3, first get rid of them (`brew unlink python3` and `brew uninstall python3`). If you already had python@3.8 from Homebrew, when uninstalling it, note the packages that depended on it (for example, `ffmpeg`), and reinstall them after.

As of this post, Homebrew is expected Python 3.8.6 for it's python@3.8, so first install that version with pyenv [following their documentation](https://github.com/pyenv/pyenv):

```sh
pyenv install 3.8.6
```

That will put (by default) the actual Python install in

```sh
~/.pyenv/versions/3.8.6
```

Now we just need to add one link, and then let brew do the rest. I'll use full paths here, so you can run this from anywhere (and remember to read `ln -s ... ...` in your head as "<u>l</u>ink -<u>s</u>ymbolic [target] [linkname]"):

```sh
ln -s ~/.pyenv/versions/3.8.6 $(brew cellar python)/3.8.6
```

With the `-f` flag, you could have omitted the trailing `/3.8.6`, as `ln` will use the name of the target. To be as explicit as possible on the link, you should have

```sh
ln -s ~/.pyenv/versions/3.8.6 /usr/local/Cellar/python@3.8/3.8.6
```

Here's what the result should look like:

```sh
➜  ~ ll $(brew --cellar python)
total 0
lrwxr-xr-x  1 [my username]  admin    36B Oct 14 16:52 3.8.6 ->
/Users/[my username]/.pyenv/versions/3.8.6
```

Finally, let Homebrew manage the rest of necessary linking:

```sh
brew link python3
```

This article was inspired by my own exploration of how to make it work and that the answer to this question on Stack Overflow went unanswered ([I answered it, I think!](https://stackoverflow.com/a/64364156/2577988)).
