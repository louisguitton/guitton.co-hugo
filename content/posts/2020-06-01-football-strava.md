---
slug: football-strava
title: Football Strava
date: 2020-06-01
lastmod: 2020-11-15
summary:
keywords:
  - strava football
  - playertek
  - strava stats
  - football heat map
categories:
  - ML
featuredImage: /images/football_strava.png
images:
  - /images/football_strava.png
---

## Existing Options to Track Football Games

First, you can use any activity tracker like a Garmin watch, a Fitbit or an Apple Watch to track you football game as any other outdoor activity. But the issue is that applications like Strava do not support football specifically. You can still use Strava to track your activity around games [like the Football for Fathers club does](https://footballforfathers.co.uk/players-strava), and you can certainly track your games as well this way. But the stats will be running stats, not football specific (e.g. no top speed, no sprint distance ...).

Others have felt the same frustration. In [Laces Out](https://thelacesout.com/tracking-my-movements-on-the-football-pitch-with-fitbit-872726e99809), Pierre Delarroqua explains how he analyses his data. Out of this, he built a [free webapp](https://strava-football-app.herokuapp.com/) where you can connect with Strava and get the same plots. Unfortunately some functionality seems broken.

There are also options you can pay for. [Playertek](https://playr.catapultsports.com/eu/#) in particular has probably the best offering. In particular, they offer an [Apple Watch App](https://playr.catapultsports.com/eu/apple-watch/) that costs €5.99 per month.

If like me, you remain unsatisfied with those options, follow along.

## How I Track and Visualise my Football Games with Strava

I play football at work for fun and also as part of a company league.
[I've written before about one game]({{< ref "2019-09-23-medienliga-game.md" >}}), and here is how I built a visualisation of our
March 9th game (just before confinement): `OneFootball 3 - 1 Exozet`.

I track my games using my activity tracker and Strava.
I can [download the GPX file from Strava](https://support.strava.com/hc/en-us/articles/216918437-Exporting-your-Data-and-Bulk-Export) and then analyse it using python.

The only manual input was to annotate the corners of the big pitch in the Mauerpark.
I then derive the small pitch location (orange) and the goal posts location (target markers) automatically.
I also detect when the warm up ends to make sure I visualise only my game (the blue dot).

{{< rawhtml >}}
  <embed type="text/html" src="/others/strava_football.html" width="800" height="600", style="display: flex; margin: auto;">
{{< /rawhtml >}}

## Next Steps

On top of those nice visualisations, my idea is to also extract football specific stats from this data.

For example, I want to use Bayesian Statistics (a Hidden Markov Model) to automatically tag
offensive and defensive sprints you do as player. You could have 3 states: sprinting towards
the opponent goal (= `attacking`), sprinting towards your own goal (= `defending`), or not sprinting (= `supporting`).
The nice thing with bayesian statistics is that they wouldn't require as many games for training as supervised learning would.
On the other hand, instead of data labelling, you have to do a thorough modelling
and I still need to think more about how I would model this.

Other than stats, we can also generate more football heatmaps using python. And lastly, you could compare your metrics (distance, top speed, sprint distance, power) to your teammates who independently who have tracked their games on Strava too.

If you're interested by this project, let me know on twitter [@louis_guitton](https://twitter.com/louis_guitton).

## References

1. [Players' Strava | Football for Fathers](https://footballforfathers.co.uk/players-strava)
1. [Tracking my movements on the football pitch with Fitbit | by Pierre Delarroqua | Laces Out](https://thelacesout.com/tracking-my-movements-on-the-football-pitch-with-fitbit-872726e99809)
1. [Strava Football App](https://strava-football-app.herokuapp.com/)
1. [Home | GPS Football Tracker For Players | PLAYR](https://playr.catapultsports.com/eu/#)
1. [The PLAYR Apple Watch App | PLAYR](https://playr.catapultsports.com/eu/apple-watch/)
1. [Exporting your Data and Bulk Export – Strava Support](https://support.strava.com/hc/en-us/articles/216918437-Exporting-your-Data-and-Bulk-Export)
