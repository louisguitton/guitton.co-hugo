---
slug: dbt-governance
title: "Lightweight Data Governance with dbt"
date: 2020-12-20
lastmod: 2020-12-20
summary: >

keywords:
  - dbt artifacts
  - dbt lineage graph
categories:
  - Data
featuredImage: xxx
images:
    - xxx
draft: true
---


## Template

- A list of tail keywords and topics to include for a complete post
- An outline of your post with headlines and subheadlines

## catalog.json

## Model performance

### dbt artifact using run_results.json

### Redshift query insights

https://www.intermix.io/blog/announcing-query-insights/

## Usage Tracking

### SaaS

who is touching your data, and how it’s being used.

SaaS https://www.intermix.io/

### Amundsen

- table usage
    - top used tables according to Redshift
    - top used tables according to BI tool
    - who is using what
- search: in dbt docs or in your BI tool
    - how is dbt docs search built? can it be enriched by PageRank using manifest.json
- table detail
    - date range: when was it created, when was it lastmod
    - Frequent users
    - owners: git blame
    - reviewer: git dataset
- how is a table used
    - most common queries (join, where, ...)
    - dashboards built on it

### Source freshness

https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-snapshotting-source-freshness/

## Data Governance and Lineage using manifest.json

From the docs:
> Members of the community have used this file to run checks on how many models have descriptions and tests.

## References

1. [dbt Artifacts | docs.getdbt.com](https://docs.getdbt.com/reference/dbt-artifacts/)
1. https://next.docs.getdbt.com/reference/artifacts/dbt-artifacts
