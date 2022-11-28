Title: Logic as Data
Author: Andy Reagan
Date: 2021-11-19
Status: draft

We’ve all been there: trying to understand how a 40-line CASE statement encodes some particular business logic. At MassMutual, particular combinations of gender, policy issue year, issue month, rate series, product name, line of business, basis code, and more can determine the possible number of underwriting classes that a policy had available at the time of issue. Suffer no more.

I’m here to tell you that every CASE statement can be written as a join, and the logic replaced by an adjoining data set. Simple enough, sure, but this idea has *legs*. By the end of this post, you’ll be eagerly refactoring that hairy data pipeline that keeps the engineering team up at night.

Let’s take a tractable example to start:

    SELECT a, b, CASE WHEN a = 1 THEN 0
    WHEN a = 1 AND b = 0 THEN -1
    WHEN a = 0 THEN 2
    WHEN a = 5 and b = 1 THEN 4
    ELSE 11 END AS c
    FROM my_table

Not too crazy but there are a number of problems. Can you email this query to the sales team to check that it is correct? Which statements got applied to which rows of data?

Here’s how we can refactor this code:

    SELECT x.a, x.b, y.c, y.rule_no
    FROM my_table x
    LEFT OUTER JOIN my_logic y ON x.a = y.a AND x.b = y.b

Instead of the CASE statement, we have join to:

| rule_no | a | b | c |
| — | — | — | — |
| 1            | 1  | * | 0 |
| 2 | 1 | 0 | -1 |
| 3 | 0 | * | 2 |
| 4 | 5 | 1 | 4 |
| 5 | * | * | 11 |

The first thing you might notice, now, is that rules 1 and 2 overlap! In the CASE statement, we would never had hit the second statement.

A key simplification in the above is the glob operator: `*`. I used it to represent all possible values, condensing the logic to it’s essential form (as it was effectively collapsed in the CASE statement). There are a number of ways to deal with glob in operation, and I’ll discuss two.

First, you can use a database or data tool that support the join on all possible values! This is available in some R packages.

The other option is to examine the data in `my_table` and expand the logic table to cover all of the joins. This is easier that you might at first think. Here’s how you could take a logic table with globs and expand it, column by column in Python:

    def expand_logic(
        logic: pd.DataFrame, data: pd.DataFrame, save_intermediate_results: bool = False
    ) -> pd.DataFrame:
        '''logic: dataframe with first column as an index `rule_no`, last column as output
        expands to all possible combinations of individual column values for the globs,
        then shrinks to only the combinations that exist.'''
        logic_expanded = deepcopy(logic)
        logic_cols = logic.columns[1:-1]
        for col in logic_cols:
            expanded_values = pd.DataFrame(
                [
                    {"expanded": d, col: "*"}
                    for d in data.groupby(col, dropna=False)[data.columns[0]]
                    .agg("count")
                    .index
                ]
            )
            print(expanded_values)
            logic_expanded = logic_expanded.merge(expanded_values, how="left", on=[col])
            logic_expanded[col] = logic_expanded.expanded.combine_first(logic_expanded[col])
            logic_expanded = logic_expanded.iloc[:, :-1]

        logic_expanded.replace("*", np.nan, inplace=True)
        # save initial # of dupes to disk
        # logic_expanded.loc[logic_expanded.duplicated([logic_cols, keep=False), :].to_csv('logic_dupes.csv')
        # logic_expanded.sort_values(logic_cols).loc[logic_expanded.duplicated(logic_cols, keep=False), :].to_csv('logic_dupes_sorted.csv')

        # convert to floats
        logic_expanded.loc[
            :, logic_cols
        ] = logic_expanded[logic_cols].astype(
            "float"
        )
        # drop explicit duplicates
        logic_expanded_nodupes = logic_expanded.loc[
            ~logic_expanded.duplicated(
                logic_cols,
                keep="first",
            ),
            :,
        ]
        # drop any rows that don't actually occur in the data
        logic_expanded_nodupes_exists = logic_expanded_nodupes.merge(
            data.loc[
                :, logic_cols
            ].drop_duplicates(),
            how="inner",
            on=logic_cols,
        )

        assert logic_expanded_nodupes_exists.outcome_rule.isna().sum() == 0

        if save_intermediate_results:
            logic_expanded.to_csv("logic-expanded.csv")
            logic_expanded_nodupes.to_csv("logic-expanded-nodupes.csv")
            logic_expanded_nodupes_exists.to_csv("logic-expanded-nodupes-exists.csv")

        return logic_expanded_nodupes_exists


You could do the same thing in R:

    expand_logic <- function(logic, data, save_intermediate_results=F) {
        logic_expanded = logic
        logic_cols = colnames(logic)[2:(length(colnames(logic))-2)]
        for (col in logic_cols) {
            expanded_values = data %>%
                distinct(!!sym(col)) %>%
                mutate(expanded=!!sym(col), !!sym(col):='*')
            print(expanded_values)
            logic_expanded = logic_expanded %>%
                left_join(expanded_values, by=col) %>%
                mutate(!!sym(col):=ifelse(!!sym(col)=="*", as.character(expanded), !!sym(col))) %>%
                select(-expanded)
        }

        # save initial # of dupes to disk
        # logic_expanded %>% group_by(logic_cols) %>% mutate(dup_count=n()) %>% ungroup() %>% filter(dup_count > 1) %>% readr::write_csv('logic_dupes.csv')
        # logic_expanded %>% arrange(logic_cols) %>% group_by(gate, bmi, smoker, outputScore, liteTouchOutputScore) %>% mutate(dup_count=n()) %>% ungroup() %>% filter(dup_count > 1) %>% readr::write_csv('logic_dupes_sorted.csv')

        # convert to floats
        logic_expanded = logic_expanded %>% mutate_at(logic_cols, as.numeric)
        # drop explicit duplicates
        logic_expanded_nodupes = logic_expanded %>%
            group_by_at(logic_cols) %>%
            slice(1)
            # mutate(rank = rank(gate, ties.method= "random")) %>%
            # ungroup() %>%
            # filter(rank==1) %>%
            # select(-rank)
        # drop any rows that don't actually occur in the data
        logic_expanded_nodupes_exists = logic_expanded_nodupes %>% inner_join(
            data %>%
                distinct(logic_cols),
            by=logic_cols
        )

        testthat::expect_equal(sum(is.na(pull(logic_expanded_nodupes_exists, outcome_rule))), 0)

        if (save_intermediate_results) {
            logic_expanded %>% readr::write_csv("logic-expanded.csv")
            logic_expanded_nodupes %>% readr::write_csv("logic-expanded-nodupes.csv")
            logic_expanded_nodupes_exists %>% readr::write_csv("logic-expanded-nodupes-exists.csv")
        }

        return(logic_expanded_nodupes_exists)
    }


I’ll leave you with those examples. Happy refactoring!