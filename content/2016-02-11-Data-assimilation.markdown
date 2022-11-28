Title: Novel data assimilation improvements for limited observations
Date: 2016-02-11
Author: Andy Reagan
Category: Science
Tags: data-assimilation

NOTE: This is a repost of the original on the [Computational Story Lab blog](http://www.uvm.edu/storylab/2016/02/11/novel-data-assimilation-improvements-for-limited-observations/).

The availability of data on the current state of Earth's atmosphere/ocean/land system continues to improve. As the state-of-the-art weather models and supercomputing power allow for higher resolution forecasts, down to 1km resolution on massively parallel computers, data assimilation techniques are needed to quickly combine the mass of available data.

Here at the University of Vermont, we employ a <a href="http://www.uvm.edu/storylab/2013/03/18/chaos-in-an-atmosphere-hanging-on-a-wall/" target="_blank">CFD model of a thermosyphon</a> as a testbed for data assimilation techniques. Our latest research, published in <a href="https://t.co/dzjUyyszhE" target="_blank">PLoS ONE</a>, shows that by using information about the direction of uncertainty propagation within a forecast ensemble can improve prediction skill.

In order to utilize an adaptively localized covariance, we combine a Ensemble Transform Kalman Filter (ETKF) with model estimates of flow velocity to adapt the localization parameters. Below we see an ensemble of initially random forecasts come closer to the true model state, using data assimilation.

<a href="http://www.uvm.edu/storylab/wp-content/uploads/CaiJXdlW0AAIkfe.png" rel="attachment wp-att-1707"><img class="aligncenter wp-image-1707" src="http://www.uvm.edu/storylab/wp-content/uploads/CaiJXdlW0AAIkfe.png" alt="CaiJXdlW0AAIkfe" width="600" height="441" /></a>

Modest improvements in forecast skill are shown to be possible, pushing the envelope of prediction just a bit further into the future. For more detail, take a look at the open-access paper: <a href="http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0148134">http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0148134</a>
