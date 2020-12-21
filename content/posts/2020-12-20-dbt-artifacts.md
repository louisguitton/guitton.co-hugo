---
slug: dbt-artifacts
title: "How to Parse dbt Artifacts"
date: 2020-12-20
lastmod: 2020-12-21
summary: >
keywords:
    - dbt artifacts
    - dbt lineage graph
categories:
    - Data
featuredImage:
images:
    -
draft: true
# Ref: https://github.com/luizdepra/hugo-coder/wiki/Configurations#front-matter
# Ref: https://gohugo.io/content-management/front-matter
---

## When are artifacts produced

Artifacts and word of warning about upcoming 19.0

Table with commands <> artifacts

## Parsing artifacts from the command line with jq

`to_entries` and `map` are really handy.

```sh
cat target/manifest.json | jq '.nodes | to_entries | map({node: .key, materialized: .value.config.materialized})'
```

## Parsing artifacts from python with pydantic

## Example applications

### detect change in materialization before dbt run

### networkx graph magic

## Resources

1. [dbt Artifacts | docs.getdbt.com](https://docs.getdbt.com/reference/dbt-artifacts/)
1. [dbt Command reference | docs.getdbt.com](https://docs.getdbt.com/reference/dbt-commands)
1. [jq Manual | Builtin operators and functions](https://stedolan.github.io/jq/manual/#Builtinoperatorsandfunctions)
