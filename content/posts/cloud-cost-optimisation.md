---
title: Cloud cost optimisation for ML Engineers
date: 2020-04-14
categories:
  - Software Engineering
---

This is a microblog, mostly for myself, to keep track of things I need to check when wanting to reduct costs
on AWS (or any other cloud provider).

## Ops side

- Basic stuff you should have done already
  - Shut down test environments at night and scale down in non peak period
- **Storage costs**
  - Lifecycle policies: Move non critical data from S3 to glacier
  - 💡Pay attention to automated versioning of S3 : it's not always needed and it costs money
- **Compute costs**
  - Right sizing EC2 and RDS instances (downsize them if there is no load)
  - Use spot instances where possible
  - Purchase reserved instances
  - Trade off between managed solution costs vs human cost of non managed solution
- **Network costs**
  - 💡Put a CDN in front of S3 as egress from CDN is cheaper than egress from S3
  - 🚨Internal traffic routing vs external traffic routing: internal IP doesn't cost anything;
    public IP routing costs a lot

## Dev side

- Application optimisations
  - Select right DB (e.g. Aurora instead of MySQL)
  - Optimise environments (e.g. RAM of microservices on k8s)
  - Compress data
- Stack optimisation
  - 💡Use the right tool for the job
    e.g. run data processing inside your DB or DWH, not on your backend server
