# andyreagan.github.io

This the my personal site hosted on GitHub.
There is no good reason to have a web server for this site, so this static hosting is perfect.

The way GH hosting works, it serves the site from the `master` branch.
So I keep all of the source on the `gh-pages` branch.
Then I use the tool `ghp-import` to move content to `master` branch.

## Writing posts

1. Make a new file in content.
2. Create a webserver.
3. Build the content and preview it.
4. Edit, rebuild.

Repeat step 4, as necessary.

## Publishing changes

There are two scripts here which will get the job done.
First the editing, as above:

```
git checkout gh-pages
make generate
```

and repeat until the site is looking fresh locally.

When this is done, commit changes to `gh-pages` locally.
No need to change to any branches!

Then push the local gh-pages (`git push origin gh-pages`), and local master to github.

The master will be both copied from `content/` and pushed when you run:

```
make publish
```
