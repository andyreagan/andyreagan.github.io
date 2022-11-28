Title: Should I set metadata manually in pyspark?
Date: 2017-05-04
Author: Andy Reagan
Category: Programming
Tags: python, pyspark

Well, let’s do a simple test and find out if it speeds up the process of one-hot encoding a variable in our data. There are other reasons to set it, and we’ll get to those. Starting with the very helpful code snippet from [spark-gotchas](https://github.com/awesome-spark/spark-gotchas/blob/master/06_data_preparation.md):

```
import json

from pyspark import SparkContext
from pyspark.sql import Column
from pyspark.sql.functions import col

def withMeta(self, alias, meta):
    sc = SparkContext._active_spark_context
    jmeta = sc._gateway.jvm.org.apache.spark.sql.types.Metadata
    return Column(getattr(self._jc, "as")(alias, jmeta.fromJson(json.dumps(meta))))

Column.withMeta = withMeta


meta = {"ml_attr": {"name": "label_with_meta",
  "type": "nominal",
  "vals": ["0.0", "1.0", "2.0"]}}


df_with_meta = df.withColumn("label_with_meta", col("label").withMeta("", meta))
df_with_meta.schema[-1].metadata == meta

## True
```

First, I will write functions to do a one hot encoding with and without metadata. Without metadata:

```
def testWithoutMetadata(df):
    OHEncoder = OneHotEncoder(inputCol="label",
                              outputCol="label_OH")

    df_transformed = OHEncoder.transform(df)
```

And with metadata:

```
def testMetadata(df):
    meta = {"ml_attr": {"name": "label_with_meta",
      "type": "nominal",
      "vals": ["0","1","2"]}}
    OHEncoderMeta = OneHotEncoder(inputCol="label_with_meta",
                                  outputCol="label_OH_with_meta")

    df_with_meta = df.withColumn("label_with_meta",
                                 col("label").withMeta("", meta))
    df_with_meta_transformed = OHEncoderMeta.transform(df_with_meta)
```

You can see how in the above, I used the withMeta function from above.
Now, the tests:

```
%%timeit -n 5 -r 5
size = 100000
df = spark.createDataFrame(list(zip(map(int,np.arange(size)),map(int,np.random.randint(0,3,size)))),["id", "label"])
testWithoutMetadata(df)
```

and

```
%%timeit -n 5 -r 5
size = 100000
df = spark.createDataFrame(list(zip(map(int,np.arange(size)),map(int,np.random.randint(0,3,size)))),["id", "label"])
testMetadata(df)
```

The speed difference for 100,000 data points: 4.66s to 4.16s. A half second speedup on a single executor. In essence, this amounts to how long it too spark to look up the range on the column for which we didn’t provide metadata (check the scala). Was it worth it? Probably not.

Onward!

Final note — there are still likely to be cases where the metadata is useful to spark, such as:
1. Avoiding using a stringIndexer, which is quite a bit slower than the one-hot encoder.
2. Providing the variable type to a classification method such as a Random Forest, which can take advantage of variable types.
3. Doing a one-hot encoding where the full range of values is not included in the training set. You can pass the known full range in as metadata, and your pipeline will reflect this.
