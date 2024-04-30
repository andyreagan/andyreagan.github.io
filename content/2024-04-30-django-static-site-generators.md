Title: Django Static Site Generators
Author: Andy Reagan
Date: 2024-04-30

I've been thinking about moving this Pelican blog that you're reading over to Django.

Parts of it already come from a Django database: 
the publications list and CV depend on a version of a Django app that once powered vermontcomplexsystems.org.

I looked around on the internet, and of course this isn't a new idea.
Here a few examples:

* [django-distill](https://github.com/meeb/django-distill)
  * ✅ up to date, with [example project](https://github.com/meeb/django-distill-example/tree/master) that is [deployed to netlify](https://django-distill-example.meeb.org/)
  * [47/100 on snyk](https://snyk.io/advisor/python/django-distill), much lower than I would have thought!
* [django-bakery](https://github.com/palewire/django-bakery)
  * ✅ up to date
  * Built and maintained (originally) by [Los Angeles Times Data Desk](http://datadesk.latimes.com/posts/2012/03/introducing-django-bakery/).
  * [66/100 on snyk](https://snyk.io/advisor/python/django-bakery)
* [django-freeze](https://github.com/fabiocaccamo/django-freeze)
  * ✅ up to date
  * [72/100 on snyk](https://snyk.io/advisor/python/django-freeze)
* [django-staticgen](https://github.com/mishbahr/django-staticgen)
  * 🚫 very out ot date
  * 39/100, should be lower? Django scores a 94, so that's good.
* [Cactus](https://github.com/eudicots/Cactus)
  * 🚫 very out ot date
* [django-medusa](https://github.com/mtigas/django-medusa?tab=readme-ov-file) that I saw referenced by (a very old version of) [wagtail cms](https://docs.wagtail.org/en/v1.1/reference/contrib/staticsitegen.html)
  * 🚫 From the README on the project, which is archived: _Note: This project is largely unmaintained since 2014 and may be broken._
  * Recommends [The alsoicode/django-medusa fork](https://github.com/alsoicode/django-medusa), by Brandon Taylor.
    * 🚫 Still very out of date
* could just use [wget](https://www.michelepasin.org/blog/2021/10/29/django-wget-static-site/index.html)!

A few of the examples I found from "jamstack", like this: https://jamstack.org/generators/cactus/.
Interesting project itself.

Looks like `django-distill` is quite nice!
