Title: Non-SQL in your DBT pipeline
Author: Andy Reagan
Category: Programming
Tags: python, dbt
Date: 2022-03-31

DBT forces you to use SQL, even when Python or R transformations are clearer.

DBT makes a lot of sense for 80% of data pipelines, but there are steps that it just isn’t worth forcing into SQL (even when that is possible!). If the code is simpler and easier to understand in a more extensible programming language (e.g., R or Python), then the code should stay there. While DBT forces good practices for keeping pipelines in SQL most of the time, this can be an anti-pattern when we add complexity just to stay in SQL-land.

Many Google searches later, and I found Claire Carroll lays out the scenario very clearly in her post on the DBT forum [Representing non-SQL models in a dbt DAG](https://discourse.getdbt.com/t/representing-non-sql-models-in-a-dbt-dag/2083):

> Sometimes, there’s a table in your DAG that might be created via a non-SQL process, and it would be useful for your dbt project to “know” about it. For example, let’s say you have a table, `customers_predicted_ltvs`, with one record per `customer_id`:
>
> |  customer_id  |  predicted_ltv  |
> |:--------------|-----------------|
> | 1             | 120             |
> | 2             | 115             |
> | ...           | ...             |
>
> This table of estimates is created by a machine learning model, and uses transformations which can’t be done in SQL — we’re going to call it a non-SQL model. The non-SQL model uses some dbt models as inputs. Further, you want to use the output of this non-SQL model in other dbt models.

She is not the first person to ask the [this question](https://stackoverflow.com/questions/63419289/how-to-use-python-dependency-injection-or-hooks-with-dbt), and she proposes a useful answer, to “hack” the model into the pipeline with an ephemeral model:

```
{{ config(materialized='ephemeral') }}
/*
This table is created by a non-SQL process (you should probably add more info IRL),
which selects from the following dbt models:
{{ ref('customers') }}
{{ ref('orders') }}
*/
select * from my_schema.customers_predicted_ltv
```

I’ll add that you can make this more generic by dynamically populating the table and schema names:

```
{{ config(materialized='ephemeral') }}
select * {{ target.schema }}.{{ model.name }}
```

And this is what we’re left with. You don’t _need_ this hacked-in node if you just run the pipeline up to this point, and then after it (splitting it in two), but this placeholder does allow you build the full DAG picture. Even with this in place, you’ll still need to run your pipeline in two steps anyway. First, everything up to this model, then you external process, then everything after it:

```
dbt run +customers_predicted_ltv
python my_process.py
Rscript my_process.R
dbt run customers_predicted_ltv+

```

One tool sounds promising, called [fal](https://github.com/fal-ai/fal), ̶b̶u̶t̶ ̶f̶o̶r̶ ̶n̶o̶w̶ ̶t̶h̶i̶s̶ ̶o̶n̶l̶y̶ ̶a̶l̶l̶o̶w̶s̶ ̶y̶o̶u̶ ̶t̶o̶ ̶r̶u̶n̶ ̶s̶c̶r̶i̶p̶t̶s̶ ̶b̶e̶f̶o̶r̶e̶ ̶o̶r̶ ̶a̶f̶t̶e̶r̶ ̶y̶o̶u̶r̶ ̶D̶A̶G̶,̶ ̶n̶o̶t̶ ̶i̶n̶ ̶t̶h̶e̶ ̶m̶i̶d̶d̶l̶e̶ as I published this, the fal team released just such a feature: [check it out](https://blog.fal.ai/python-or-sql-why-not-both/). I also found a tool called [Continual](https://medium.com/@jordan_volz/add-machine-learning-to-your-dbt-workflows-with-continual-27f609c7c76d), which looks similar to `fal`, with somewhat less documentation.

<style>
table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
}

th,
td {
    padding: 12px 15px;
}

tbody tr.active-row {
    font-weight: bold;
    color: #009879;
}
tbody tr {
    border-bottom: 1px solid #dddddd;
}

tbody tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

tbody tr:last-of-type {
    border-bottom: 2px solid #009879;
}
</style>