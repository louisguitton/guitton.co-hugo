---
title: How to monitor your FastAPI service
date: 2020-09-18
categories:
  - Code
---

In this article, I'll discuss how to monitor the latency and code performance of a FastAPI service.

Notes:

- For an introduction to monitoring and why it's necessary, see this excellent
  post from [Full Stack Pythion](https://www.fullstackpython.com/monitoring.html).
- I will not talk about monitoring application errors and warnings. For this purpose, check Sentry, it has great ASGI support and will work out of the box with your FastAPI service.

References:

- [StatsD, what it is and how it can help you - Datadog Blog](https://www.datadoghq.com/blog/statsd/)

## Short overview of available application monitoring tools

Most likely you've used (or your organisation is already using) 1 or more monitoring tools such as:

- New Relic (commercial with parts open source)
- Datadog (commercial with parts open source)
- StatsD (open source)
- Prometheus (open source)
- OpenTelemetry (open source)

This list is not exhaustive, but let's note [OpenTelemetry](https://opentelemetry.io/) which is the
most recent on this list and is now the de-facto standard for application monitoring metrics.

At this point, chosing a tool doesn't matter, but I'll tell you later what tool(s) I ended up using.

## The 4 steps of monitoring

![4 steps of monitoring](/images/4_steps_monitoring.png "The 4 components of monitoring")

1. It all starts with your application code. You instrument your
   service with a library corresponding to your app's language
   (in our case python). This is the `monitoring client library`.
   Monitoring client library examples:

   - [newrelic/newrelic-python-agent](https://github.com/newrelic/newrelic-python-agent)
   - [Datadog/dd-trace-py](https://github.com/DataDog/dd-trace-py)
   - [open-telemetry/opentelemetry-python](https://github.com/open-telemetry/opentelemetry-python)

2. Then the `monitoring client library` sends each individual call to the `monitoring server daemon` over the network (UDP in particular, as opposed to TCP or HTTP).

3. The `monitoring server daemon` is listening to monitoring events coming from the applications. It packs the incoming data into batches and regularly sends it to the `monitoring backend`.

4. The `monitoring backend` has usually 2 parts: a data processing application and a visualisation webapp. It turns the stream of monitoring data into human-readable charts and alerts.
   Examples:
   - app.datadoghq.com
   - one.newrelic.com

![monitoring backend](/images/monitoring_backend.png "The 2 components of the monitoring backend")

## The problem with monitoring ASGI webapps

ASGI is a relatively new standard for python web servers. As with
every new standard, it will take some time for all tools in the
ecosystem to support it.

Given the 4 steps of monitoring layed out above, a problem arise if
the `monitoring client library` doesn't support ASGI. For example,
this is the case with NewRelic at the moment (see [newrelic/newrelic-python-agent#5](https://github.com/newrelic/newrelic-python-agent/issues/5) for more details). I looked at DataDog too and saw that ~~ASGI is also not supported at the moment~~. (Correction: [there seem to be support for ASGI in ddtrace](http://pypi.datadoghq.com/trace/docs/web_integrations.html?highlight=asgi#asgi)).

On the open source side of the tools however, OpenTelemetry had
great support for ASGI. So I set out to instrument my FastAPI
service with OpenTelemetry.

## Instrumenting FastAPI with OpenTelemetry and Jaeger

OpenTelemetry provides a standard for steps 1 (with `Instrumentors`) and 2 (with `Exporters`) from the 4 steps above. One of the big advantages of
OpenTelemetry is that you can send the events to any monitoring
backend (commercial or open source). Depending on the language you use for your microservice, your mileage may vary. For example,
there is no NewRelic OpenTelemetry Exporter in Python yet.
But there are OpenTelemetry Exporters for many others, see the list here: https://opentelemetry.io/registry/ (filter by language and with type=Exporter).

One of the available backends is [Jaeger](https://www.jaegertracing.io/) (NB: Jaeger is also a monitoring client library that you can
instrument your application with, but here that's not the part
of interest).

![opentelemetry jaeger](/images/opentelemetry_jaeger.png "Example instrumentation")

Although it's open source and worked really easily, the issue I had with Jaeger was that it doesn't have any data pipeline yet.
This means that, in the visualisation webapp, you can browse traces
but you cannot see any aggregated charts. Such a backend is [on their roadmap](https://www.jaegertracing.io/roadmap/) though.

I couldn't find any open source monitoring backend with a data pipeline that would provide the features I was looking for
(latency percentile plots, bar chart of total requests and errors ...).

It became apparent that that's where commercial solutions like
NewRelic and DataDog shine. I hence set out to try the DataDog exporter.

## Instrumenting FastAPI with OpenTelemetry and DataDog

![opentelemetry datadog](/images/opentelemetry_datadog.png "Example instrumentation")

With this approach, you get a fully featured monitoring backend
that will allow you to have full observability for your microservice.

The 2 drawbacks are:

- you need to deploy the DataDog agent yourself (with docker or on Kuberetes or on whatever environment fits your stack) and this can get a bit involved
- DataDog being a commercial product, this solution will not be free.
  You will have to pay extra attention to the pricing of DataDog (especially if you deploy the DataDog
  agent to Kubernetes 😈).

## Conclusion

I hope that with this post you've learned:

- the architecture of application monitoring
- some of application monitoring tools out there
- that as of now, I use OpenTelemetry in combination with
  DataDog to instrument my FastAPI microservices 😅

I didn't go into the code itself as 1) all these libraries
have well written docs and 2) in my experience, the blocker is to understand how the different pieces fit together on a high
level.

Having said that, if you have further questions on the topic,
feel free to reach out on [twitter](https://twitter.com/louis_guitton) or open a [github issue](https://github.com/louisguitton/guitton.co/issues).
