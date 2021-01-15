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
featuredImage: /posts/dbt-search/hero.png
images:
  - hero.png
  - amundsen.png
  - search.png
# Ref: https://github.com/luizdepra/hugo-coder/wiki/Configurations#front-matter
# Ref: https://gohugo.io/content-management/front-matter
---

<!-- # Six Questions (30 min)

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
Seeing the search engine in action and playing with it on a the gitlab dbt project.

- How do you want the reader to feel?
Data governance, data lineage, data discovery don't need to be complicated topics and you can
get started on those roadmaps with a lightwieght open source solution.

- What should the reader do next?
Star `dbt-metadata-utils` and setup the search engine on their own project.
-->

<!-- # Hook + Outline -->

If you've been using `dbt` for a little while, chances are your project has more than 50 models and
chances are more than 10 people are building or using dashboards based on those models.

In the best case, self-service analytics users are coming to you with repeting questions about
what model to use when. In the worst case, they are taking business decisions using the wrong model.

In this post, I will show you how you can **build a lightweight metadata search engine**
on top of your dbt metadata to answer all these questions. I hope to show you that
`data governance`, `data lineage`, and `data discovery` don't need to be complicated topics
and that you can get started today on those roadmaps with my lightweight open source solution.

## Data Governance is Ripe

In his recent post [The modern data stack: past, present, and future](https://blog.getdbt.com/future-of-the-modern-data-stack/),
Tristan Handy - the CEO of Fishtown Analytics (the company behind `dbt`) - was writing:

> **Governance is a product area whose time has come**. This product category encompasses
> a broad range of use cases, including discovery of data assets, viewing lineage information,
> and just generally providing data consumers with the context needed to navigate the sprawling data
> footprints inside of data-forward organizations. This problem has only been made more painful
> by the modern data stack to-date, since it has become increasingly easy to ingest, model,
> and analyze more data.

dbt has its own lightweight governance interface: dbt Docs. They are a great starting point
and might be enough for a while. However, as time goes by, your dbt project will outgrow its clothes.
The search in dbt Docs is Regex only, and you might find its relevancy going down with a growing number
of models. This can become important for Data Analysts building dashboards and looking for the right model
but also for Data Engineers looking to "pull the thread" and debug a model.
Those use cases can be summarised with the two following ["Jobs to be done"](https://firstround.com/review/build-products-that-solve-real-problems-with-this-lightweight-jtbd-framework/):

{{< figure src="jtbd.png" caption="Data discovery can solve 2 'Jobs to be Done'" class="figure-center" >}}

1. <span style="color:blue">When I</span> want to build a dashboard,
   <span style="color:red">but</span> I don’t know which table to use,
   <span style="color:green">help me</span> search through the available models,
   <span style="color:orange">so I</span> can be confident in my conclusions.
1. <span style="color:blue">When I</span> am debugging a data model,
   <span style="color:red">but</span> I don’t know where to start,
   <span style="color:green">help me</span> get data engineering context,
   <span style="color:orange">so I</span> can be faster to a solution.

These days, the solution to those two problems seems to be rolling out "heavyweight" tools like `Amundsen`.
As Paco Nathan writes p.115 of the book [Data Teams by Jesse Anderson](https://www.apress.com/gp/book/9781484262276#:~:text=Jesse%20Anderson%20serves%20in%20three,Kafka%2C%20Hadoop%2C%20and%20Spark.) _(you can find my review of the book [here](https://www.goodreads.com/review/show/3675900375?book_show_action=false&from_review_page=1))_:

> If you look across Uber, Lyft, Netflix, LinkedIn, Stitch Fix, and other firms roughly
> in that level of maturity, they each have an open source project regarding a **knowledge graph of metadata**
> about dataset usage -- Amundsen, Data Hub, Marquez and so on. [...]
> Once an organization began to leverage those knowledge graphs,
> **they gained much more than just lineage information**. They began to recognize the business
> process pathways from data collection through data management and into revenue bearing use cases.

{{< figure alt="Amundsen logo" src="amundsen_logo.png" width=500 caption="Amundsen and other heavyweight tools are the go-to solution for data discovery" class="figure-center" >}}

Those tools come on top of an already complex stack of tools that data teams need to operate.
What if we wanted a lightweight solution instead, like `dbt Docs`?

<details>
Related tools:

- [Amundsen](https://www.amundsen.io/) (Lyft)
- [DataHub](https://github.com/linkedin/datahub) (LinkedIn)
- [Metacat](https://github.com/Netflix/metacat)(Netflix)
- [Marquez](https://marquezproject.github.io/marquez/) (Wework)
- [Databook](https://eng.uber.com/databook/) (Uber)
- [Dataportal](https://medium.com/airbnb-engineering/democratizing-data-at-airbnb-852d76c51770) (Airbnb)
- Data Access Layer (Twitter)
- [Lexikon](https://engineering.atspotify.com/2020/02/27/how-we-improved-data-discovery-for-data-scientists-at-spotify/) (Spotify)

Other products:

- Collibra
- Alation
- Intermix

Great resources to go further:

- [EthicalML/awesome-production-machine-learning](https://github.com/EthicalML/awesome-production-machine-learning#metadata-management)
- [Teardown: What You Need To Know on Data Discovery Platforms](https://eugeneyan.com/writing/data-discovery-platforms/) and [eugeneyan/applied-ml](https://github.com/eugeneyan/applied-ml#data-discovery)
</details>

## The Features of Amundsen and other Metadata Engines

In his great [Teardown of Data Discovery Platforms](https://eugeneyan.com/writing/data-discovery-platforms/)
Eugene Yan summarizes really well the features of Amundsen and other metadata engines and categorises
them in 3 groups: features to **find data**, features to **understand data** and features to **use data**.

{{< figure src="amundsen.png" caption="Architecture of your friendly neighbourhood metadata engine" class="figure-center" >}}

Its friendly UI with a familiar UX (search) is one of the key factors behind Amundsen's success.
But another one is [its modular architecture](https://www.amundsen.io/amundsen/architecture/),
which is already being reused by other metadata open source projects like the [project whale](https://github.com/dataframehq/whale)
(previously called [metaframe](https://towardsdatascience.com/how-to-find-and-organize-your-data-from-the-command-line-852a4042b2be)).

We can further split the 3 categories of features into 10 features of varying implementation difficulty.
Those features have also varying returns, not represented here.

{{< figure src="amundsen_features.png" caption="taxonomy of 10 features from metadata engines, cost opinions are my own" class="figure-center" >}}

What if we wanted to build a 3⭐️-cost metadata engine? What features and technologies would you pick?

## A Lightweight Alternative to Amundsen

Although it's possible that the _feature completeness_ (everything is in one place) makes the USP of Amundsen
and others, I want to make the case for a more lightweight approach.

Documentation tools go stale easily. Or at least in situations where they are not tied with data modeling code.
**dbt has proven with dbt Docs that data people _want_ to document their code** (hi team 😁).
We were just waiting for a tool simple and integrated enough for the _culture_ of Data Governance to blossom.
It reminds me of those DevOps books showing that the solution is not the tooling but rather a culture
(if you're curious check out [The Phoenix Project](https://www.goodreads.com/book/show/25478858-the-phoenix-project)).

Additionally, dbt sources are a great way to make raw data explicitly labeled. The dbt graph documents data lineage
for you at the table level and I will show later how we can use that graph to propagate tags with no additional work.

In other words, with schemas, descriptions and data lineage, dbt Docs cover the category _Features to Understand_
from the above diagram. So **what is missing from dbt Docs to rival with Amundsen**? Search.

{{< figure alt="Algolia logo" src="algolia_logo.png" width=500 caption="Algolia market themselves as a 'flexible search platform'" class="figure-center" >}}

A good search engine will cover the _Features to Find_ category. Fortunately, we don't need to build a
search engine. This is where we will use [Algolia](https://www.algolia.com/)'s free tier in addition to
some static HTML and JS files to build our lightweight data discovery and metadata engine. Algolia's free
tier allows you for 10k search requests and 10k records. Given that for us 1 record = 1 dbt model, and
1 search request = 1 data request from a user, my guess is that the free tier will cover our needs for a while.

_Note: if you're worried that Algolia isn't open source, consider using the project [typesense](https://github.com/typesense/typesense)._

How to get at least one feature in the _Features to Use_ category? Well, a `dbt` project is tracked in
version control, so by parsing `git`'s metadata, we can for example know each model's owner.

More generally, to extend our lightweight metadata engine, we would add metadata sources and develop
parsers to collect and organise that metadata. We would then _index_ that metadata in our search engine.
Examples of metadata sources are:

- dbt artifacts (_See my post on [how to parse dbt artifacts]({{< ref "2020-12-20-dbt-artifacts.md#available-data-in-dbt-artifacts" >}})_)
- git metadata
- BI tool metadata database (e.g. who queries what, who curates what)
- data warehouse admin views (e.g. for Redshift: [`stl_insert`](https://docs.aws.amazon.com/redshift/latest/dg/r_STL_INSERT.html),
  [`svv_table_info`](https://docs.aws.amazon.com/redshift/latest/dg/r_SVV_TABLE_INFO.html),
  [`stl_query`](https://docs.aws.amazon.com/redshift/latest/dg/r_STL_QUERY.html),
  [predicate columns](https://github.com/awslabs/amazon-redshift-utils/blob/master/src/AdminScripts/predicate_columns.sql))
- ...

## What does good Search look like

Search is going to be key if our metadata engine is to rival with Amundsen, so let's look at Amundsen's docs.
We know from their architecture page that they use ElasticSearch under the hood. And we can also read that
we will need a **ranking mechanism** to order our dbt models by relevancy:

> Search for data within your organization by a simple text search. A **PageRank-inspired** search
> algorithm recommends results based on names, descriptions, tags, and querying/viewing activity
> on the table/dashboard.
> -- Source: https://www.amundsen.io/

A bit further in the docs, we learn that Amundsen has three search indices
and that the search bar uses **multi-index search** against those indices:

> the users could search for any random information in the search bar.
> In the backend, the search system will use the same query term from users and search
> across three different entities (tables, people, and dashboards) and return the results
> with the highest ranking.
> -- Source: https://www.amundsen.io/amundsen/tutorials/how-to-search-effective/#general-search

We even get examples for **searchable attributes** for the documents in the tables index:

> For Table search, it will search across different fields,
> including table name, schema name, table or column descriptions, tags and etc
> -- Source: https://www.amundsen.io/amundsen/tutorials/how-to-search-effective/#general-search

Presumably, there's not much point in reverse engineering an open source project,
so I'll spare you the rest: it also supports **search-as-you-type** and **faceted search** (applying filters).

To build the search capability, you could use different technologies. I attended [a talk at Europython 2020
from Paolo Melchiorre]({{< ref "2020-07-27-europython2020#paolo-melchiorre" >}}) advocating for using good-old
PostgreSQL's full text search. To my knowledge though, you don't get search as you type.
This is one of the reasons why people tend to go for ElasticSearch. This will require more engineering
resources than the serverless Algolia. On the other hand, you won't be throwing money at a SaaS company.
As we saw though for our use case, the free tier will be enough so we get best of both worlds.

Rest the question of structuring our documents for search. Attributes in searchable documents
are one of three types: searchable attribute (i.e. matches your query),
a faceting attribute (i.e. a filter) or a ranking attribute (i.e. a weight).

{{< figure src="search.png" caption="Keys in searchable documents are 1 of 3 types" alt="Structuring Documents for Search" class="figure-center">}}

Our **searchable attributes** will be table names and descriptions.

Our **faceting attributes** will be "tags" on our models: these could be vanilla _dbt tags_ if you have good ones,
or _materialisation_, _resource type_ or any other key from the `.yml` file.
Assuming there is a conscious curation effort happening from the code maintainers when they place a model in
a folder in the dbt codebase, we can hence use folder names as a faceting attribute too.
Lastly, we can use the dbt graph to propagate from left to right the _source_ that models depend on; this
will serve as a useful faceting attribute.

For **ranking attributes**, we will build metrics important to us to prioritise tables for our users.
Keep in mind that we startes with 2 use cases ('Job to be Done'), so each persona could benefit from
a different metric. For example, for "dashboard builders", the goal could be to downrank the corner case models
so that only models that are "central" are used. But for "data auditers", the goal might be to prioritise
the models that need attention first. In our case, we will focus on the first persona, and we will use
a PageRank like algorithm (degree centrality [as shown in my previous post]({{< ref "2020-12-20-dbt-artifacts.md#example-application-2-compute-model-centrality-with-networkx" >}})).
This is great at the start of your self service analytics journey: dashboard builders might not know
what are the good tables yet, so models that are reused by your dbt comitters are a good proxy.
Later, you could do like Amundsen and rely on the query logs to weight higher the models that are used more.

<!-- note: difference between "orderBy" and "customRanking" -->

## Enters [`dbt-metadata-utils`](https://github.com/louisguitton/dbt-metadata-utils)

- https://github.com/louisguitton/dbt-metadata-utils
- Note on the setup: you need the git repo locally with dbt artifacts generated
- TODO: walkthrough https://github.com/louisguitton/dbt-metadata-utils/blob/main/dbt_metadata_utils/config.py
- https://docs.getdbt.com/faqs/example-projects/

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

## Conclusion

There you have it! A lightweight data governance tool on top of dbt artifacts and Algolia.
I hope this showed you that data governance doesn't need to be a complicated topic,
and that by using a knowledge graph of metadata, you can get a head start on your roadmap.

Leave a star on the [github project](https://github.com/louisguitton/dbt-metadata-utils), and let me know your thoughts [on twitter](https://twitter.com/louis_guitton).
I enjoyed building this project and writing this post because it lies at the intersection
of thress of my areas of interest: NLP, Data and Engineering. I cover those three topics
in other places [on my blog]({{< ref "/posts/" >}}).

## Resources

1. [The modern data stack: past, present, and future | dbt blog](https://blog.getdbt.com/future-of-the-modern-data-stack/)
1. [A Jobs to be Done Framework for Startups — JTBD Templates & Examples for Building Products Customers Want | First Round Review](https://firstround.com/review/build-products-that-solve-real-problems-with-this-lightweight-jtbd-framework/)
1. [Louis Guitton’s review of Data Teams: A Unified Management Model for Successful Data-Focused Teams | Goodreads](https://www.goodreads.com/review/show/3675900375?book_show_action=false&from_review_page=1)
1. [Teardown: What You Need To Know on Data Discovery Platforms](https://eugeneyan.com/writing/data-discovery-platforms/)
1. [Architecture - Amundsen](https://www.amundsen.io/amundsen/architecture/)
1. [dataframehq/whale: 🐳 The stupidly simple data discovery tool.](https://github.com/dataframehq/whale)
1. [How to find and organize your data from the command-line | by Robert Yi | Towards Data Science](https://towardsdatascience.com/how-to-find-and-organize-your-data-from-the-command-line-852a4042b2be)
1. [The Phoenix Project: A Novel About IT, DevOps, and Helping Your Business Win by Gene Kim | Goodreads](https://www.goodreads.com/book/show/25478858-the-phoenix-project)
1. [Site Search & Discovery powered by AI | Algolia](https://www.algolia.com/)
1. [typesense/typesense: Fast, typo tolerant, fuzzy search engine for building delightful search experiences ⚡ 🔍](https://github.com/typesense/typesense)
1. [louisguitton/dbt-metadata-utils: Parse dbt artifacts and search dbt models with Algolia](https://github.com/louisguitton/dbt-metadata-utils)
