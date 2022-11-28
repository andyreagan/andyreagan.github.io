Title: Make every for-loop parallel in Julia
Date: 2015-07-20
Author: Andy Reagan
Category: Programming
Tags: julia

If reading the [documentation](http://julia.readthedocs.org/) is confusing, making any for-loop into a parallel loop is rediculously easy.
Just add the parallel macro!
If it's code that needs to execute before moving on, just pass an operator to to macro.

```julia
# non-parallel loop
for i=1:100
	println(i)
    j = my_array[i]
	some_function(j)
end
```

and this becomes

```julia
# parallel loop
@parallel for i=1:100
	println(i)
    j = my_array[i]
	some_function(j)
end
```
, you're done!
If you find that the code moves on too quickly, just add an operator to force it to wait:

```julia
# parallel loop
my_zero_result = @parallel (+) for i=1:100
	println(i)
    j = my_array[i]
	some_function(j)
	0
end
```

Julia!
