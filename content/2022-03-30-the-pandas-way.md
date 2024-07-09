Title: The “Pandas Way” is the functional API
Author: Andy Reagan
Category: Programming
Tags: python, pandas
Date: 2022-03-30

With Pandas ≥ 1.0, the functional API is powerful and should be the new standard.

Someone just pointed me to the `pyjanitor` package, which I don't actually think is very useful with [Pandas >= 1.0](https://pandas.pydata.org/pandas-docs/version/1.0.0/whatsnew/v1.0.0.html), because the functional API for Pandas is quite powerful these days. The examples that the `pyjanitor` developers give [on their README are helpful](https://github.com/pyjanitor-devs/pyjanitor). First, they show "standard" Pandas code, which I'd argue shouldn't be the standard anymore.

However, this is no longer the The Pandas Way, this is the The OLD Pandas Way:

```python
# The Pandas Way
# 1. Create a pandas DataFrame from the company_sales dictionary
df = pd.DataFrame.from_dict(company_sales)

# 2. Delete a column from the DataFrame. Say 'Company1'
del df['Company1']

# 3. Drop rows that have empty values in columns 'Company2' and 'Company3'
df = df.dropna(subset=['Company2', 'Company3'])

# 4. Rename 'Company2' to 'Amazon' and 'Company3' to 'Facebook'
df = df.rename(
    {
        'Company2': 'Amazon',
        'Company3': 'Facebook',
    },
    axis=1,
)

# 5. Let's add some data for another company. Say 'Google'
df['Google'] = [450.0, 550.0, 800.0]
```

Then they note that “Slightly more advanced users might take advantage of the functional API” like this, but with the power of the functional API, this should now be the The Pandas Way:

```python
df = (
    pd.DataFrame(company_sales)
    .drop(columns="Company1")
    .dropna(subset=['Company2', 'Company3'])
    .rename(columns={"Company2": "Amazon", "Company3": "Facebook"})
    .assign(Google=[450.0, 550.0, 800.0])
)
```

and that’s great! The above should be the standard for writing Pandas code.

I would avoid using pyjanitor, which gives you this:

```python
df = (
    pd.DataFrame.from_dict(company_sales)
    .remove_columns(['Company1'])
    .dropna(subset=['Company2', 'Company3'])
    .rename_column('Company2', 'Amazon')
    .rename_column('Company3', 'Facebook')
    .add_column('Google', [450.0, 550.0, 800.0])
)
```

because (1) it’s not any more readable, IMO, and (2) breaks from the pandas API (which has direct parallels on cuDF, polars, etc) to make your code less portable. But if pyjanitor helps you, then don’t let me dissuade you entirely!

