Title: Great Expectations of Vertica
Author: Andy Reagan
Category: Programming
Tags: python, data engineering, vertica
Date: 2020-05-29

Great Expectations is a useful tool in any data pipeline to ensure that data is what you expect.
While data validation and such have been compared to Data Science's "janitorial work",
others argue that it's really part of the analysis.
Either way,
I've had enough headaches with analysis being wrong and pipelines breaking downstream that
checking data at the source for some basic consistency is worth it.
The team at GE [has tutorials for file backend and for postgres](https://github.com/superconductive/ge_tutorials),
so let's try with Vertica via sqlalchemy.

Now, first run Vertica:

```bash
docker run -p 5433:5433 -e DATABASE_PASSWORD='foo123' jbfavre/vertica:9.2.0-7_debian-8
```

Confirm that you can connect to it:

```bash
echo "select 'hello';" | vsql -p 5433 -h localhost -U dbadmin -d docker -w foo123
```

Now, GE uses Sqlachemy, so let's get a valid connection string using [sqlachemy-vertica-python](https://github.com/bluelabsio/sqlalchemy-vertica-python/).
First, here's how to do the installs in your global Python (no virtualenv) as installed via the OSX installer (as a "Framework"):

```bash
/Library/Frameworks/Python.framework/Versions/3.8/bin/python3.8 -m pip install -U pip
/Library/Frameworks/Python.framework/Versions/3.8/bin/python3.8 -m pip install great_expectations sqlalchemy sqlalchemy-vertica-python vertica-python pandas ipython
```

I use ipython, so you can use it to test the connection. Test it, in ipython:

```bash
# /Library/Frameworks/Python.framework/Versions/3.8/bin/ipython
import sqlalchemy as sa
engine = sa.create_engine('vertica+vertica_python://dbadmin:foo123@localhost:5433/docker')
engine.connect()
```

Go ahead and load the example file from GE's tutorial to the database,
this may be the hardest part.
There is code here to load the NPI data file from an older version of the tutorial,
and the currently uncommented code below works for [the most recent tutorial](https://github.com/superconductive/ge_tutorials).

```python
import pandas as pd
import vertica_python
from math import floor

# older one:
# df = pd.read_csv("data/npidata_pfile_20200511-20200517.csv")
# newest:
dtypes = {
    'vendor_id': 'str',
    'rate_code_id': 'str',
    'store_and_fwd_flag': 'str',
    'payment_type': 'str'
}
df = pd.read_csv("data/yellow_tripdata_sample_2019-01.csv", dtype=dtypes)

def vertica_to_pandas_dtype(dtype_string, column_name, d):
    '''Parse pandas data types and convert to valid Vertica data types.'''
    if 'float' in str(dtype_string) or 'int' in str(dtype_string):
        return 'numeric'
    elif 'date' in str(column_name):
        return 'datetime'
    else:
        return 'varchar({0})'.format(int(floor(d[column_name].str.len().max()*1.5)))

columns_with_types = {col: vertica_to_pandas_dtype(dtype, col, df) for col, dtype in zip(df.columns, df.dtypes)}
column_name_listing = ','.join(columns_with_types.keys())
column_with_dtype_listing = ','.join(['{0} {1}'.format(k, v) for k, v in columns_with_types.items()])

conn_info = {'host': '127.0.0.1',
    'user': 'dbadmin',
    'password': 'foo123',
    'database': 'docker',
    'use_prepared_statements': False,
}

with vertica_python.connect(**conn_info) as connection:
    cur = connection.cursor()
    # older table
    # cur.execute('CREATE TABLE npidata_pfile_20200511_20200517 ({0});'.format(column_with_dtype_listing))
    # yellowcab table:
    cur.execute('CREATE TABLE if not exists yellow_tripdata_sample_2019_01 ({0});'.format(column_with_dtype_listing))
    # copy the schema to a second table (so many ways to do this, just one)
    cur.execute('SELECT * INTO yellow_tripdata_staging FROM (select * from yellow_tripdata_sample_2019_01 limit 10) x;')
    # we could have limited to 0 rows, but let's truncate those 10 instead
    cur.execute('TRUNCATE TABLE yellow_tripdata_staging;')
    cur.execute("commit;")
    # with open("data/yellow_tripdata_sample_2019-01.csv", "rb") as f:
    #     cur.copy("COPY yellow_tripdata_sample_2019_01 ({0}) from stdin DELIMITER ',' ".format(column_name_listing),  f)
    cur.execute("COPY yellow_tripdata_sample_2019_01 ({0}) from LOCAL '{1}' DELIMITER ',' ".format(column_name_listing, "data/yellow_tripdata_sample_2019-01.csv"))
    cur.execute("COPY yellow_tripdata_staging ({0}) from LOCAL '{1}' DELIMITER ',' ".format(column_name_listing, "data/yellow_tripdata_sample_2019-02.csv"))

# spot check that the data looks okay in the database
with vertica_python.connect(**conn_info) as connection:
    cur = connection.cursor()
    cur.execute('select count(*) from yellow_tripdata_sample_2019_01;')
    print(cur.fetchall())
    cur.execute('select count(*) from yellow_tripdata_staging;')
    print(cur.fetchall())
    cur.execute('select * from yellow_tripdata_sample_2019_01 limit 1;')
    print(cur.fetchall())
    cur.execute('select * from yellow_tripdata_staging limit 1;')
    print(cur.fetchall())
```

Now we can run through the GE tutorial, using a database.
You have the connection string above, so you'll chose the database option, (the "other", it might still be option 6),
and create the sample expectations of this table.
