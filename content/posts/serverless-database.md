---
title: "Serverless Database"
date: 2019-08-10T11:54:56+02:00
lastmod: 2020-11-09
categories:
  - Data
---

In this very short post, I just want to gather useful python snippets to get data from a datalake or an athena instance.

Create a virtual environment with the following libraries:

```txt
jupyterlab
dask[dataframe]
s3fs
PyAthena[SQLAlchemy]
fastparquet
```

Query Athena:

```python
import pandas as pd
from pyathena import connect

# https://pypi.org/project/PyAthena/
conn = connect(
    aws_access_key_id="<key>",
    aws_secret_access_key="<secret>",
    s3_staging_dir=
    's3://<bucket>/<folder>/',
    region_name='eu-west-1'
)
df = pd.read_sql("SELECT * FROM <database>.<table> limit 10;", conn)
```

Query the datalake:

```python
import dask.dataframe as dd

# https://docs.dask.org/en/latest/dataframe-api.html#dask.dataframe.read_csv
df = dd.read_csv(
    "s3://<bucket>/databases/<database>/<table>/<file>.csv.gz",
    compression='gzip'
)

# https://docs.dask.org/en/latest/dataframe-api.html#dask.dataframe.read_parquet
df = dd.read_parquet(
    "s3://<bucket>/databases/<database>/<table>/<file>.parquet"
)
```
