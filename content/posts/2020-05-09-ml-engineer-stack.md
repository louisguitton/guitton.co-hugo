---
slug: ml-engineer-stack
title: My ML Engineer stack
date: 2020-05-09
lastmod: 2020-05-27
summary: My tool stack for Machine Learning Engineering.
categories:
  - Data
featuredImage: /images/ml-stack.png
---

Here I will try to structure my personal stack for ML Engineering, and update it over time.

## How to use this blog post

1. This serves me to structure the code of my projects (e.g. each h2 could be a python module).
1. This can also serve me as a checklist for reviewing a past/someone else's project.

## Part 1: Data Engineering

- Creating the Data Repository
  - Use `S3` data lake or a combined `Redshift` DWH + S3 Lake
  - do the S3 buckets used have lifecycle configurations?
  - think about the price vs fast loading time tradeoff and consider using:
      - `FSx Lustre`
      - `EFS`
      - `EBS`
- Writing the Data Ingestion
  - consider staying outside of `Apache Spark` when possible
        - ingest from DWH to S3: use `dbt` + `UNLOAD` command of Redshift
        - ingest from S3 to S3 using python FaaS (e.g. `pandas` or `dask`)
  - orchestrate those batch transformations with `Apache Airflow`
  - default back to Spark when its value-add trumps the complexity overhead (e.g. `pyspark.sql.functions.explode`)
  - use parquet for the data lake default format (see [my other post]({{< ref "2020-02-23-athena-serving-layer.md" >}}))
  - if batch ingesting (and transforming) in Spark, use `Glue` over `EMR`
  - for streaming, default to `Kinesis` and think of those 3 use cases:
        - use `Kinesis Firehose` to ingest into S3, and then transform in batches
        - use `Kinesis Data Analytics` to run ML models on the stream
        (e.g. RandomCutForest on the clickstream data for fraud detection)
        - use `Kinesis Client Library` to read the data off the stream in other services like EMR
- Writing the Data Transformation
    - I leverage SQL as much as possible using `dbt`
    - I default to python FaaS using `pandas` and over python data stack libraries
        if SQL is unpractical or unnecessary complicated
    - I default to Spark in Glue if all of those fail

## Part 2: Exploratory Data Analysis

- Sanitise and prepare data for modelling
  - dataset level stats, feature level stats, outlier removal, inputting
  - use `pandas_profiling` :)
  - for manual labelling, use `doccano` (it's free) (or `Sagemaker Ground Truth`).
    doccano doesn't have active learning baked in, as opposed to Ground Truth or `prodigy`
- Feature engineering
  - dimensionality reduction techniques (PCA, t-SNE, UMAP)
  - scaling on numerical and one-hot-encoding on categorical features
- Analyse and Visualise data
  - combine the dimensionality reduction techniques with plot with hue by category
  - use confusion matrices a lot

## Part 3: Modeling

- Model framing
  - think of the business metric you're tying to improve
  - think of the model at deployment time:
        - what features are available then
        - how users and backend systems interact with predictions
- Model search
  - the more models in your toolbelt the better
  - but at some point you have to stop trying new things
  - track experiments in `MLflow`
- Optimiser choice (= what to do when SGD fails):
  - Adam stands for adaptive momentum which can help the model converge faster
    and get out of being stuck in local minima
  - Adagrad is an algorithm for gradient-based optimization that adapts the learning rate to the parameters
    by performing smaller updates and, in turn, helps with convergence.
  - RMSProp uses a moving average of
    squared gradients to normalize the gradient itself, which helps with faster convergence.)
- Hyperparamter optimisation
  - Gridsearch is a good baseline, but Random search is better
  - Bayesian optimisation is better than random search
  - Gridsearch and Random search are in `scikit-learn`
  - the 3 of them are in `Sagemaker` hyperparameter tuning jobs (`sagemaker.tuner.HyperparameterTuner`)
- Evaluation
  - use sklearn

## Part 4: MLOps

- Build ML solutions for performance, availability, scalability, resiliency, and fault tolerance
  - think of using `SQS` queues for loose-coupling systems in a fault-tolerant way
  - Sagemaker endpoints do a lot of the heavy lifting for you already
  - Deploy using this stack `Sagemaker endpoint` + `Lambda` + `API Gateway`
  - Enable historical Sagemaker logs using `Cloudtrail`
- When to use what
  - a off-the-shelf high-level AI service (e.g. `Rekognition`)
  - vs when to tune a SageMaker default algo
  - vs when yo bring your own model (e.g. pytorch or tensorflow) using Docker + Sagemaker
- Deploy and operationalize the ML models
  - How to update a Sagemaker endpoint w/o downtime: De-register the endpoint as a scalable target.
    Update the endpoint using a new endpoint configuration with the latest model Amazon S3 path.
    Finally, register the endpoint as a scalable target again.
  - use Sagemaker endpoint's production variants to split traffic between multiple models.
    You can use this to do canary deploys by iterating on the weight ratio.

## Summary

<a frameborder="0" data-theme="dark" data-layers="1,2,3,4" data-stack-embed="true" href="https://embed.stackshare.io/stacks/embed/6c1542c267aa96964578262a793c2c"/></a><script async src="https://cdn1.stackshare.io/javascripts/client-code.js" charset="utf-8"></script>
