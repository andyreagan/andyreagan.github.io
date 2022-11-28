Title: Analyzing Strava metadata
Author: Andy Reagan
Category: Fitness
Tags: sweat science
Date: 2019-12-30

I love running,
and I love stroller running with my son even more.
Strava is my go-to fitness app and I've tagged all of my stroller runs
with a searchable tag so I can count the miles we've logged together,
mostly while he has slept!

The search functionality on Strava's site doesn't provide summaries like total miles,
but I can search my own data easily using Python.

## Request your archive

Go to your settings:

<img src="/images/2019-12-30-strava-metadata/step-01.png" class="img-responsive">

Account page:

<img src="/images/2019-12-30-strava-metadata/step-02.png" class="img-responsive">

Click the download button:

<img src="/images/2019-12-30-strava-metadata/step-03.png" class="img-responsive">

Click this button:

<img src="/images/2019-12-30-strava-metadata/step-04.png" class="img-responsive">

Then you'll get an email with a link to your data.

## Load up your data.

This part is simple,
and to make things even easier I'll use Pandas.

```
import pandas as pd
df = pd.read_csv("activities.csv")
df.head()
```

Then we can pull out all of the activies with type Run,
that contain the stroller tag, and sum up the miles all like this:

```
run = df["Activity Type"].str.contains("Run")
stroller = df["Activity Name"].str.contains("#stroller")
miles = (df
    .loc[run & stroller, :]  # filter
    .loc[:, 'Distance']  # select
    .astype('float')  # convert dtype
    .sum()/1.609  # sum and convert to miles
)
miles
```

Let's break that down: first, we select out two filters (type Run and stroller in the title),
then we convert the distance field to a float,
then we sum it up.
The last step converts km into miles.
I had actually first written it in one line,
as below,
but thought the above would be clearer.

```
df.loc[df["Activity Type"].str.contains("Run") & df["Activity Name"].str.contains("#stroller"), :].Distance.astype('float').sum()/1.609
```

All told, by the end of 2019 I'll have logged 857 miles with my little man.


