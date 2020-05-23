---
title: Athena serving layer
date: 2020-02-23
categories:
  - Data
---

## How to optimise Athena (speed and cost) to unlock backend serving

On Friday, I had the idea of using Athena as a serving layer for a Machine Learning backend application of mine. The motivation was that by [querying Athena in python]({{< ref "serverless-database.md" >}}), it was drastically reducing the amount of logic I had to write (= backend code) and also reducing the infrastructure blueprint of the application (= no database to spin up and maintain - PostgreSQL or DynamoDB). But after implementing quick wins like caching, I still hit a road block where each Athena query takes 7 seconds and scans 10 GB of data.

After a quick Google search, I found out that [this approach is what companies like SimilarWeb do](https://similarweb.engineering/athena-serving-layer/) and that there are further tricks to optimise Athena. I then proceeded into a rabbit hole of Athena, Parquet and ORC.

Notes that start with *[In theory]* are things I haven't tried and collected here for completeness.

### Notes

![Optimise Athena](/images/athena-serving-layer.png)

1. Athena's pricing and performance (= speed) is indexed on the **amount of data scanned** for each query.

1. [Using **columnar storage formats** (Parquet or ORC) is the first improvement step](https://docs.aws.amazon.com/athena/latest/ug/columnar-storage.html). They are great because they are column based (great for intensive read queries), have efficient compression (due to column based compression).

    ```python
    df.write.parquet("s3://users.parquet")
    ```

1. How to choose between Parquet and ORC: if you don't have many nested data types, Parquet might be unecessary. There is a tooling affinity for each format though: Hive and ORC, Spark and Parquet, Kafka and Avro... So given that ORC and Parquet are sensibly similar *at my scale* (note: see point 9 on predicate pushdown), I'd go for Parquet as it's the most convenient when using Spark.

1. **Discard rows and columns that are known to be irrelevant**. For example, if we have a long-tail distribution, consider throwing away those rows that are unlikely to be queried.

1. **Denormalise** the data as much as possible (= load after joins). This will inflate the data (hence increase cost) but will increase performance.

1. Athena support Hive **partitions** so they remain the best way to restrict the amount of data scanned by each query (= [use physical partitions in folders](https://docs.aws.amazon.com/athena/latest/ug/partitions.html)).

    ```python
    df.partitionBy("year", "month", "day").write.parquet(...)
    ```

1. Always turn on Google **snappy compression**. (It's [already the default](https://spark.apache.org/docs/latest/sql-data-sources-parquet.html#configuration) for parquet when using spark)

    ```python
    df.write.option("compression", "snappy").parquet(...)
    ```

1. Partitioning has a cost. As the number of partitions in your table increases, the higher the overhead of retrieving and processing the partition metadata, and the smaller your files. Partitioning too finely can wipe out the initial benefit. In those cases, look at **bucketting** in Hive. Choose a column with high cardinality, frequently used for filtering, like a primary key or user_id.

    ```sql
    CREATE TABLE users_bucketted
    WITH (
        format = 'PARQUET',
        parquet_compression = 'SNAPPY',
        bucketed_by = ARRAY['user_id'],
        bucket_count = 100)
    AS SELECT user_id, user_name, country
    FROM users_not_bucketted;
    ```

    > Note 1: Although spark has a bucketting fetaure, Athena doesn't support it; so we're forced to use either Hive or a `CREATE TABLE AS` statement in Athena
    > Note 2: choose the number of buckets based on the optimal file size for Athena (= don't go below 128 MB per file, unless you never aggregate)

1. *[In theory]* A (more advanced) feature of Parquet and ORC to not overlook is the use of column indexes, or **`Predicate pushdown`**. This combined with partitions can further improve performance. When an Athena query obtains specific column values from your data, it uses statistics from data block predicates, such as max/min values, to determine whether to read or skip the block.

    > Note: it's unclear if ORC indexing on columns is better than Parquet. Since Dec 2018, Parquet [now supports column indexes](https://issues.apache.org/jira/browse/PARQUET-1201) too. It's unclear if Spark as a backend for Parquet is implementing Parquet column indexes. If it isn't, then it could mean that switching from Parquet to ORC and leverage column indexes would further improve performance and cost.

    ```python
    df.repartition(100, "user_id").write.parquet(...)
    ```

1. One way to optimize the number of blocks to be skipped is to **identify and sort by a commonly filtered column** before writing your ORC or Parquet files. This ensures that the range between the min and max of values within the block would be as small as possible within each block. [This gives it a better chance to be pruned](https://aws.amazon.com/blogs/big-data/top-10-performance-tuning-tips-for-amazon-athena/).

    ```python
    df.sort("user_id").repartition(100, "user_id").write.parquet(...)
    ```

1. *[In theory]* ORC specific notes.

    ```python
    # turn on indexes in the spark config in ORC
    sqlContext.setConf("spark.sql.orc.filterPushdown", "true")
    ```

    ```python
    # turn on bloom filters
    df.write.option("orc.bloom.filter.columns", "user_id").parquet(...)
    ```

1. To check incremental improvements, one would not rely on a Google search like I did, but instead [use table statistics with `ANALYZE TABLE`](https://hadoopsters.com/2017/12/19/how-to-build-optimal-hive-tables-using-orc-and-metastore-statistics/)
