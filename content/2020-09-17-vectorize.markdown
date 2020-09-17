Title: Vectorizing code matters
Author: Andy Reagan
Date: 2020-09-17

I come from the world of MATLAB and numerical computing,
where for loops are shorn and vectors are king.
During my PhD at UVM,
[Professor Lakoba](http://www.cems.uvm.edu/~tlakoba/)'s Numerical Analysis class was one of the most challenging courses I took
and the deep knowledge of numerical code still sticks with me.
My favorite example of a vectorization is when a colleague shared his Lorenz 96 code with me,
after writing a really cool paper about it that footnoted the massive amount of computation involved.
Well, vectorizing the inner loop was about 4x faster,
so now the footnote is a just a carbon footprint.

Fast numerical code is what makes machine learning even possible these days,
though I'm not sure how many of the kids these days can write a [QR decomposition in C](https://www.academia.edu/4902724/Numerical_Recipes_in_C_The_Art_of_Scientific_Computing_2nd_Ed_William_H_Press).
I'm kidding, because I haven't done it, but I sure as heck could write it in MATLAB (at one point)
or in Numpy or Julia now (I'll stick to just magrittr and dplyr in R).
A lot of the work I do at MassMutual is fundamentally numerical computation,
and the difference of a pipeline that takes hours, even minutes from one that takes seconds is a big deal.
Seconds means we can iterate, try more options, and move faster.
Still, a lot of numerical code is written in pure Python (no Cython, no Numba),
for the _flexibility_.
I'm going to argue that this is a bad idea!
Here's a paraphrased email from a colleague:

> In pseudocode, this is the 'actuarial' coding dilemma I ran into months back:
>
>     EOM = 0
>     for months in years:
>         PREM = 50
>         BOM = EOM + PREM
>         WIT = 5
>         EOM = BOM – WIT
>
> A simple example, but I think shows the BOM/EOM interdependence (there are a few other variables with a similar relationship.)
> You can’t vectorize BOM without knowing EOM, and you can’t vectorize EOM until you know BOM.
> Then you might have situations where IF WIT > 0 , PREM = 0.
> Basically a lot of inter-dependence emerges.
> Now a lot of the function is not appear easily vectorizable.

Well, I can vectorize this, and I did.
Here's the non-vectorized version in Python:

    import numpy as np
    years = 10
    bom = np.zeros(years*12)
    eom = np.zeros(years*12)
    for month in range(1, years*12):
        prem = 50
        bom[month] = eom[month-1] + prem
        wit = 5
        eom[month] = bom[month] - wit

And here's the vectorized version:

    import numpy as np
    years = 10
    prem = 50
    wit = 5

    eom = np.arange(years*12)*prem - np.arange(years*12)*wit
    # and if you still want bom as an array:
    bom = eom + np.arange(years*12)*wit

I also wrote the for-loop even more flexibly (read: as slow as I could think to) by using a list of dicts:

    years = 10
    prem = 50
    wit = 5
    result = [{'bom': 0, 'eom': 0}]
    for month in range(1, years*12):
        inner = {}
        inner.update({'bom': result[month-1]['eom'] + prem})
        inner.update({'eom': inner['bom'] - wit})
        result.append(inner)

This one above returns a different type of thing,
a list of dicts...not two arrays.

We can also import Pandas to stuff results into for all three of the above (so they're consistent outputs, we could save to excel, etc).
If we have Pandas loaded,
we could use an empty dataframe for iteration,
so one more option:

    import numpy as np
    import pandas as pd
    years = 10
    prem = 50
    wit = 5
    df = pd.DataFrame(data={'bom': np.zeros(years*12), 'eom': np.zeros(years*12)})
    for i, row in df.iterrows():
        if i > 0:
            row.bom = df.loc[i-1, 'eom']
            row.eom = row.bom - wit

With all of those types of iteration,
and with the the option to return a dataframe as the result,
this is what we get:

<style>td, th { padding-left: 15px; }</style>

| vectorized   | return_type   | iterate_type   |        time |   slowdown |
|:-------------|:--------------|:---------------|------------:|-----------:|
| True         | native        | --             |   0.0626053 |          1 |
| False        | native        | numpy          |   1.58186   |         25 |
| False        | native        | dict           |   0.928074  |         14 |
| True         | pandas        | --             |   3.17171   |         50 |
| False        | pandas        | numpy          |   4.43196   |         70 |
| False        | pandas        | dict           | 148.113     |       2365 |
| False        | pandas        | pandas         |   6.42774   |        102 |