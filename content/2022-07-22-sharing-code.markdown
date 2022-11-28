Title: Sharing code
Author: Andy Reagan
Date: 2022-07-22

Let’s say you have a codebase X, and a codebase Y. X produces some results or does some logic that are needed by codebase Y. What should we do to get the results (for this exercise, let’s say it’s a JSON file) from X to Y?

- Shared file store (box, onedrive, s3).
- Live service (e.g., an API).
- Monorepo: Y can run X’s code from the same repo to get the JSON.
- Distribution packaging (pypi, internal artifactory, cran, npm): Y can import X, run it.
- Many repos on a single computer: Y and X are next to each other, run X separately and get the files or import it locally. I've seen this done without the use of [git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules), but this is the use case for submodules.

Where I work, we use all of these strategies when the situation calls for it. Each situation is different, so let’s outline some of the considerations that may come up:

- Security and permissions: can the user of Y have the inputs to X? The code for X?
- Is there a team to support an API?
- Does the organization and the users have the structure necessary to handle a monorepo?
- How many people using Y need the output from X? Is it just some code functionality they need?
- Are you in a place to [plan and maintain a strategy](https://cutlefish.substack.com/p/tbm-3052-why-do-we-have-no-strategy)?

In lieu of telling you how to chose,
I'll just leave the options and those questions to help you decide!
