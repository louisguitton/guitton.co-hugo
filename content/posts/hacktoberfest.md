---
title: "Hacktoberfest 2019"
date: 2019-10-20
draft: true
categories:
  - Code
---


## Maintaining an old personal project

It all started with this website and its post card looking contact page.
I received an email from Marie. She was trying to use an old project of mine for her Master thesis in Norway.
I wrote that project in 2016 for my own master thesis on quantiyfying Earned media online. Of course the project was broken by now.

That project has 8 stars - which is a high for me, and it had happened before that someone opened an Issue to ask for additional features. Receiving an email request about an open source project creates the same feeling than closing a freelance contract: it gives you a dopamine boost. That boost was enough for me to open 2 PRs: one to cleanup the project (a few years have passed and it was time to apply a few learning to that old codebase) and one to fix the issue for Marie.

## Contributing to a library I use at work

Friday October 11. at work, fixing the Mopub airflow operator and diving deep into the airflow codebase. Reading the S3Hook over and over again, the gcs_to_s3_transfer, the google_discovery_to_s3_transfer (that I co-authored)...

Suddenly I realised that only 2 methods from boto3.s3.client were used : upload_file and upload_fileobj. The current way the Hook was written didn't make this fact that obvious. I hence opened a PR.

## What will the last PR be ?

## Airflow

## Doccano
