Title: How to groupby in Pandas with a missing group
Date: 2018-04-25
Author: Andy Reagan
Category: Programming
Tags: python, pandas

This is a note intended for my future self.
Here’s how to do it:

1. Have a list of the values that you expect for each group.
2. Iterate over that list, and look up the values using `.loc`.

Say I want to group by months, but not all of the months will have data.
Here I’ll iterate over the known month range, and fill in as I go.
Starting with a DataFrame contain the columns BP_ID, CAL_YR, CAL_MO, and COMM_AMT_FYC (with potentially many records (or 0!) per month), we do this:

```python
start = date(2016,1,1)
d = start
month = []
case_count = []
fyc = []
while d < date.today():
    month.append(d)
    month_data = group.loc[(group.CAL_YR == d.year) & (group.CAL_MO == d.month), :]
    case_count.append(month_data.shape[0])
    fyc.append(month_data.COMM_AMT_FYC.sum())
    d = date(d.year+int(np.floor(d.month/12)),((d.month) % 12)+1,1)
g = pd.DataFrame({"BP_ID": name, "month": month, "case_count": case_count, "fyc": fyc}))
```

It seems inefficient, but it should get the job done.
It takes about half a second to do for the small dataframes I’m working with.
In other words, I’ll do 57K of these in 30min.

[This post on Medium](https://medium.com/@andyreagan/how-to-groupby-in-pandas-with-a-missing-group-655b20d7826f)
