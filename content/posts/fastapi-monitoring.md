---
title: How to monitor your FastAPI service
date: 2020-09-18
summary: In this post I explain how to get visibility into
  your FastAPI application's performance
  for both development and production environments.
keywords:
  - fastapi monitoring
  - fastapi jaeger
  - fastapi datadog
  - fastapi newrelic
  - fastapi opentelemetry
  - fastapi profiling
  - fastapi opentracing
  - apm tracing
  - api monitoring
categories:
  - Code
featuredImage: /images/4_steps_monitoring.png
images:
  - /images/4_steps_monitoring.png
  - /images/monitoring_backend.png
  - /images/opentelemetry_jaeger.png
  - /images/opentelemetry_datadog.png
weight: 1
---

In this article, I'll discuss how to monitor the latency and code performance of a FastAPI service.

## API Monitoring vs API Profiling

Monitoring is essentially **collecting data in the background** of your application for the purpose of helping diagnosing issues, helping debugging errors, or informing on the latency of a service.

For example, at the infrastructure level, you can monitor CPU and memory utilization. For example, at the application level, you can monitor errors, code performance or database querying performance. For a more complete introduction to monitoring and why it's necessary, see [this excellent post from Full Stack Python](https://www.fullstackpython.com/monitoring.html).

In this post, we fill focus on **Application Performance Monitoring (APM)** for a FastAPI application.

### Error Tracking

In this post, I will not talk about monitoring application errors and warnings. For this purpose, check Sentry, it has great ASGI support and [will work out of the box](https://docs.sentry.io/platforms/python/guides/asgi/) with your FastAPI service.

### API Profiling

Profiling is a code best-practice that is not specific to web development. From the [python docs on profiling](https://docs.python.org/3/library/debug.html) we can read :

> the profilers run code and give you a detailed breakdown of execution times, allowing you to identify bottlenecks in your programs. Auditing events provide visibility into runtime behaviors that would otherwise require intrusive debugging or patching.

You can of course apply profiling in the context of a FastAPI application. In which case you might find [this timing middleware](https://fastapi-utils.davidmontague.xyz/user-guide/timing-middleware/) handy.

However, with this approach, the timing data is logged to stdout. You can use it in development to to find bottlenecks, but in practice looking at the logs in production to get latency information is not the most convenient.

## Available Tools for Application Performance Monitoring (APM)

As will all things, there are many options. Some are open source, some are SaaS businesses.
Most likely you or your organisation are already using one or more monitoring tools, so I'd suggest starting with the one you know.
The tools on the list below don't do only APM, and that's what makes it harder to understand sometimes. Example application monitoring tools you might have heard of:

- [New Relic](https://docs.newrelic.com/docs/apm) (commercial with parts open source)
- [Datadog](https://docs.datadoghq.com/tracing/) (commercial with parts open source)
- StatsD (open source)
- Prometheus (open source)
- OpenTelemetry (open source)

This list is not exhaustive, but let's note [**OpenTelemetry**](https://opentelemetry.io/) which is the
most recent on this list and is now the de-facto standard for application monitoring metrics.

At this point, choosing a tool doesn't matter, let's rather understand what an APM tool does.

## The 4 Steps of Monitoring

![4 steps of monitoring](/images/4_steps_monitoring.png "The 4 components of monitoring")

1. It all starts with your application code. You instrument your
   service with a library corresponding to your app's language
   (in our case python). This is the `monitoring client library`.
   Monitoring client library examples:

   - [newrelic/newrelic-python-agent: New Relic Python Agent](https://github.com/newrelic/newrelic-python-agent)
   - [DataDog/dd-trace-py: Datadog Python APM Client](https://github.com/DataDog/dd-trace-py)
   - [open-telemetry/opentelemetry-python: OpenTelemetry Python API and SDK](https://github.com/open-telemetry/opentelemetry-python)

2. Then the `monitoring client library` sends each individual call to the `monitoring server daemon` over the network (UDP in particular, as opposed to TCP or HTTP).

3. The `monitoring server daemon` is listening to monitoring events coming from the applications. It packs the incoming data into batches and regularly sends it to the `monitoring backend`.

4. The `monitoring backend` has usually 2 parts: a data processing application and a visualisation webapp. It turns the stream of monitoring data into human-readable charts and alerts.
   Examples:
   - app.datadoghq.com
   - one.newrelic.com

![monitoring backend](/images/monitoring_backend.png "The 2 components of the monitoring backend")

## The problem with monitoring ASGI webapps

ASGI is a relatively new standard for python web servers. As with
every new standard, **it will take some time for all tools in the
ecosystem to support it**.

Given the 4 steps of monitoring layed out above, a problem arise if
the `monitoring client library` doesn't support ASGI. For example,
this is the case with NewRelic at the moment (see [ASGI - Starlette/Fast API Framework · Issue #5 · newrelic/newrelic-python-agent](https://github.com/newrelic/newrelic-python-agent/issues/5) for more details). I looked at Datadog too and saw that ASGI is also not supported at the moment.

On the open source side of the tools however, OpenTelemetry had
great support for ASGI. So I set out to instrument my FastAPI
service with OpenTelemetry.

_Update - Sep 19th, 2020:_
[There seems to be support for ASGI in ddtrace](http://pypi.datadoghq.com/trace/docs/web_integrations.html?highlight=asgi#asgi)

_Update - Sep 22th, 2020:_
[There is now an API in the NewRelic agent to support ASGI frameworks](https://docs.newrelic.com/docs/agents/python-agent/python-agent-api/asgiapplication-python-agent-api), with uvicorn already supported and starlette on the way.

_Update - Oct 23th, 2020:_
The NewRelic python agent now supports Starlette and FastAPI out of the box.

## Instrumenting FastAPI with OpenTelemetry and Jaeger

OpenTelemetry provides a standard for steps 1 (with `Instrumentors`) and 2 (with `Exporters`) from the 4 steps above. One of the big advantages of
OpenTelemetry is that you can send the events to any monitoring
backend (commercial or open source). This is especially **awesome because you can use the same intrumentation setup for `development`, `staging` and `production` environments**.

Note that depending on the language you use for your microservice, your mileage may vary. For example,
there is no NewRelic OpenTelemetry Exporter in Python yet.
But there are OpenTelemetry Exporters for many others, see the list here: [Registry | OpenTelemetry](https://opentelemetry.io/registry/) (filter by language and with type=Exporter).

One of the available backends is [Jaeger: open source, end-to-end distributed tracing](https://www.jaegertracing.io/). (Note that Jaeger is also a monitoring client library that you can
instrument your application with, but here that's not the part
of interest).

![opentelemetry jaeger](/images/opentelemetry_jaeger.png "Example instrumentation")

Although it's open source and worked really easily, the issue I had with Jaeger was that **it doesn't have any data pipeline yet**.
This means that, in the visualisation webapp, you can browse traces
but you cannot see any aggregated charts. Such a backend is [on their roadmap](https://www.jaegertracing.io/roadmap/) though.

Still, Jaeger is my goto tool for monitoring while in `development`. See the last part for more details.

## Instrumenting FastAPI with OpenTelemetry and Datadog

I couldn't find any open source monitoring backend with a data pipeline that would provide the features I was looking for
(latency percentile plots, bar chart of total requests and errors ...).

It became apparent that that's where commercial solutions like
NewRelic and Datadog shine. I hence set out to try the OpenTelemtry Datadog exporter.

![opentelemetry datadog](/images/opentelemetry_datadog.png "Example instrumentation")

With this approach, you get a fully featured monitoring backend
that will allow you to have full observability for your microservice.

The 2 drawbacks are:

- you need to deploy the Datadog agent yourself (with docker or on Kuberetes or on whatever environment fits your stack) and this can get a bit involved
- Datadog being a commercial product, this solution will not be free.
  You will have to pay extra attention to the pricing of Datadog (especially if you deploy the Datadog
  agent to Kubernetes 😈).

## Example FastAPI instrumentation using OpenTelementry, Jaeger and DataDog

So how does it look in the code ?
This is how my application factory looks. If you have any questions, feel free to reach out on [twitter](https://twitter.com/louis_guitton) or open a [github issue](https://github.com/louisguitton/guitton.co/issues).
I will not share my instrumentation because it is specific to my application, but imagine that you can define any nested spans and that those traces will sent the same way to Jaeger or to DataDog. This makes it really fast to iterate on your instrumentation code (e.g. add or remove spans), and even faster to find performance bottlenecks in your code.

```python
"""FastAPI Application factory with OpenTelemetry instrumentation
sent to Jaeger in dev and to DataDog in staging and production."""
from fastapi import FastAPI
from opentelemetry import trace
from opentelemetry.exporter.datadog import DatadogExportSpanProcessor, DatadogSpanExporter
from opentelemetry.exporter.jaeger import JaegerSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchExportSpanProcessor

from my_api.config import generate_settings
from my_api.routers import my_router_a, my_router_b


def get_application() -> FastAPI:
    """Application factory.

    Returns:
        ASGI application to be passed to ASGI server like uvicorn or hypercorn.

    Reference:
    - [FastAPI Middlewares](https://fastapi.tiangolo.com/advanced/middleware/)
    """
    # load application settings
    settings = generate_settings()

    if settings.environment != "development":
        # opentelemetry + datadog for staging or production
        trace.set_tracer_provider(TracerProvider())
        datadog_exporter = DatadogSpanExporter(
            agent_url=settings.dd_trace_agent_url,
            service=settings.dd_service,
            env=settings.environment,
            version=settings.dd_version,
            tags=settings.dd_tags,
        )
        trace.get_tracer_provider().add_span_processor(
          DatadogExportSpanProcessor(datadog_exporter)
        )
    else:
        # opentelemetry + jaeger for development
        # requires jaeger running in a container
        trace.set_tracer_provider(TracerProvider())
        jaeger_exporter = JaegerSpanExporter(
            service_name="my-app", agent_host_name="localhost", agent_port=6831,
        )
        trace.get_tracer_provider().add_span_processor(
            BatchExportSpanProcessor(jaeger_exporter, max_export_batch_size=10)
        )

    application = FastAPI(
        title="My API",
        version="1.0",
        description="Do something awesome, while being monitored.",
    )
    # Add your routers
    application.include_router(my_router_a)
    application.include_router(my_router_b)

    FastAPIInstrumentor.instrument_app(application)
    return application


app = get_application()
```

## Conclusion

I hope that with this post you've learned:

- the difference between profiling, monitoring, tracking errors
- the architecture of application monitoring
- some of application monitoring tools out there
- that OpenTelemetry allows you to reuse the same instrumentation setup for all your environments, which speeds up the speed at which you can find performance bottlenecks in your application

I've used this setup to get a 10x speed up on one multi-lingual NLP fastapi service I built at OneFootball.

## Resources

1. [StatsD, What It Is and How It Can Help You | Datadog](https://www.datadoghq.com/blog/statsd/)
1. [Monitoring - Full Stack Python](https://www.fullstackpython.com/monitoring.html)
1. [ASGI | Sentry Documentation](https://docs.sentry.io/platforms/python/guides/asgi/)
1. [Debugging and Profiling — Python 3.9.0 documentation](https://docs.python.org/3/library/debug.html)
1. [Timing Middleware - FastAPI Utilities](https://fastapi-utils.davidmontague.xyz/user-guide/timing-middleware/)
1. [APM | New Relic Documentation](https://docs.newrelic.com/docs/apm)
1. [APM & Distributed Tracing - Datadog](https://docs.datadoghq.com/tracing/)
1. [**OpenTelemetry**](https://opentelemetry.io/)
1. [newrelic/newrelic-python-agent: New Relic Python Agent](https://github.com/newrelic/newrelic-python-agent)
1. [DataDog/dd-trace-py: Datadog Python APM Client](https://github.com/DataDog/dd-trace-py)
1. [open-telemetry/opentelemetry-python: OpenTelemetry Python API and SDK](https://github.com/open-telemetry/opentelemetry-python)
1. [Registry | OpenTelemetry](https://opentelemetry.io/registry/)
1. [Jaeger: open source, end-to-end distributed tracing](https://www.jaegertracing.io/)
1. [Getting Started with OpenTelemetry Python — OpenTelemetry Python documentation](https://opentelemetry-python.readthedocs.io/en/stable/getting-started.html)
