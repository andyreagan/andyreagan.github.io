Title: Django + Fitbit
Author: Andy Reagan
Date: 2024-03-27

I finally got around to publishing the Fitbit module of my personal dashboard!

It's here: https://github.com/andyreagan/django-fitbit-healthkit

Some fun facts:

* It automatically deploys to PyPI on tagged releases (so hopefully, I never have to remember how to do this!)
* It _might_ be useful to plug into some of what we built for MassMutual's [WELL Rider](https://www.massmutual.com/well)
    * We rolled our own module, but it could be nice to separate this out so we can test it independently.
 
Here's some notes that I made this morning when considering some open issues for the Fitbit integration that we wrote.

> Maybe we did do a proper search when starting this project 18 months ago, but I've forgotten. I'll take another look in case anything has shown up, and document what I find.
> 
> The one [recommended by fitbit](https://dev.fitbit.com/build/reference/web-api/developer-guide/libraries-and-sample-code/) for Python is 5 years old, the django version is [8 years of date](https://github.com/orcasgit/django-fitbit), and Synk gives it a [score of 39/100](https://snyk.io/advisor/python/django-fitbit).
> 
> In fact, there were only two python projects that had been updated in the past 6 months:
> 
> * A auto-generated set of APIs based on Swagger definition from fitbit: https://github.com/chemelli74/fitbit-web-api
> * A Deta app that pulls heart rate (which I think just happens to be recent) https://github.com/eggplants/heartbeat-status
> 
> In this project, we rolled our own, and yes it wasn't impossible, since fitbit's API is relatively simple. Almost all of the work deals with "business logic" of mapping fitbit API responses to our specific data model.
> 
