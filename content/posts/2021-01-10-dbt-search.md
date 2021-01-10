---
slug: dbt-search
title: "Rethinking the search over your dbt models"
# "Building a lightweight search engine over your dbt models"
date: 2021-01-10
lastmod: 2021-01-10
summary: >
  In this post, I'll show you how to improve the search experience
  of your dbt docs.
keywords:
  - dbt search
  - dbt docs
  - dbt artifacts
  - dbt lineage graph
categories:
  - Data
featuredImage:
images:
  -
  - /images/dbt.png
  -
draft: true
# Ref: https://github.com/luizdepra/hugo-coder/wiki/Configurations#front-matter
# Ref: https://gohugo.io/content-management/front-matter
---

# Six Questions (30 min)

- What is the most important point?

You can use dbt artifacts, Algolia's free tier, HTML and JS to build
a lightweight data discovery search engine.

- Why is that the most important point? (what can you achieve with it)

Data discovery is one common growing pains of dbt projects. You can now build
a search engine over your dbt models packed with metadata.

- Why should people care? (what's the benefit)

Break knowledge silos around your data models.
Not doing this can lead to self-service analytics using the wrong model for their dashboard.

- What is the easiest way to understand the most important point?

Seeing the search engine in action and playing with it on a dbt project.

- How do you want the reader to feel?

Data governance, data lineage, data discovery don't need to be complicated topics and you can
get started on those roadmaps with a lightwieght open source solution.

- What should the reader do next?

Star `dbt-metadata-utils` and setup the search engine on their own project.

# JBTD

- <span style="color:blue">When I</span> want to build a dashboard,
  <span style="color:red">but</span> I don’t know which table to use,
  <span style="color:green">help me</span> search through the available models,
  <span style="color:orange">so I</span> can be confident in my conclusions.
- <span style="color:blue">When I</span> am debugging a data model,
  <span style="color:red">but</span> I don’t know if I can trust it nor where to start,
  <span style="color:green">help me</span> get data engineering context,
  <span style="color:orange">so I</span> can be faster to a solution.

# Hook + Outline

If you've been using dbt for a little while, chances are your project has more than 50 models.
Chances are more than 10 people are building or using dashboards to answer business questions
based on those models.

In the worst case, self-service analytics users are using the wrong model
without knowing. In the best case, they are coming to you with repeting questions about
what model to use when.

In this post, I will show you how you can build a lightweight metadata search engine
on top of your dbt metadata to answer all these questions. I hope to show you that
Data governance, data lineage, and data discovery don't need to be complicated topics
and that you can get started today on those roadmaps with my lightweight open source solution.

## Problem setting

### Motivation

- Paco Nathan p115 of Data Teams from Jesse Anderson ([find my review of the book here](https://www.goodreads.com/review/show/3675900375?book_show_action=false&from_review_page=1))

  > If you look across Uber, Lyft, Netflix, LinkedIn, Stitch Fix, and other firms roughly in that level of maturity, they each have an open source project regarding a knowledge graph of metadata about dataset usage -- Amundsen, Data Hub, Marquez and so on. [...] Once an organization began to leverage those knowledge graphs, they gained much more than just lineage information. They began to recognize the business process pathways from data collection through data management and into revenue bearing use cases.

- [The modern data stack: past, present, and future | dbt blog](https://blog.getdbt.com/future-of-the-modern-data-stack/)

  > **Governance** is a product area whose time has come. This product category encompasses a broad range of use cases, including discovery of data assets, viewing lineage information, and just generally providing data consumers with the context needed to navigate the sprawling data footprints inside of data-forward organizations. This problem has only been made more painful by the modern data stack to-date, since it has become increasingly easy to ingest, model, and analyze more data.

- Data Discovery is a common growing pain
  - Search in dbt docs is based on Regex only.
  - no relevance by "model importance"
- Current solutions = Amundsen or "heavyweight" tools
  - they are an addition to an already large stack of tools

<details>
Related products or tools:

|                                                                                                                                  | Search | Recommendations | Schemas & Description | Data Preview | Column Statistics | Space/cost metrics | Ownership | Top Users | Lineage | Change Notification | Open Source | Documentation | Supported Sources                                     | Push or Pull |
| -------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------- | --------------------- | ------------ | ----------------- | ------------------ | --------- | --------- | ------- | ------------------- | ----------- | ------------- | ----------------------------------------------------- | ------------ |
| [Amundsen](https://www.amundsen.io/) (Lyft)                                                                                      | ✔      | ✔               | ✔                     | ✔            | ✔                 |                    | ✔         | ✔         | Todo    |                     | ✔           | ✔             | Hive, Redshift, Druit, RDBMS, Presto, Snowflake, etc. | Pull         |
| [DataHub](https://github.com/linkedin/datahub) (LinkedIn)                                                                        | ✔      |                 | ✔                     |              |                   |                    | ✔         | ✔         | ✔       |                     | ✔           | ✔             | Hive, Kafka, RDBMS                                    | Push         |
| [Metacat](https://github.com/Netflix/metacat) (Netflix)                                                                          | ✔      |                 | ✔                     |              | ✔                 | ✔                  |           | Todo      |         | Todo                | ✔           |               | Hive, RDS, Teradata, Redshift, S3, Cassandra          |              |
| Atlas (Apache)                                                                                                                   | ✔      |                 | ✔                     |              |                   |                    |           |           | ✔       | ✔                   | ✔           | ✔             | HBase, Hive, Sqoop, Kafka, Storm                      | Push         |
| [Marquez](https://marquezproject.github.io/marquez/) (Wework                                                                     | ✔      |                 | ✔                     |              |                   |                    |           |           | ✔       |                     | ✔           |               | S3, Kafka                                             |              |
| [Databook](https://eng.uber.com/databook/) (Uber)                                                                                | ✔      |                 | ✔                     | ✔            | ✔                 |                    |           |           | ✔       |                     |             |               | Hive, Vertica, MySQL, Postgress, Cassandra            |              |
| [Dataportal](https://medium.com/airbnb-engineering/democratizing-data-at-airbnb-852d76c51770) (Airbnb)                           | ✔      |                 | ✔                     |              | ✔                 |                    | ✔         | ✔         |         |                     |             |               | Unknown                                               |              |
| Data Access Layer (Twitter)                                                                                                      | ✔      |                 | ✔                     |              |                   |                    |           |           | ✔       |                     |             |               | HDFS, Vertica, MySQL                                  |              |
| [Lexikon](https://engineering.atspotify.com/2020/02/27/how-we-improved-data-discovery-for-data-scientists-at-spotify/) (Spotify) | ✔      | ✔               | ✔                     |              |                   |                    | ✔         | ✔         |         |                     |             |               | Unknown                                               |              |

Other products:

- Collibra
- Alation
- Intermix

Reference:

- https://eugeneyan.com/writing/data-discovery-platforms/
- [EthicalML/awesome-production-machine-learning](https://github.com/EthicalML/awesome-production-machine-learning#metadata-management)
- [eugeneyan/applied-ml](https://github.com/eugeneyan/applied-ml#data-discovery)
</details>

### What are the features of Amundsen

- Amundsen
  - search: a familiar UX to answer a need
  - table detail
    - descriptions of tables and columns
    - when the table was last updated
    - table statistics
    - a preview of the data if permitted
    - linking the ETL job and code that generated the data.
  - table usage context
    - table frequent users
    - who has curated/bookmarked what
    - what most common queries for a table look like
  - TODO: add diagram or table of main features from Amundsen

### A lightweight alternative to Amundsen

- Data governance, data lineage, data discovery don't need to be complicated topics
- the dbt docs have shown that you can get started on those roadmaps with a lightwieght open source solution
- you can take this idea further
- You can use dbt artifacts, Algolia's free tier, HTML and JS to build a lightweight data discovery and metadata engine.

## Designing the solution

### Available metadata points

- dbt project
  - dbt artifacts when dbt run or dbt compile
    - [Available Data in dbt artiacts]({{< ref "2020-12-20-dbt-artifacts.md#available-data-in-dbt-artifacts" >}})
  - git metadata (commit tree)
- Data warehouse admin views
  - table stats
  - query history
  - query performance
- BI tool metadata DB
  - users activity
  - dashboard curation metadata

Others:

- github metadata on dbt project (PR discussions)
- Data support tickets for incoming requests

### Proxying Amundsen with our available tools

- search: we can use search as a service tools like Algolia; it has a free tier
  - use algolia's free tier (10 units per month = 10k search requests + 10k records)
- table detail
  - descriptions of tables and columns: already covered by dbt docs
  - when the table was last updated
    - git metadata: last code change
    - redshift metadata: last insert (STL_INSERT)
  - table statistics: redshift metadata (SVV_TABLE_INFO)
  - a preview of the data if permitted: `select * from table limit 5`;
  - linking the ETL job and code that generated the data: use dbt DAG and dbt loaders
- table usage context
  - table frequent users
    - table code owner from git metadata
    - top used tables according to your Data Warehouse (STL_QUERY)
      - problems: you might reuse users across services
    - top used tables according to your BI tool
  - who has curated/bookmarked what: BI tool metadata
    - metabase example https://discourse.metabase.com/t/metabase-metadata-sql/3688
  - what most common queries for a table look like: Redshift metadata (STL_QUERY) + SQL parser

TODO: add architecture diagram for `dbt-metadata-utils`.

### What does good Search look like

- good search = searchable + faceting + ranking attributes
  - TODO: add diagram for good search
- Amundsen search:
  > A PageRank-inspired search algorithm recommends results based on names, descriptions, tags, and querying/viewing activity on the table/dashboard.
- For us
  - searchable attributes: table names, table descriptions
  - faceting attributes: build tags on your models
    - dbt .yml attributes: `tags` if you have good ones, `materialisation` or `resource type`
    - dbt side effects like folder names (there is a conscious curation effort happening from the code maintainers)
    - use DAG algos to propagate interesting info you want to use as tags, e.g. build a source based tag using the `fqn` key in the manifest.json
  - ranking attributes: build metrics that are important for you to prioritise models to your users
    - note1: difference between "orderBy" and "customRanking"
    - note2: depending on your use case, your goal will vary:
      - for JBTD 1, the goal is to downrank the corner case models
      - for JBTD 2, the goal might be to optimise the cluster's performance
    - use DAG algos like PageRank = give meaning to the cold start, which is relevant at the start of your self service analytics journey (=people don't know what are good models, so models that are reused by your dbt comitters's models are a good proxy)
    - usage metrics from redshfit or BI tool

## Final result

- Note on the setup: you need the git repo locally with dbt artifacts generated
- TODO: walkthrough https://github.com/louisguitton/dbt-metadata-utils/blob/main/dbt_metadata_utils/config.py

### Search as you type with Algolia, how is it setup

- you need a unique ID per record if you want to be able to update record metadata periodically

- TODO: https://github.com/louisguitton/dbt-metadata-utils/blob/main/dbt_metadata_utils/algolia.py#L135-L159
- TODO: walk through https://github.com/louisguitton/dbt-metadata-utils/blob/main/dbt_metadata_utils/algolia.py

### DAG algos for centrality and to build new tags (loaders, source)

- TODO: walkthrough https://github.com/louisguitton/dbt-metadata-utils/blob/main/dbt_metadata_utils/models.py#L116
- TODO: walkthrough https://github.com/louisguitton/dbt-metadata-utils/blob/main/dbt_metadata_utils/models.py#L123

### git metadata parser

- TODO: walkthrough https://github.com/louisguitton/dbt-metadata-utils/blob/main/dbt_metadata_utils/git_metadata.py

### Advanced search features: dynamic filtering

- Rules
  - Removing filter values from the query string and using them directly as filters is called dynamic filtering. Dynamic filtering is only one way that Rules can understand and detect the intent of the user.
  - Algolia free license includes "Rules"
  - Based on an “If This Then That” logic, Rules let you make precise modifications to your Search and Discovery experience.

- TODO https://github.com/louisguitton/dbt-metadata-utils/blob/main/dbt_metadata_utils/algolia.py#L165-L182

### What could Come next

- parsers for Redshift or Metbase metadata

## Resources

1. [The modern data stack: past, present, and future | dbt blog](https://blog.getdbt.com/future-of-the-modern-data-stack/)
1. https://www.goodreads.com/review/show/3675900375?book_show_action=false&from_review_page=1
1. Metadata Management solutions
   - [EthicalML/awesome-production-machine-learning](https://github.com/EthicalML/awesome-production-machine-learning#metadata-management)
   - https://eugeneyan.com/writing/data-discovery-platforms/ and [eugeneyan/applied-ml](https://github.com/eugeneyan/applied-ml#data-discovery)
1. Amundsen
   - landing page https://www.amundsen.io/
   - overview https://www.amundsen.io/amundsen/
   - architecture https://www.amundsen.io/amundsen/architecture/
1. Redshift metadata
   - https://docs.aws.amazon.com/redshift/latest/dg/r_STL_QUERY.html
   - https://docs.aws.amazon.com/redshift/latest/dg/r_STL_INSERT.html
   - https://docs.aws.amazon.com/redshift/latest/dg/r_SVV_TABLE_INFO.html
1. [Documentation | docs.getdbt.com](https://docs.getdbt.com/docs/building-a-dbt-project/documentation/)
1. [Site Search & Discovery powered by AI | Algolia](https://www.algolia.com/)
1. [dbt Artifacts | docs.getdbt.com](https://docs.getdbt.com/reference/dbt-artifacts/)
1. https://next.docs.getdbt.com/reference/artifacts/dbt-artifacts
1. https://github.com/louisguitton/dbt-metadata-utils
