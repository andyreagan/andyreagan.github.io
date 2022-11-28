Title: AI-powered Fitness Training
Author: Andy Reagan
Category: Fitness
Tags: running, sweat science
Date: 2022-07-21

Last year Alex Hutchinson, in his generally excellent Sweat Science series, [discovered the four level framework](https://www.outsideonline.com/health/training-performance/training-data-analytics-framework/) for data analytics:

- Descriptive: What happened?
- Diagnostic: Why did it happen?
- Predictive: What will happen?
- Prescriptive: How do we make it happen?

This isn't news for people who work in data, and yet he concludes that have yet to see prescriptive analysis. I think he's wrong, the [research paper didn't do much research](https://journals.humankinetics.com/view/journals/ijspp/16/11/article-p1719.xml), and I said as much on Twitter:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Good to know. There are a bunch of AI-powered training plans starting to emerge these days (e.g. from Training Peaks, SVEXA, and others). The hard part is evaluating how well they work in the real world!</p>&mdash; Alex Hutchinson (@sweatscience) <a href="https://twitter.com/sweatscience/status/1458472680059965440?ref_src=twsrc%5Etfw">November 10, 2021</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

In part because I think it would be fun to write the machine learning algorithm (an idea I've been spinning on for years),
I set out to list what algorithms are already out there.
Turns out, there are a lot! I compiled all of the ones that I found into [a big list on a Google Sheets](https://docs.google.com/spreadsheets/d/1E0ai5oE9FKay2u8rbSqTDKquDFzqNBMXTAprup9TXRI/edit?usp=sharing) and I'll highlight the biggest names below which seem to be basing their approach on data.

## [TrainerRoad](https://www.trainerroad.com/adaptive-training/)

The leader in this category seems like TR,
with their adaptive training system for cycling,
all based on power meter data.
Miss a workout, fail to hit your power targets, or mark a session as easier than the algorithm expected and it will adjust your future session difficulty in response.
Cycling is a great place to start with clear quantitative data (power) on which to based the training.
As a part of this research,
I have started using TR and am enjoying it.

## [triDot](https://tridot.com/)

I've seen these folks mostly from their advertisements, and can't speak much more to how well their system works or whether it's truly adaptive.
They certainly mention AI in their materials.

## [Garmin + FirstBeat](https://www.garmin.com/en-US/blog/fitness/daily-workout-suggestions-for-runners/)

A stalwart in the endurance tech space, Garmin has partenered with FirstBeat
(whom they now own, I recall)
to build a recommendation engine using a workout library and some adaptation of the Bannister model
(reading between the lines in their linked PR).
Disclaimer: I have been using Garmin watches to train for running and cycling for many years,
and as such have developed a positive bias here.

## [TRIQ-App](https://triq.ai)

They have some research on sports science [here](https://triq.ai/triathlon-knowledge/sports-science).
Maybe they have based their rules engine on data that shows performance improvements?

## [AI Endurance](https://aiendurance.com/blog/which-training-really-works)

With a lot of material on their blog and relatively transparent materials from the researcher behind their system (Markus Rummel),
this one deserves a mention with the top.
Though they don't appear to big yet,
it doesn't appear that they are just using AI as a hype word.

## [Xert](https://www.xertonline.com)

The folks at Xert have been doing this for a long time in the cycling space.
They have plans that adjust based on performance,
and really they seem like the first in this space.
[Link to science behind the training advisor](https://baronbiosys.com/xert-training-advisor-first-introduction/).
Like AI Endurance, their marketing does not seem to rival TR or triDot.

## Others: Ultra Trail Coaching, SVEXA, 2PEAK, TrainAsONE, Training Peaks, Sparta Science, Humango, Althetica, Perform, Vert.run, and more

With all of the others,
it's hard to separate marketing from whether an algorithm is actually optimized on training data to improve performance.
It would seem like Training Peaks would have the right data,
but it's not clear that their entry in the market here (coaching-focused, perhaps to be expected) is based on data or whether it's a just a rules-based system.
SVEXA sounds fancy but doesn't have a consumer product.

Not even making the list are popular endurance training platforms that haven't mentioned dynamic training: Today's Plan, Training Tilt, Final Surge, and many many more.

# The list

| Name | URI | <div style="width:350px">Tagline</div> | Notes | Cost |
|:-----|:----|:---------------------------------------|:------|:-----|
| TrainerRoad | https://www.trainerroad.com/adaptive-training/ | TrainerRoad is a cycling training system designed to make you faster with science-based, goal-driven training. Adaptive Training uses machine learning and science-based coaching principles to continually assess your performance and intelligently adjust your training plan. It trains you as an individual and makes you a faster cyclist. | [Interesting commentary in the forums about TrainingPeaks](https://www.trainerroad.com/forum/t/trainingpeaks-announcing-adaptative-training/22081/84). Not too much detail on how it works, [here’s an overview video](https://www.youtube.com/watch?v=d-Z_mim17Dk) | $20/month |
| Xert | https://www.xertonline.com | Welcome to a new generation of training tools and technology. | Adaptive training, see [how “training advisor” works](https://baronbiosys.com/xert-training-advisor-first-introduction/) | |
| triDot | https://tridot.com/ | DATA OPTIMIZED TRAINING™ powered by your genetics & training data and our AI & predictive analys | Owned by [Predictive Fitness Inc.](https://predictive.fit). [Patent 1: System and method for producing customized training plans for multi-discipline …](https://patents.google.com/patent/US20130040272A1/en?q=tridot&oq=tridot) [Patent 2: System and method for real-time environmentally normalized endurance athletic …](https://patents.google.com/patent/US20210308522A1/en?q=tridot&oq=tridot) | $10-$400 per month |
| TRIQ-App | https://triq.ai | Plan triathlon training smarter: With TRIQ. It’s a revolutionary, dynamic app that uses a groundbreaking algorithm to adjust your training in real-time. | Adaptive training plans; Cost not clear; [Articles on the sports science](https://triq.ai/triathlon-knowledge/sports-science). | |
| Garmin + FirstBeat | https://www.garmin.com/en-US/blog/fitness/daily-workout-suggestions-for-runners/ | Adaptive plans delivered right to the watch. | | |
| AI Endurance | https://aiendurance.com/blog/which-training-really-works | At AI Endurance, we believe in a modern way of endurance training. A more personalized, scientific approach to help athletes of all skill levels unlock new potential. We’re passionate about it, and our mission is to personalize training. We specialise in artificial intelligence and we're here to bring it to the forefront of training. We're excited to simplify training through our program and break the mold of “one size fits all” training plans. | Propreitary algorithm for dynamic training. | |
| Ultra Trail Coaching | https://www.ultratrailcoaching.com | The personalized, adaptive training platform for trail and ultra running | Not much detail on what exactly they do | 40pounds per month |
| 2PEAK | https://2peak.com/triathlon-training-plan/ | Dynamic Triathlon and Duathlon Training Plans | Doesn’t look like there is any AI involved, but they do have dynamically adjusting training plans | 72-360 eu per year |
| TrainAsONE | https://www.trainasone.com/training-plans/marathon/ | The AI Running App: intelligent training plans for runners of all abilities. | Adaptive training plans | Free to $10/month. |
| SVEXA | https://www.svexa.com/ | SVEXA is an exercise intelligence company combining expertise in physiology, precision health and data science with a deep understanding in technology. | Training Plan Optimization (MIMIR). Simulate thousands of potential training programs to get the optimal for the specific athlete. The above is one of a handful of bespoke products | |
| Training Peaks | https://www.trainingpeaks.com/ | Featuring plans from expert coaches like Matt Fitzgerald, David Glover and Joe Friel. Take the Training Plan Quiz. Skip the search and find the perfect plan for you! Color-coded workouts. Easy performance analysis. Customizable dashboard. | Adaptive training plans - coaching focused. See https://help.trainingpeaks.com/hc/en-us/articles/204072414-Dynamic-Training-Plans and https://www.stayonpace.com/ | Free to $10/month. |
| Sparta Science | https://spartascience.com | Helping the world Move Better. | https://spartascience.com/drphilwagner/ | |
| Humango | https://humango.ai/athletes/ | Humango for focus, fitness – and fun Humango™ is a unique platform designed to improve athletic motivation and performance. And whether you’re an elite athlete or simply enjoy getting outdoors to exercise, it will help you train more efficiently than ever before. | App with AI Coaching Assistant for running and triathlon | |
| Athletica | https://athletica.ai/ | Athletica is a premium coaching plan that adapts to your current sport, fitness levels, goals, training sessions and life, allowing you to reach new levels of health and performance you never thought possible – all at an affordable price of $20/month. | https://athletica.ai/about/ | $20/month. |
| Perform | https://joinperform.com/ | The most personalized running program, ever. Perform matches you with a personal running coach and uses AI to help you reach your running goals. Adaptive training plans, workouts, and feedback. Made just for you. | | |
| Vert.run | https://vert.run/ | THE TRAINING PLATFORM FOR TRAIL + ULTRA RUNNING. Let’s unlock your full potential. | You’re unique--so is your plan: Your training plan adapts to your level of experience, current fitness, changing schedule, training conditions and goals. | |
| Runna | https://www.runna.com/ | Just training plans? | | |
| Zing | https://zing.coach/ | Zing Coach™ combines human experience and AI technology to give you the best of what people and technology can offer. By harnessing the power of AI, Zing designs personalized workouts tailored to your needs, goals, gender, age, lifestyle, interests, current condition, and emotional well-being. Every fitness program is adjusted in real-time based on your Metabolism, Energy level, Availability of time & equipment, Feedback from each exercise | | |
| RunGap | http://www.rungap.com/ | Workout Data Manager for iOS. | | |
| RunMotion | https://en.run-motion.com/ | Personalised & Adaptive training plans. Achieve your running goals with the RunMotion Coach app like 88% of our users. All you have to do is run! | Your current fitness level: the app assesses your form and adapts your plan | |
| Vitesse | https://vitesserunning.com/ | Bringing Coworkers together: The platform that makes corporate wellness easy and time spend with colleagues fun. | | |
| RunningCoach | https://apps.apple.com/us/app/running-coach-run-walk/id1520213665 | Run and walk whenever and wherever you want with your Running Coach. Set your goal, track your stats including elevation, pace, calories and more and observe your progress directly from your phone. Put your shoes on, get ready and go! Discover all our features including: - Real-time audio feedback: get motivated during your run. - Real time tracker with GPS: see your route and do it again if you want to. - Complete statistics: including elevation, pace, calories, elevation and more. - Register your activity: observe your progress throughout the time. This app uses HealthKit to track and log your workouts and workout routes. | | |
| Run with Hal | https://www.halhigdon.com/apps/ | Made by trainingpeaks folks, limited adjustments | | |
| Nike Run Club | https://www.nike.com/nrc-app | Not clear how dynamic things are. | | |
| The Breakaway | https://www.breakaway.app/ | Cycling focused workouts | | |
| Training Today | https://trainingtodayapp.com/ | Readiness focused | | |
| Rewire | https://rewirefitness.app/ | Daily readiness metrics (e.g., like whoop) | | |
| Athlytic | https://apps.apple.com/us/app/athlytic-ai-fitness-coach/id1543571755 | HRV-based recommendations for training | | |
| Strive | https://strive.ai/ | Really just for tracking | | |
| Runkeeper | https://runkeeper.com/cms/ | Really just for tracking | | |
| Strava | https://www.strava.com/ | Really just for tracking | | |
| Today's Plan | https://www.todaysplan.com.au/ | Human coaching focused | | |
| Training Tilt | https://trainingtilt.com/ | Human coaching focused | | |
| Final Surge | https://www.finalsurge.com/ | Human coaching focused | | |
| Future | https://www.future.co/ | Human coaching focused | | |


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

For a more complete list that includes training data collection apps, see the list here: https://endurancebikeandrun.com/blog/2020/2/6/the-best-running-and-cycling-training-diary-planning-and-analysis-applications.





