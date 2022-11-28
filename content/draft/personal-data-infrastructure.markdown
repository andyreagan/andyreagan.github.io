Title: Personal data infrastructure
Date: 2021-12-31
Status: draft

Here's a pretty wild one: https://beepb00p.xyz/myinfra.html
Logging examphttps://chaidarun.com/ten-years-of-logging-my-life

Nothing quite combines fitness and coding quite like building a web app dashboard to pull in Whoop, Strava, and fitbit data.

<img src="/images/draft-personal-data-infrastructure/personal-dashboard-screenshot.png" class="img-responsive">

I thought about tweets, emails, and credit card on the list of things to pull in too...but hey this is a _fitness_ and coding blog.
The list could go on: youtube, blog rss feed, pull from a spreadsheet, vendor X or Y, etc.

I opted for Strava over Garmin for two reasons: (1) I update titles, crop activites, etc on Strava, (2) it includes non-garmin stuff like Zwift, and (3) the API is so much more accessible (you don't need a developer access, which I think I emailed Garmin for a few times).
I did add a fitbit auth setup, since I have a fitbit scale...though I'm not pulling in data from there, didn't finish setting that up.
With just a scale, seems like it would be easier to type it in every day!