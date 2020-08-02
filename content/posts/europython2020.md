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

- [API-schema-based testing with schemathesis, Alexander Hultnér](https://ep2020.europython.eu/talks/8XYc942-api-schema-based-testing-with-schemathesis/)

This talks introduced `property based testing (PBT)` as a great way to surface a spectrum
of defects inherent to any application.
For example, making sure the schema you hand in to clients is valid;
or finding simple unhandled errors or more severe logic errors that
arise from **corner cases** not unit tested for.
In practice, it means you're going to catch some errors in `dev`
before your error tracking tool (e.g. Sentry) reports them to you in `stg` or `prod`.
[`hypothesis`](https://github.com/HypothesisWorks/hypothesis) is a powerful, flexible, and easy to use library
for doing property-based testing in python.
[`schemathesis`](https://github.com/kiwicom/schemathesis) is a tool built on top of schemathesis that generates
and runs test cases from an OpenAPI specification.
Based on the [QuickREST Paper, 20 Dec 2019](https://arxiv.org/abs/1912.09686).
If you have a python application, you can integrate `schemathesis` to your `pytest` test suite.
If you don't have a python app, you can run `schemathesis` over HTTP as long as you can point it to the OpenAPI spec.

- [An ASGI Server from scratch, Philip Jones](https://ep2020.europython.eu/talks/4g2en8S-an-asgi-server-from-scratch/)

The `hypercorn` (ASGI server) creator talked us through the new standard ASGI (as opposed to WSGI).
The main advantages are that the new standard enables **asynchronous** execution.
"Asynchronous" refers to concurrent IO-bound code suing `async`/`await` syntax enabled by the `asyncio` library
(example of IO-bound: HTTP requests; example of CPU-bound: compression).
Another advantage is that you can swap out your ASGI server for another (e.g. `uvicorn` for `hypercorn`).
In order to write an ASGI server, you need to translate HTTP messages to ASGI and back.

- [Flasync Await, David Bordeynik, Nvidia](https://ep2020.europython.eu/talks/AFZwiSK-flasync-await/)

After the web server from the previous talk, this talk is about **asynchronous** web framework alternatives to flask.
Although Flask revolutionised webdev in python, it is synchronous; meaning it can be 3 to 4 times slower than asynchronous alternatives.
The talk introduces `sanic` a webframework very similar to Flask in its API but written with `asyncio`.
The speaker shows how easy it is to convert a flask API to sanic due to how close the APIs were designed to be.
Sanic can be an alternative to `FastAPI` although FastAPI does not just offer async, but also
offers typing based data validation, and puts dependency injection as a guiding principle.

The speaker explains that you should benchmark your own use cases with real data and not trust "fake" speed benchmarks.
The goal being to figure out where are the bottlenecks of your application and how to improve them.
His toolbox for benchmarking is `ab (Apache Bench)`, `pytest-benchmark sometimes`, `cProfile`, `snakeviz`,
`Prometheus` & `Grafana`(to get insights on how physical resources are used when deployed to k8s), [`blazemeter`](https://www.blazemeter.com/).

## Macro Trends

- [HTTP/3 – Why should I care?, Miloslav Pojman, Akamai Technologies](https://ep2020.europython.eu/talks/5m4aNGz-http3-why-should-i-care/)

With HTTP/1.1, you can have 6 connections per domain. This means that clients use a connection pool
to download 6 objects at the same time.
If there are more objects to download, they are queued like in a traffic jam.
With HTTP/2, `multiplexing` was introduced which meant that you could download
multiple objects through 1 connection; while also being limited to 1 connection per domain.
It was designed to speed up latency: you bundle things and don’t need to wait for many connections.

HTTP transfers data over TCP.
`TCP` is a protocol layer that handles network unreliabilities for you.
You can write anything to a TCP socket (email POP3, or FTP, or HTTP).
TCP is also reponsible of the `head-of-line blocking` (the traffic jam).

There is a TCP alternative called `QUIC` that comes out of Google.
It gives you a reliable bytestream like TCP.
But it has TLC built-in which means it is encrypted by default.
It also improves performance by leveraging independant bytes streams, thus avouding head-of-line blocking.

`HTTP/3` is HTTP, rebuilt on top of QUIC instead of TCP. It can change the Internet as we know it today.
More time is needed for HTTP/3 to come out of Google and be standardized by IETF, let alone be supported by python libraries likes `httpx`.

- [Extending Python with Rust, Mikhail Medvedev](https://ep2020.europython.eu/talks/6wuE8rA-extending-python-with-rust/)

Just like you would extend python code with C for improving speed, you can also extend python with Rust.
Essentially you turn your Rust code into a **dynamic library** (.dll file on Windows, .so on Linux,
or .dylib on Mac) using a python wrappers like [maturin](https://github.com/PyO3/maturin).
You can build the dynamic library with a docker multi-stage build for example.
You can upload it to PyPI (or a private pip server).
