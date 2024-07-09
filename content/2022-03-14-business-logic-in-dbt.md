Title: Business logic in DBT
Author: Andy Reagan
Category: Programming
Tags: python, dbt
Date: 2022-03-14

There are many possibilities for implementing custom logic, and this framework can help you sort through the options.

I have been really enjoying using the [DBT](https://www.getdbt.com/) to structure data pipelines,
the framework it enforces requires you to structure your pipelines in a standardized way.
The tool meets perfectly in the middle of data engineering and data science,
where it provides a way for dynamic coding for the former and constrains the latter.
As a data scientist,
I have spent years dynamically generating complex SQL code from running python processes,
inside and outside of data pipelines.
Templates are a second nature for this free-flowing data science work,
and DBT exposes this tooling for data engineers alongside a structure that works for most pipelines.

The meat of data engineering is business logic:
transformations that,
in themselves,
contain crucial information to unlock the data.
For our examples here,
let’s recode a `state` column to a `region` in the US:
one of the four [Census Bereau Designated Regions](https://en.wikipedia.org/wiki/List_of_regions_of_the_United_States#Census_Bureau-designated_regions_and_divisions) of
northeast, south, midwest, and west.
To help us decide between the various options for structuring this pipeline,
let’s lay out what we care about:

1. Human readability: we should be able understand the logic and see where the values are coming from.
2. Flexbility: we want to be ready for changes in this mappings, e.g. a new state joins the US or an existing state switches regions.
3. Machine readability and DRY: this logic should be interpretable by a program, such that we don’t need to repeat hard-coded values.

## Option 1: leave your business logic hard-coded in SQL

This is less than ideal for all of the reasons,
but it’s likely a starting point.
It might look like this:

```sql
SELECT 
    state,
    CASE 
        WHEN state IN ('CT', 'ME', ...) THEN 'Northeast'
        WHEN state IN ('IL', 'IN', ...) THEN 'Midwest'
        ...
        ELSE NULL 
        END AS region
FROM 
    {{ ref('my_table') }}
```

You could only code three of the regions,
letting the `ELSE` statement catch the fourth region.
We’ll code all four:
explicit beats implicit.
With this hard-coded logic,
every change requires a code change.
If your logic isn’t hard-coded in SQL already,
shoot for option 2 or 3.
Let’s not belabor this method,
and move forward to solutions that better on each point.

## Option 2: put that logic in a table, and use a JOIN to execute it

Here’s an idea that I can get behind.
Your code is your code:
it creates the region column from the state column.
If the exact mapping changes,
the data needs to be update,
but not your code!
This data can be managed in many different ways,
and even by a business stakeholder or downstream user.
To be concrete,
here’s what this would look like:

```sql
SELECT state,
        lookup.region
  FROM {{ ref('my_table') }}
  JOIN {{ source('fact_schema', 'lookup_table') }} lookup
        USING(state)
```

This works well with our goals, and now we need a way store the logic itself.
I see three options:

### Option 2(a): use a DBT seed csv

Seeds in dbt are csv files that dbt loads into the database, to be used downstream.
This keeps the csv files in version control, and it’s a cool feature for this use case.
This is really the intended use of the seed functionality within dbt,
and I agree with their advice [in the documentation](https://docs.getdbt.com/docs/building-a-dbt-project/seeds):

> Seeds are CSV files in your dbt project (typically in your seeds directory), that dbt can load into your data warehouse using the dbt seed command.
>
> Seeds can be referenced in downstream models the same way as referencing models — by using the ref function.
>
> Because these CSV files are located in your dbt repository, they are version controlled and code reviewable. Seeds are best suited to static data which changes infrequently.
>
> Good use-cases for seeds:
>
> - A list of mappings of country codes to country names
> - A list of test emails to exclude from analysis
> - A list of employee account IDs

## Option 2(b): store it in a SQL file as a series of `INSERT`s

This option stinks,
so I won’t say much more. T
o be clear, what I mean is writing a `.sql` file that inserts the data directly into the table.
You could do this within dbt,
and here’s a hacky version to illustrate the idea as `lookup_table.sql`:

```sql
WITH data as (
SELECT 'CT' as state, 'Northeast' as region
UNION
SELECT 'ME' as state, 'Northeast' as region
UNION
SELECT 'IL' as state, 'Midwest' as region
UNION
SELECT 'IN' as state, 'Midwest' as region
)
SELECT state, region
FROM data
```

## Option 2(c): store in python/R and push directly to the database

The main problem here is that you’re breaking your project into two parts:
the pre-dbt step and dbt step.
While there are cases that this makes sense, we can easily accomplish this step within dbt,
so let’s not pursue this option.

## Option 3: use a DBT variable in a dynamic query

In `dbt_project.yml` you can define [variables](https://docs.getdbt.com/reference/dbt-jinja-functions/var),
and then [use those in queries](https://docs.getdbt.com/docs/building-a-dbt-project/jinja-macros).
We can store our data in the yaml as a variable like:

```json
vars:
  state_lookup:
    Northeast:
      - CT
      - ME
    Midwest:
      - IL
      - IN
```

Then we would have our SQL being generated dynamically as

```sql
SELECT state,
        CASE {% for k, v in var("state_lookup").items() %}
            WHEN state in ({% for t in v %}'{{ t }}'{% if not loop.last %}, {% endif %}{% endfor %}) THEN {{ k }}{% endfor %}
            ELSE NULL END AS region
  FROM {{ ref('my_table') }}
```

The middle part here is just building a comma-separated list,
and writing a function for that would make it look nicer.
Let’s just see that quickly with a csl filter (comma-separated-list):

```sql
SELECT state,
        CASE {% for k, v in var("state_lookup").items() %}
            WHEN state in ({{ t|csl }}) THEN {{ k }}{% endfor %}
            ELSE NULL END AS region
  FROM {{ ref('my_table') }}
```

This is readable by both human and machine (yay for yaml!),
and it’s flexible,
making this my favorite of any choice so far. May your data pipelines be clear, and your pager alerts be few!