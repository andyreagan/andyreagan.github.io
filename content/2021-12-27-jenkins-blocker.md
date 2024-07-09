Title: Jenkins blocking job
Author: Andy Reagan
Category: Programming
Tags: jenkins, python, shell
Date: 2021-12-17

Say you have a job, that depends on three other jobs having been completed.
They all run at the same time,
and are not explicitly a part of your pipeline (you can't put them as a single multijob step).
You need you job to depend on at least one of them as upstream,
but then to make sure the others aren't still running.
So you create another job, which is triggered by 1 of those upstream jobs explicitly,
then watches the others.
Your job is then downstream of this "blocker" job, that will wait for completion
of _all_ of the upstreams.
This is weird "hack" to get a Jenkins job to wait for a set of jobs (or a single one) to be not in a running state.

```sh
test -e $JOBS_TO_WAIT_FOR
test -e $JENKINS_URI

# setup python environment
pip install requests

echo "import json
import requests
import time
jobs = '${JOB_TO_WAIT_FOR}'.strip().split(',')
anime = [True for job in jobs]

# wait for completion
while sum(anime) > 0:
    for i, job in enumerate(jobs):
        if anime[i]:
            r = requests.get('{JENKINS_URI}/job/{job}/api/json?pretty=true'.format(job=job))
            print(r.content)
            x = json.loads(r.content.decode('utf-8'))
            print(x)
            anime[i] = ('anime' in x['color'])
    time.sleep(5)

# now check that they all had a successful last run (optional, of course)
time.sleep(5)
for job in jobs:
    r = requests.get('{JENKINS_URI}/job/{job}/api/json?pretty=true'.format(job=job))
    print(r.content)
    x = json.loads(r.content.decode('utf-8'))
    print('-'*80)
    print(x)
    # make sure it was a success
    assert x['lastCompletedBuild']['number'] == x['lastSuccessfulBuild']['number']
" | python -
```

I noted down this idea a couple years ago, with source code here: https://gist.github.com/andyreagan/ce25939367bcb2e6be9ce4f41a5edd8f.

Merry hacking!