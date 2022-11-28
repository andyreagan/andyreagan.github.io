Title: Linking files from GitHub in CodePen
Date: 2017-11-08
Author: Andy Reagan
Category: Programming
Tags: github

In the course I teach at UC Berkeley in the MIDS program, we use CodePen to build interactive web graphics.
There are a host of reasons to use CodePen, but setting that aside for now, let's talk about how to host data files for CodePen.
CodePen lacks a way for us to store full files alongside our HTML pages, and since we're using CodePen to data vis, we need data!
Naturally, we'll load data from GitHub, where it should be (*with the exception of files over 50MB, those are too big for GitHub and probably too big to load into the browser!*).

In the course, we look at a map that myself and team of Data Scientists at MassMutual built during our Data Days for Good project.
We made a visualization of data from the Pioneer Valley Planning Commission, the PVPC, and you can see the map that we made here: [http://massmutual.github.io/pvpc_map](http://massmutual.github.io/pvpc_map).

To load the data files used in this map into a CodePen that can be edited, the easiest way is just click on the files in the repository, all the way down to the "raw" view of the files.
You'll end up with a link like this:
`https://raw.githubusercontent.com/massmutual/pvpc_map/master/data/pvpc_map/pvpc_towns.csv?token=AC33CYRi-2bMOocYNFelx_iQ9rccQDzcks5aC85gwA%3D%3D`

which works just fine.

## But, crucially, the token at the end of the URL above will go stale!

To get around this, we instead need to load the data from the GitHub Pages hosting here: `https://massmutual.github.io/pvpc_map/data/pvpc_map/pvpc_towns.csv`.

This gives us a stable URL for the data file, and we're off to developing more visualization features.
Here is the CodePen for the map:
[https://codepen.io/MIDS-W209/pen/xLBrRy](https://codepen.io/MIDS-W209/pen/xLBrRy).
