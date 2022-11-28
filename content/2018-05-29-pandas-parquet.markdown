Title: Tricks for coercing Pandas into parquet
Author: Andy Reagan
Date: 2018-05-29
Category: Programming
Tags: python, pandas

For coercing pandas date times (stored as numpy datetime):

```python
for col in df.columns[df.dtypes == np.dtype('<M8[ns]')]:
    # https://stackoverflow.com/questions/32827169/python-reduce-precision-pandas-timestamp-dataframe
    # apply(lambda x: x.replace(microsecond=0))
    df[col] = df[col].values.astype('datetime64[s]')
```

For coercing python datetime (here, a datetime.date, there may be other options with datetime.datetime (I’ve included my failed attempts that may work there as comments)):

```python
# df.date.values.to_timestamp()
# pd.Timestamp(df.date)
# df.date.values.astype(np.int64)
# df.loc[~df.date.isnull(),'date'].values.astype(np.int64)
# df.date.values[0].timestamp()
# pd.Timestamp(df.date.values[0],unit='s')
# pd.Timestamp(df.date.values[0].timestamp(),unit='s')
# df.date.values[0].isoformat()
# df.date.apply(lambda x: x.isoformat())
df['date'] = df.loc[~df.date.isnull(),'date'].apply(lambda x: x.isoformat())
```

For timedeltas in pandas, `timedelta64[ns]`:

```python
df["timedelta_days"] = df.timedelta.dt.days
```

For mixed float and string, encoded as pandas `object` type and `np.nan` for nulls (this throws error):

```python
df.loc[~df.col.apply(isfloat),"col"] = np.nan
```

You need these two, inefficient helpers:

```python
def isint(x):
    try:
        int(x)
        return True
    except:
        return False
def isfloat(x):
    try:
        float(x)
        return True
    except:
        return False
```

When things come in with bytes type, and you get a memoryview error, hit your dataframe with this:

```python
def stringify_df(df: pd.DataFrame):
    for col in df.columns:
        if df[col].dtype == "O":
            if type(df[col].values[0]) == memoryview:
                df.loc[~df[col].isnull(), [col]] = df.loc[~df[col].isnull(),:].apply(lambda x: x[col].tobytes().decode("ascii", "ignore"), axis=1)
            else:
                df.loc[~df[col].isnull(), [col]] = df.loc[~df[col].isnull(),:].apply(lambda x: x[col].encode("ascii", "ignore").decode("ascii", "ignore"), axis=1)
    return df
```
