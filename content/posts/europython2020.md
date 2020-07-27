---
title: Notes on Europython 2020
date: 2020-07-27
categories:
  - Data
  - ML
  - Code
draft: true
---

From July 23 to July 26, I attented Europython 2020 online.
Here, I will go over my notes.

Disclaimer: I've attended some talks that I've not included here.
Since there were at all times 4 tracks running in parallel, I could not attend 75% of the talks.
For these 2 reasons, these notes reflect my personal Europython experience.

## Typing

- [Static typing in python, Dustin Ingram, Google](https://ep2020.europython.eu/talks/9BZ96n9-static-typing-in-python/)

Python is dynamically typed and can be statically typed.
`mypy` originated out of Dropbox (Jukka Lehtosalo) as a tool to statically check python code.
One key design decision was made when Guido van Rossum (the former [BDFL](https://en.wikipedia.org/wiki/Benevolent_dictator_for_life)
of Python) nudged Jukka Lehtosalo to drop using a typing DSL and instead rely on type hints,
which are now common for python 3.6+ . There are other static type checkers like `pytype` (Google) which has improvements over `mypy`.
Static type checking gives free advantages (IDE completion, documentation, error catching).

- [Fullstack type safety, Szymon Pyżalski](https://ep2020.europython.eu/talks/5muMqs3-full-stack-type-safety/)

The gist of this talk is that even if you enforce types in your python backend code, it's not enough because your stack is made of more than python.
SQL is stricter than python which is stricter than JS.
A type safety stack might look like this:
![fullstack_typesafety](/images/fullstack_typesafety.png)
With a tool like `pydantic`, you can marshall incoming JSON, and can annotate your python code with more complex data types. You can statically check your code with `mypy`.
With tools like `fastAPI` (based on `pydantic`) or `strawberry-graphql` you can generate OpenAPI specifications straight from the type annotations.
With tools like `openapi-generator` you can generate TypeScript classes from an OpenApi spec.

- [Tooling for Static Analysis of Python Programs, Serge Sans Paille, Telecom Bretagne](https://ep2020.europython.eu/talks/3k93S3j-tooling-for-static-analysis-of-python-programs/)

Serge Sans Paille leads a community of pythonistas that are hard at work to make static python analysis suck less.
This artform relies on parsing Abstract Syntax Trees (ASTs) reliably (eg: what your linter does).
To that effect, he provides multiple tools like [`gast`](https://github.com/serge-sans-paille/gast) (which has 160k downloads per day !), [`beniget`](https://github.com/serge-sans-paille/beniget) or [`memestra`](https://github.com/QuantStack/memestra).
This tools was definitely above my level but showed that even if python is not meant for static analysis, you can still create great tooling for it.

## Python best practices gotchas

- [How to write multi-paradigm code, Elias Mistler](https://ep2020.europython.eu/talks/83SnxW9-how-to-write-multi-paradigm-code/)

Combining Object Oriented Programming (OOP) and Functional Programming (FP) is powerful, if done right.
One gotcha was to use [`toolz.functoolz.thread_last`](https://toolz.readthedocs.io/en/latest/api.html#toolz.functoolz.thread_last)
to make code readable from left to right. It takes more time to write but is easier to read, as this quote puts it:

> “I would have written a shorter letter, but I did not have the time.” ― Blaise Pascal

```python
raw_example = "7055862"

# bad
values = []

for digit in raw_example:
    values.append(int(digit))

# better
values = tuple(map(int, raw_example))

# good
from toolz.functoolz import thread_last

values = thread_last(raw_example, (map, int), tuple)

# or
values = [int(digit) for digit in raw_example]
```

Another gotcha was to define indempotent FP functions outside classes and use them inside.

- [Writing Zenlike Python, Jason McDonald](https://ep2020.europython.eu/talks/6Le7GKY-writing-zenlike-python/)

Zen of python is great. One gotcha was to use the cartesian product instead of nested for loops:

```python
# bad
alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

for r in ('WK'):
    for l1 in alpha:
        for l2 in alpha:
            for l3 in alpha:
                print(f"{r}{l1}{l2}{l3}")

# good
import itertools
alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

for r, l1, l2, l3 in itertools.product('WK', alpha, alpha, alpha):
    print(f"{r}{l1}{l2}{l3}")
```

## NLP

- Tansformers

- pythonic fulltext search

- NLPeasy (ElasticSearch)

## Data

- Faust

- TerminusDB (see https://terminusdb.com/blog/2020/03/02/why-graph-will-win)

- Cassandra and Scylla

- making pandas fly

## Web and APIs

- pytest + hypothesis

- schemathesis

- ASGI server from scratch

- Flasync await

## Macro Trends

- HTTP/3

- extending python with rust
