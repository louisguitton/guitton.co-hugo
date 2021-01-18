---
slug: dbt-artifacts
title: "How to Parse dbt Artifacts"
date: 2020-12-20
lastmod: 2020-12-21
summary: >
    In this post, I'll show you how to get started with dbt artifacts, and how to parse them to unlock applications valuable to your use case.
keywords:
    - dbt artifacts
    - dbt lineage graph
categories:
    - Data
featuredImage: /images/alexander-schimmeck-gUtcrNunbCM-unsplash.jpg
images:
    - /images/alexander-schimmeck-gUtcrNunbCM-unsplash.jpg
    - /images/dbt.png
    - /images/jq.png
    - /images/pydantic.png
series:
  - Metadata Series
# Ref: https://github.com/luizdepra/hugo-coder/wiki/Configurations#front-matter
# Ref: https://gohugo.io/content-management/front-matter
---

If you're using [`dbt`](https://www.getdbt.com/), chances are you've noticed
that it generates and saves one or more _artifacts_ with every invocation.

In this post, I'll show you how to get started with dbt artifacts, and how
to parse them to unlock applications valuable to your team and your use case.

Whether that's just for a fun Friday afternoon learning
session, or whether that's your first foray
at building a Data Governance tool using dbt,
I hope you'll find this post useful, and if you do, let me know [on twitter](https://twitter.com/louis_guitton)!

## When are Artifacts Produced

![dbt](/images/dbt.png "dbt")

A word of warning: dbt's current minor version as of writing is v0.18.1 and multiple improvements to artifacts are coming in dbt's next version v0.19.0, but that doesn't change the content of this post.

> dbt has produced artifacts since the release of dbt-docs in v0.11.0. Starting in dbt v0.19.0, we are committing to a stable and sustainable way of versioning, documenting, and validating dbt artifacts.\
Ref: https://next.docs.getdbt.com/reference/artifacts/dbt-artifacts/

[The artifacts currently generated](https://docs.getdbt.com/reference/dbt-artifacts) are JSON files called
`manifest.json`, `catalog.json`, `run_results.json` and `sources.json`.
They are used to power the docs website and other dbt features.

[Different dbt commands](https://docs.getdbt.com/reference/dbt-commands) generate different artifacts, so I've summarised that in the table below:

|             | debug | init | compile | run | test | deps | snapshot | clean | seed | docs | source | run-operation | rpc | list |
|-------------|-------|------|---------|-----|------|------|----------|-------|------|------|--------|---------------|-----|------|
| manifest    |       |      |    x    |  x  |   x  |      |          |       |      |   x  |        |               |     |   x  |
| run results |       |      |         |  x  |   x  |      |     x    |       |   x  |   x  |        |               |     |      |
| catalog     |       |      |         |     |      |      |          |       |      |   x  |        |               |     |      |
| sources     |       |      |         |     |      |      |          |       |      |      |    x   |               |     |      |

Of course, `dbt docs` is the command that refreshes most artifacts (makes sense, since they were initially introduced to power the docs site).
But it's interesting to note that `manifest` can be refreshed by other commands than the usual suspects `dbt run` or `dbt test` too.

### Available Data in dbt artifacts

`Manifest`:
> Today, dbt uses this file to populate the [docs site](https://docs.getdbt.com/docs/building-a-dbt-project/documentation), and to perform [state comparison](https://next.docs.getdbt.com/docs/guides/understanding-state/). Members of the community have used this file to run checks on how many models have descriptions and tests.

`Run Results`:
> In aggregate, many run_results.json can be combined to calculate average model runtime, test failure rates, the number of record changes captured by snapshots, etc.

`Catalog`:
> Today, dbt uses this file to populate metadata, such as column types and table statistics, in the [docs site](https://docs.getdbt.com/docs/building-a-dbt-project/documentation).

`Sources`:
> Today, dbt Cloud uses this file to power its [Source Freshness visualization](https://docs.getdbt.com/docs/dbt-cloud/using-dbt-cloud/cloud-snapshotting-source-freshness/).

`graph.gpickle`:
> Stores the networkx representation of the dbt resource DAG.

## Parsing Artifacts from the Command Line with `jq`

![jq command line](/images/jq.png "jq command line")

To get started with parsing dbt artifacts for your own use case,
I suggest to use [`jq`](https://stedolan.github.io/jq/), the
lightweight and flexible command-line JSON processor.
This way, you can try out your ideas, explore the available data
without writing much code at first.

`jq` Cheat sheet:
<details>

```sh
→ tldr jq
  jq

  A command-line JSON processor that uses a domain-specific language.
  More information: https://stedolan.github.io/jq.

  - Output a JSON file, in pretty-print format:
    jq . file.json

  - Output all elements from arrays (or all the values from objects) in a JSON file:
    jq '.[]' file.json

  - Read JSON objects from a file into an array, and output it (inverse of jq .[]):
    jq --slurp . file.json

  - Output the first element in a JSON file:
    jq '.[0]' file.json

  - Output the value of a given key of the first element in a JSON text from stdin:
    cat file.json | jq '.[0].key_name'

  - Output the value of a given key of each element in a JSON text from stdin:
    cat file.json | jq 'map(.key_name)'

  - Output the value of multiple keys as a new JSON object (assuming the input JSON has the keys key_name and other_key_name):
    cat file.json | jq '{my_new_key: .key_name, my_other_key: .other_key_name}'

  - Combine multiple filters:
    cat file.json | jq 'unique | sort | reverse'

  - Output the value of a given key to a string (and disable JSON output):
    cat file.json | jq --raw-output '"some text: \(.key_name)"'
```

</details>

In particular, you will need to make use of some of the
built-in operators like `to_entries` and `map`.

Here is a command to grab the materialisation of each model

```sh
→ cat target/manifest.json | jq '.nodes | to_entries | map({node: .key, materialized: .value.config.materialized})'
[
  {
    "node": "model.jaffle_shop.dim_customers",
    "materialized": "table"
  },
  {
    "node": "model.jaffle_shop.stg_customers",
    "materialized": "view"
  }
]
```

You can then for example store that into a file by piping the output

```sh
cat target/manifest.json | jq '.nodes | ...' > my_data_of_interest.json
```

## Parsing Artifacts from Python with `pydantic`

![pydantic](/images/pydantic.png "pydantic")

Once you get a better idea of what data you need,
you might want to develop more custom logic around dbt artifacts.
This is where python shines: you can write a script with the logic you need.
You can install and import great python libraries.
For instance, you could use `networkx` to run graph algorithms
on your dbt DAG.

You will then need to parse the dbt artifacts in python.
I recommend to use the great [pydantic](https://pydantic-docs.helpmanual.io/)
library: among other things, it allows to parse JSON files
with very concise code that lets you focus on high-level parsing logic.

Here is an example logic to parse `manifest.json`:

```python
import json
from typing import Dict, List, Optional
from enum import Enum

from pydantic import BaseModel, validator


class DbtResourceType(str, Enum):
    model = 'model'
    analysis = 'analysis'
    test = 'test'
    operation = 'operation'
    seed = 'seed'
    source = 'source'


class DbtMaterializationType(str, Enum):
    table = 'table'
    view = 'view'
    incremental = 'incremental'
    ephemeral = 'ephemeral'
    seed = 'seed'


class NodeDeps(BaseModel):
    nodes: List[str]


class NodeConfig(BaseModel):
    materialized: Optional[DbtMaterializationType]


class Node(BaseModel):
    unique_id: str
    path: Path
    resource_type: DbtResourceType
    description: str
    depends_on: Optional[NodeDeps]
    config: NodeConfig


class Manifest(BaseModel):
    nodes: Dict["str", Node]
    sources: Dict["str", Node]

    @validator('nodes', 'sources')
    def filter(cls, val):
        return {k: v for k, v in val.items() if v.resource_type.value in ('model', 'seed', 'source')}


if __name__ == "__main__":
    with open("target/manifest.json") as fh:
        data = json.load(fh)

    m = Manifest(**data)
```

Once you've got the `Manifest` class, you can use it in your custom logic.
For example, in our use case from above where we want to check
for model materialization, we can do:

```python
>>> m = Manifest(**data)
>>> [{"node": node, "materialized": n.config.materialized.value} for node, n in m.nodes.items()]
[
  {
    "node": "model.jaffle_shop.dim_customers",
    "materialized": "table"
  },
  {
    "node": "model.jaffle_shop.stg_customers",
    "materialized": "view"
  }
]
```

## Example Application 1: Detecting a Change in Materialization

Let's say you want to check that no materialisation has changed
before you run `dbt run`. This is useful because some materialization
changes require a `--full-refresh`.
You could achieve the change detection with the following commands:

```sh
→ cat target/manifest.json | jq '.nodes | to_entries | map({node: .key, materialized: .value.config.materialized})' > old_state.json
→ # code change: let's say one model materialization is changed from table to view
→ dbt compile
→ cat target/manifest.json | jq '.nodes | to_entries | map({node: .key, materialized: .value.config.materialized})' > new_state.json
→ diff old_state.json new_state.json
12c12
<     "materialized": "table"
---
>     "materialized": "view"
```

## Example Application 2: Compute Model Centrality with `networkx`

Once you've parsed the `manifest.json`, you have at your disposal
the graph of models from your project.
You could explore off-the-shelf graph algorithms provided
by [`networkx`](https://networkx.org/), and see if any of the insights you get are valuable.

For example, [nx.degree_centrality](https://networkx.org/documentation/stable//reference/algorithms/generated/networkx.algorithms.centrality.degree_centrality.html) can give you
the list of models that are "central" to your project.
You can use that e.g. to priotise maintenance efforts.
In the future, you could imagine a `dbt docs` search that
prioritises results based on this metric as a very simple PageRank proxy.

Once you've written the pydantic code from above, this turns out
to be possible in a very small amount of lines.

```python
import networkx as nx

# ... pydantic code from above for Manifest class

class GraphManifest(Manifest):
    @property
    def node_list(self):
        return list(self.nodes.keys()) + list(self.sources.keys())

    @property
    def edge_list(self):
        return [(k, d) for k, v in self.nodes.items() for d in v.depends_on.nodes]

    def build_graph(self) -> nx.Graph:
        G = nx.Graph()
        G.add_nodes_from(self.node_list)
        G.add_edges_from(self.edge_list)
        return G


if __name__ == "__main__":
    with open("target/manifest.json") as fh:
        data = json.load(fh)

    m = GraphManifest(**data)
    G = m.build_graph()
    nx.degree_centrality(G)
```

## Example Application 3: Graph visualisation

Provided you use python 3.8+, there is another dbt artifact that can
be interesting to you: `graph.gpickle`.
Instead of parsing `manifest.json` and building the graph yourself,
you can deserialize the networkx graph built by dbt itself.

All it takes is 2 lines!

That's hard to beat, but note that you will rely
on the internal graph definition of `dbt` and won't be able to
customise it. For example, tests will be nodes on your graph now.

```python
import networkx as nx

G = nx.read_gpickle("target/graph.gpickle")
```

Nevertheless, this can be useful for example for a quick visulisation
using [pyvis](https://pyvis.readthedocs.io/en/latest/):

```python
from pyvis.network import Network

nt = Network("500px", "1000px", notebook=True)
nt.from_nx(G)
nt.show("nx.html")
```

{{< rawhtml >}}
<embed type="text/html" src="/others/nx.html" width="800" height="600", style="display: flex; margin: auto;">
{{< /rawhtml >}}

## Resources

1. [dbt (data build tool) - Transform data in your warehouse](https://www.getdbt.com/)
1. [dbt Artifacts | docs.getdbt.com](https://docs.getdbt.com/reference/dbt-artifacts/)
1. [dbt Artifacts | next.docs.getdbt.com](https://next.docs.getdbt.com/reference/artifacts/dbt-artifacts/)
1. [dbt Command reference | docs.getdbt.com](https://docs.getdbt.com/reference/dbt-commands)
1. [jq, a lightweight and flexible command-line JSON processor.](https://stedolan.github.io/jq/)
1. [jq Manual | Builtin operators and functions](https://stedolan.github.io/jq/manual/#Builtinoperatorsandfunctions)
1. [pydantic docs](https://pydantic-docs.helpmanual.io/)
1. [NetworkX — NetworkX documentation](https://networkx.org/)
1. [networkx.algorithms.centrality.degree_centrality — NetworkX 2.5 documentation](https://networkx.org/documentation/stable//reference/algorithms/generated/networkx.algorithms.centrality.degree_centrality.html)
1. [Interactive network visualizations — pyvis 0.1.3.1 documentation](https://pyvis.readthedocs.io/en/latest/)
