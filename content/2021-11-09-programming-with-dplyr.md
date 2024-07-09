Title: Programming with dplyr
Author: Andy Reagan
Category: Programming
Tags: R, dplyr
Date: 2021-11-09

This post is [published on Medium](https://towardsdatascience.com/programming-with-dplyr-a8161c03d947) and available as an [Rmd notebook](https://gist.github.com/andyreagan/2a24f30a28ded04fef83d7abb0815f70).

With `dplyr` version 1.0, there are new ways that you can write functions.
The [programming with dplyr](https://dplyr.tidyverse.org/articles/programming.html) vignette with the docs is the best reference.

If you're familiar with using `sym` and converting from standard to nonstandard form,
the following progression may be useful.
If you’re familiar with using `sym` and converting from standard to nonstandard form, the following progression should show you how to replace (and extend) your code.
It should be mostly find-replace!
If you have a function that takes a character vector and uses an `_at` verb, see the difference between the corresponding old option
(here, option 1 with `_at` )
and see how this is changed for the "Super version" at the bottom.

## Old option 1: use `*_at` verbs

This is the old way of writing a dplyr function:

```r
max_by_at <- function(data, var, by="") {
  data %>%
    group_by_at(by) %>%
    summarise_at(var, max, na.rm = TRUE)
}
```

Let's try it out:

```r
starwars %>% max_by_at("height", by="gender")
starwars %>% max_by_at(c("height", "mass"), by="gender")
starwars %>% max_by_at(c("height", "mass"), by=c("sex", "gender"))
```

That worked great, but it won't work for env variables:

```r
testthat::expect_error(starwars %>% max_by_at(height, by=gender))
testthat::expect_error(starwars %>% max_by_at("height", by=gender))
testthat::expect_error(starwars %>% max_by_at(height, by="gender"))
```

## Old(ish) option 2: use `across`

This works for characters and character vectors, but not for env variables.
Using `across` is a replacement for using `*_at`, and it has the same functionality:

```r
max_by_across <- function(data, var, by="") {
  data %>%
    group_by(across(by)) %>%
    summarise(across(var, max, na.rm = TRUE), .groups='keep')
}
```

```r
starwars %>% max_by_across("height", by="gender")
starwars %>% max_by_across(c("height", "mass"), by="gender")
starwars %>% max_by_across(c("height", "mass"), by=c("sex", "gender"))
```

```r
testthat::expect_error(starwars %>% max_by_across(height, by=gender))
testthat::expect_error(starwars %>% max_by_across("height", by=gender))
testthat::expect_error(starwars %>% max_by_across(height, by="gender"))
```

## Old option 3: Convert from character to env var by `sym`

```r
max_by_1 <- function(data, var, by="") {
  data %>%
    group_by(!!sym(by)) %>%
    summarise(maximum = max(!!sym(var), na.rm = TRUE))
}
```

It doesn't work for passing in env variables:

```r
testthat::expect_error(starwars %>% max_by_1(height))
testthat::expect_error(starwars %>% max_by_1(height, by=gender))
```

It does work for strings:

```r
starwars %>% max_by_1("height")
starwars %>% max_by_1("height", by="gender")
```

But, it doesn't work for lists (so, it's less general than `across`):

```r
testthat::expect_error(starwars %>% max_by_1(c("height", "weight")))
testthat::expect_error(starwars %>% max_by_1("height", by=c("gender", "sex")))
```

# Better with braces

Check out this improved version!

It works for env vars,
so we can use it like a dplyr function with non standard eval,
as well as pass in `sym` variables.

```r
max_by_2 <- function(data, var, by) {
  data %>%
    group_by({{ by }}) %>%
    summarise(maximum = max({{ var }}, na.rm = TRUE))
}
```

It does work for env variables!

Which is pretty cool:

```r
starwars %>% max_by_2(height)
starwars %>% max_by_2(height, by=gender)
```

It does not work for strings out of the box:

```r
starwars %>% max_by_2("height")
starwars %>% max_by_2("height", by="gender")
```

We can work around this with `sym`:

```r
starwars %>% max_by_2(!!sym("height"))
```

It does not work for lists of env vars:

```r
starwars %>% max_by_2(c(height, mass))
testthat::expect_error(starwars %>% max_by_2(height, by=c(gender, sex)))
```

# Super version

We'll use `across()` to allow strings, lists of env vars, and even lists of strings.
The default for `by=()` becomes an empty list and we simple wrap the `{{}}` with `across()`:

```r
max_by_3 <- function(data, var, by=c()) {
  data %>%
    group_by(across({{ by }})) %>%
    summarise(across({{ var }}, max, .names = "max_{.col}", na.rm = TRUE), .groups='keep')
}
```

It works for env variables:

```r
starwars %>% max_by_3(height)
starwars %>% max_by_3(height, by=gender)
```

It works for strings:

```r
starwars %>% max_by_3("height")
starwars %>% max_by_3("height", by="gender")
```

It works for lists of env variables:

```r
starwars %>% max_by_3(c(height, mass))
starwars %>% max_by_3(height, by=c(gender, sex))
starwars %>% max_by_3(c(height, mass), by=c(gender, sex))
```

It works for character lists:

```r
starwars %>% max_by_3(c("height", "mass"))
starwars %>% max_by_3("height", by=c(gender, sex))
starwars %>% max_by_3(c("height", "mass"), by=c("gender", "sex"))
```

Now you've seen how to write some very flexible functions using the new powers of dplyr programming.
Enjoy!
