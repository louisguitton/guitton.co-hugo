---
slug: column-level-lineage
# A couple of ideas for your headline
title: "Augment your dbt project with column level lineage"
date: 2021-02-28
lastmod: 2021-02-28
# description is left empty, it defaults to summary
summary: >

keywords:
    # A main keyword you want to write about
    - column level lineage
    # A list of tail keywords and topics to include for a complete post
    - sql
    - dbt lineage graph
categories:
    - Data
series:
    - Metadata Series
featuredImage:
# The first 6 URLs from the images array are used for image metadata in the OpenGraph internal hugo template
images:
    -
draft: true
# Ref: https://github.com/luizdepra/hugo-coder/wiki/Configurations#front-matter
# Ref: https://gohugo.io/content-management/front-matter
---

<!--
Checklist before publication
- Review Headlines: Talk benefits, not details. Keep it short
- Review Content skimming: Break it down with bullet points, bolding, spacing
- Review Story: do I have a beginning, a middle, and end? do I tell my emotions?
e.g. storyline of a side project: life before the solution / my approach to solving it / complications I faced / end results / what woul I do differently
-->

## Six Questions (30 min)

- What is the most important point?

You can use python's `collections.deque` to get
column-level lineage on your SQL codebase.

- Why is that the most important point? (what can you achieve with it)

Column-level lineage can help you connect the
dots between SQL models, e.g. in a dbt codebase.

- Why should people care? (what's the benefit)

For example, you can learn which column-level
tests are redundant and save time while running
`dbt test`.
You can learn which columns are most (and least)
central to your models.

- What is the easiest way to understand the most important point?

Paste your SQL in my webapp, pick a column
and look at the lineage graph.

- How do you want the reader to feel?

More metadata about your SQL codebase is
accessible.

- What should the reader do next?

Try the parser on their own SQL.

## If it's a "product", fill in Jobs to be Done

<span style="color:blue">When I</span> read a SQL model,
<span style="color:red">but</span> it contains many CTEs,
<span style="color:green">help me</span> visualize,
<span style="color:orange">so I</span> [outcome].

e.g. for Discord: When I want to jump into my favorite game, but I don’t know if there are people around to play, help me safely coordinate with a group of like-minded gamers, so I can easily find a way to enjoy my favorite multiplayer game.

## Craft the Hook

## Craft the Outline (1 hour)
<!-- bullet points or headlines and subheadlines -->

## Resources

<!-- A list of external sites you can link to -->
1. [My link](url)
