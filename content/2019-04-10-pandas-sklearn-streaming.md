Title: Scoring arbitrarily large datasets with Pandas + Sklearn
Author: Andy Reagan
Date: 2019-04-10
Category: Programming
Tags: pandas, ML

The workhorses of data analysis and modeling in the [Python](http://jakevdp.github.io/blog/2014/05/09/why-python-is-slow/) universe are undoubtedly [Pandas](http://wesmckinney.com/blog/apache-arrow-pandas-internals/) and [Sklearn](https://jakevdp.github.io/PythonDataScienceHandbook/05.02-introducing-scikit-learn.html).
I won't extoll their virtues here, but focus on solving one limiting problem.
One of the major limitations of these libraries is the size of data they can handle.

In Pandas, the rule of thumb is needing 5x-10x the memory for the size of your data.
While that's fine for small datasets, things can quickly get out of hand.
At [MassMutual Data Science](https://datascience.massmutual.com/), we encountered this problem when we took a model we had trained locally,
and attempted to apply to it to the entire customer and prospect universe.
These datasets have upwards of 300 million records!

There are a couple obvious directions to take this problem:

1. Write this model on a scalable platform like Spark.
2. Program the model into our database system.
3. Just get a bigger machine.
4. Break the dataset into small pieces and apply our code.

For no particularly good reason, we had taken approach (4).
Of course, option (1) is a lot of work, if possible (a UDF for the model would always be possible).
Spark's dataframe API is quite a bit different than Pandas, so this would compromise a full rewrite.
Option (2) is only easy if we dealing with a regression model (and again, a rewrite of the data transform steps).
Option (3) seems fine, but it does have limits (and is expensive!).

Anyway, let's see if we hack option (4) to work on a laptop.

Our code looks basically like this:

```python
import pandas as pd
import pickle
import sys


def transform_data(d: pd.DataFrame, X: pd.Series) -> pd.DataFrame:
    ... do stuff
    return d


def apply_model(d: pd.DataFrame, clf) -> pd.DataFrame:
    return clf.predict(d)


def main(fname):
    medians = pd.read_csv("X.csv").median()
    with open('clf.pkl', mode='rb') as f:
        clf= pickle.load(f)

    raw_data = pd.read_csv(fname)

    clean_data = transform_data(raw_data, medians)

    scores = apply_model(clean_data, clf)

    scores.to_csv(fname[:-4]+"_scored.csv")


if __name__ == "__main__":
    main(sys.argv[1])
```

We can make this work by splitting our data into 10, or 100, parts to limit the memory needed to read the whole CSV.
The function is called like this:

```
python3 score_data.py data_part_1.csv
```
which writes the file `data_part_1_scored.csv`.
Roughly, we expect that memory and computation time will scale linearly with the size of the data.
If we need to score 10 billion rows, we need to split our data many thousand times,
and this approach becomes impractical.
(How big can pieces be for given memory footprint? etc).

The fix here is to only ever read `N` rows of data at a time.
Transform and score these `N`, write them out, and then read the next batch.
We can accomplish this by adding a function that works like this:

```python
def main_streaming(chunk_size=10000):
    medians = pd.read_csv("X.csv").median()
    with open('clf.pkl', mode='rb') as f:
        clf= pickle.load(f)

    f = sys.stdin
    score_header = f.readline().rstrip().split(',')
    g = sys.stdout
    buffer = ""
    i = 0
    for line in f:
        buffer += line
        i += 1
        if i == chunk_size:
            raw_data = pd.read_csv(StringIO(buffer), header=None,
                                   names=score_header)
            clean_data = transform_data(raw_data, medians)
            scores = apply_model(clean_data, clf)
            output = StringIO()
            pred.to_csv(output, index=False, header=False)
            g.write(output.getvalue())
            i = 0
            buffer = ""
    # get the last part
    if len(buffer) > 0:
        raw_data = pd.read_csv(StringIO(buffer), header=None,
                               names=score_header)
        clean_data = transform_data(raw_data, medians)
        scores = apply_model(clean_data, clf)
        output = StringIO()
        pred.to_csv(output, index=False, header=False)
        g.write(output.getvalue())
    f.close()
    g.close()
```

Now, we only ever accept chunksize=10000 rows into the python process.
We call our new script like:

```
cat data_part_1.csv | python3 score_data.py > data_part_1_scored.csv
```

but we also don't need to worry about the size anymore (just `data.csv` instead of `data_part_1.csv`).
We can send an arbitrarily large file here,
and scoring time will scale linearly.

As an exercise for the reader,
use multiprocessing to transform and score batches on different cores!

I went ahead and tested these memory and compute time assumptions by looking at

1. Wall time.
2. Memory use.

of each of these strategies for 100K through 500K rows of data.
Here's what we found:

<script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-lite@3"></script>
<!-- Import vega-embed -->
<script src="https://cdn.jsdelivr.net/npm/vega-embed@4"></script>

<div id="one"></div>

As expected, time scales linearly, up to 500K rows.
For memory:

<div id="two"></div>

<script type="text/javascript">
  var spec = "https://gist.githubusercontent.com/andyreagan/488042d212f6ca0c4d44ab3a8116e15a/raw/a4dc6513a09512f024fb360085c12fe1c18c2311/totaltime.vg.json";
  vegaEmbed('#one', spec).then(function(result) {
    // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
  }).catch(console.error);
  var spec = "https://gist.githubusercontent.com/andyreagan/488042d212f6ca0c4d44ab3a8116e15a/raw/a4dc6513a09512f024fb360085c12fe1c18c2311/memory.vg.json";
  vegaEmbed('#two', spec).then(function(result) {
    // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
  }).catch(console.error);
  var spec = "https://gist.githubusercontent.com/andyreagan/488042d212f6ca0c4d44ab3a8116e15a/raw/a4dc6513a09512f024fb360085c12fe1c18c2311/chunksize.vg.json";
  vegaEmbed('#three', spec).then(function(result) {
    // Access the Vega view instance (https://vega.github.io/vega/docs/api/view/) as result.view
  }).catch(console.error);
</script>

Again this is what we expected: memory remains constant for the streaming process.
We can easily extrapolate that a 3M line file would need ~30GB of memory!
A little bit more envelop math and we can see that it will take ~1.5 days to
score our 300M records.
The next optimization to apply is then to use all of the cores available,
and we'll stop here before re-inventing too many wheels.

One more fun chart to look at how chunk size for streaming affects the time
and memory of our job.
The chunksize=1 job is still running :)

<div id="three"></div>
