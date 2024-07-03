Title: Functional Threshold Work Rate
Author: Andy Reagan
Date: 2024-07-03
Tags: sweat science

> Functional Threshold Work Rate (kcal/kg/h): The maximum Calorie output an athlete can achieve in 1 hour per kilogram of body weight.

You've got inputs and outputs,
some of which are measurable and some aren't.
Tools like indirect calorimeters use input/output gas exchange
to measure the human body's processes,
while a direct calorimeter simply measures heat.

Cyclists use power output.
It's easy to measure (these days)
and efficiency doesn't seem to vary much with training,
so this is a decent measure of input too.
FTP is in W/kg.
Since kJ of output is just power and time (a Joule is a Watt·Second),
we combine two fun facts to know that kJ of output is roughly the same as kcal of input.
First, 
  1 kJ = 4.184 kcal
.
Second, humans are about 25% efficient at taking the input calories to output work, and these two cancel!
To this end,
  FTWR = (W/kg) * 3600/1000/4.184
first converting W into J by multiplying by an hour of seconds,
converting the J to kJ,
then convering those kJ into kcal by dividing by the conversion.
Altogether,
  FTWR = FTP * .86 kcal/W/h
.

Runners use pace.
Most apps or fitness trackers (garmin, etc)
will use the available data
to estimate Calories burned (capital C means kcal).
These take into account pace, gradient, and body weight (but not [efficiency](https://en.wikipedia.org/wiki/Running_economy#:~:text=Running%20Economy%20is%20calculated%20by,by%20kilogram%20of%20body%20weight.).
Using these output Calorie estimates,
it's not so straightfoward to convert into FTWR: efficiency varies by relative pace of the athlete ([Barnes 2015](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4555089/)).
We're looking at a maximal effort here,
so at 5 calories burned per liter of oxygen
([Scott 2005](https://pubmed.ncbi.nlm.nih.gov/18500953/))
and using efficiencies in the range of 15-30% ([Hoogkamer 2019](https://pubmed.ncbi.nlm.nih.gov/29143929/))
we'll just use 25% for easiest math and say:
  FTWR = Calories burned * .25 / kg
.
This isn't very satisfying, still.
If you go from pace -> power (W/kg),
you could do something like
* 10 min/mile or 6.2 min/km: ~3.5 - 4.0 W/kg
* 8 min/mile or 5.0 min/km: ~4.5 - 5.0 W/kg
* 6 min/mile or 3.7 min/km: ~6.0 - 7.0 W/kg
* ~4.5 min/mile or 2.8 min/km: ~7.5 - 8.5 W/kg
to account for the nonlinearity, and use the cycling formula.

Weight training, albeit less commonly, uses velocity.
Newton's law: 
  F = m·a
,
so while VBT trackers have velocity,
with knowledge of the weight they also have power
and work.
The values likely aren't comparable to running/cycling over an hour 
(an hour of deadlifts...).

All this leads me to think that we should measure this with the _input_ rather than the output.
Or maybe don't worry about comparing between sports: cycling we can measure output, running we have to measure inputs.
