Title: It's All Stress
Author: Andy Reagan
Date: 2024-05-01
Tags: sweat science

Training stress, that is. 
If we want to measure the impact of training on performance,
we need a way to quantify the training.
This is not a new problem.
Methods like Bannister's TRIMP have been around since the 1970's,
while new takes like [FirstBeat's EPOC](https://www.researchgate.net/profile/Elisabet-Borsheim/publication/9025532_Effect_of_Exercise_Intensity_Duration_and_Mode_on_Post-Exercise_Oxygen_Consumption/links/09e41510bf1c033340000000/Effect-of-Exercise-Intensity-Duration-and-Mode-on-Post-Exercise-Oxygen-Consumption.pdf) estimation are relatively new.

The basic formula has to incorporate the basics of exercise science: frequency, intensity, and duration ([ACSM's Guidelines for Exercise Testing and Prescription](https://a.co/d/0iazKMj)).
An hour of work, at a given intensity (say aerobic threshold), can be given a score of 100.
From there, we can scale the score based on intensity (non-linearly), and duration (linearly).
These are rough models, and will never fully capture how the human body responds to stress (),
but still serve as good gaurd rails.
Training peaks has a nice overview of [TSS and it's variation](https://help.trainingpeaks.com/hc/en-us/articles/204071944-Training-Stress-Scores-TSS-Explained),
and I'd highly recommend Dr. Skiba's [Scientific Training for Endurance Athletes](https://a.co/d/5jrUdaE) for a more thorough overview of the space.

## Internal vs external measures

If you can measure output directly, like in cycling with a power meter, than these measure can be pretty "hard".
With only internal measurements, things will be more approximate, but still relative to yourself: 
my HR of 168 may have a very different _output_ in kCal running or biking than Tadej Pogacar on the bike at 168 HR,
but the relative stress to ourselves may be similar.

## Scaling of intensity

Strava has a simple formula for their "[relative effort](https://support.strava.com/hc/en-us/articles/360000197364-Relative-Effort)" (they used to call it suffer score),
it's been reverse engineered [multiple](https://www.alessandroaime.com/2017/03/03/reverse-engineering-the-strava-suffer-score-algorithm) [times](https://djconnel.blogspot.com/2011/08/strava-suffer-score-decoded.html).
I haven't tried to reverse engineer Whoop's Strain score,
but I'm sure it's very similar 
(they suggest as much in their patent, and I'm not too interested to violate their terms of service to determine the coefficients).
Complaints about the scaling parameters abound: is a 5 hour ride in Z2 really harder than a 20min FTP test?
Any reduction to a single number will have these issues.
Cyclists will of course be familiar with Normalized Power,
which takes the raw output and scales it by raising to the fourth power, and then taking the fourth root:
this makes harder efforts have a bigger relative impact (a perfectly steady ride will have the same average power and NP).
Since this more closely aligns with the impact on the body in practice, NP is a very useful metric.

On Strava's simple formula's, 
worth pointing out that their weekly effort recommendations are simply the weighted average of the past three weeks
(1/6, 1/3, 1/2, respectively) for the sum of the relative effort.
The target range is 60-120% of these past three weeks; with 60-90% as maintaining, 90-120% building, and 120-150% overreeaching (labels mine).
They get [some flak](https://communityhub.strava.com/t5/ideas/display-weekly-relative-effort-score-based-on-last-7-days/idi-p/8958) for showing the weekly target, instead of the rolling 7 days 
Maybe rolling 10 days would even better, to smooth out weekends.

Many years ago I had a garmin watch's auto recommendations for steps turned on, and every day it wanted me to get more than the last.
That was fine until it was suggesting every day I get 18K steps!
It would give me a repreive once I missed the target, 
but then push me again.
There should be some upper range... (so I like the 60-120% from Strava).
Maybe if we threw in the CDC minimum and recommendation for some context,
we'd have a system for the people ([ACSM's Guidelines for Exercise Testing and Prescription](https://a.co/d/0iazKMj)).

## Summary

Any attempt to quantify health and fitness (remember: these are the [same thing](https://library.crossfit.com/free/pdf/CFJ-trial.pdf))
can be improved by striving for measures that more closely reflect our biology.
We can use a pedometer in the same way we use a power meter (strain gauge!) or an indirect calorimeter
as a proxy for stress.
Contextualized recommendations that consider calendary cycles (weeks) 
and reasonable upper bounds can work,
with our work/stress proxy,
to build a system that offers actionable, personalized insights.
