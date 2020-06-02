---
title: Football Strava
date: 2020-06-01
categories:
  - ML
---

## Step 1 - Visualise your football games

I play football at work for fun and also as part of a company league.
[I've written before about one game]({{< ref "medienliga-game.md" >}}), and here is how I built a visualisation of our
March 9th game (just before confinement): `Onefootball 3 - 1 Exozet`.

I track my games using my activity tracker and Strava.
Strava unfortunately doesn't have first-class support for football at the moment.
But I can download the GPX file from [Strava here](https://www.strava.com/activities/3169231179)
and then analyse in in python.

The only manual input was to annotate the corners of the big pitch in the Mauerpark.
I then derive the small pitch location (orange) and the goal posts location (target markers) automatically.
I also detect when the warm up ends to make sure I visualise only my game (the blue dot).

<embed type="text/html" src="/others/strava_football.html" width="800" height="600", style="display: flex; margin: auto;">

## Step 2 - Derive data insights

On top of those nice visualisations, my idea is to also extract football specific insights from this data.

For example, I want to use Bayesian Statistics (a Hidden Markov Model) to automatically tag
offensive and defensive sprints you do as player. You could have 3 states: sprinting towards
the opponent goal (= `attacking`), sprinting towards your own goal (= `defending`), or not sprinting (= `supporting`).
The nice thing with bayesian statistics is that they wouldn't require a lot of games as supervised learning would.
On the other hand, instead of data labelling, you have to do a thorough modelling
and I still need to think more about how I would model this.
