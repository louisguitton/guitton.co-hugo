---
title: Football Strava
date: 2020-06-01
categories:
  - ML
---

Strava unfortunately doesn't have first-class support for football.

Instead, I track my games using my activity tracker, and then I can analyse the GPS file in python.
Libraries I used are: `geopandas`, `folium`, `shapely`.

With only a little bit of manual input (the corners of the pitch),
you can visualise your game in the following way:

<embed type="text/html" src="/others/stava_football.html" width="800" height="600", style="display: flex; margin: auto;">

On top of nice visualisations, my idea is to also extract football specific insights from this data.

For example, I want to use Bayesian Statistics (a Hidden Markov Model) to automatically tag
offensive and defensive sprints you do as player.
