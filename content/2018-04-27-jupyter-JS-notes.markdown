Title: Some notes about running D3 inside Jupyter
Date: 2018-04-27
Author: Andy Reagan
Category: Programming
Tags: d3, javascript, python

Many visualization packages rely on using D3 in the browser, and those include:
[Plotly](https://github.com/plotly/plotly.py/blob/master/plotly/widgets/graph_widget.py#L26),
[Vega](https://github.com/vega/ipyvega/blob/master/vega/base.py),
and [mpld3](https://github.com/mpld3/mpld3/blob/master/mpld3/_display.py)
(links point to the code for how these projects get JS interacting with Jupyter, using IPython’s [display module](https://ipython.org/ipython-doc/3/api/generated/IPython.display.html)).
Some people have
[no](http://makeyourowntextminingtoolkit.blogspot.co.uk/2016/09/interactive-d3v4js-in-jupyter-notebook.html)
[idea](http://blog.thedataincubator.com/2015/08/embedding-d3-in-an-ipython-notebook/)
[why](http://www.machinalis.com/blog/embedding-interactive-charts-on-an-ipython-nb/)
[it’s](https://multithreaded.stitchfix.com/blog/2015/12/15/d3-jupyter/)
[so](https://www.authorea.com/users/3/articles/3904-data-driven-interactive-science-with-d3-js-plots-and-ipython-notebooks/_show_article)
[hard](http://stackoverflow.com/questions/41149260/d3-js-reference-error-in-jupyter-notebook-from-local-copy),
and I’ll count myself squarely in that group
(caveat: those links are mostly random references to the topic).

The part that makes things confusing is that Jupyter uses RequireJS,
which doesn’t allow you to do the simple things easily:
load d3 from a file
(via `<script src=...` or by pushing the JS file as a string into the `Javascript()` function from IPython).
I could be wrong about this,
sometimes using the script tag to load d3 works,
but it definitely doesn’t work for jquery
(it’s non-trivial for jquery: http://requirejs.org/docs/jquery.html).

Of all the approaches to get D3 in the browser,
the ones that seem to do it right use RequireJS to load either a local or CDN copy of D3.
Here’s a good one:
https://github.com/ResidentMario/py_d3.
This is also exactly how MPLD3 does the load of D3, and their code is very clear.

<hr>

Other projects:
https://github.com/jdfreder/ipython-d3networkx/
https://mail.scipy.org/pipermail/ipython-dev/2014-April/013835.html
