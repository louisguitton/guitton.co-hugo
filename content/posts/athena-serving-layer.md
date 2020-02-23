---
title: Athena serving layer
date: 2020-02-23
categories:
  - Blogging
---

## How to optimise Athena (speed and cost) to unlock backend serving

On Friday, I had the idea to use Athena as a serving layer for a Machine Learning backend application of mine. The motivation was that it was drastically redcing the amount of logic (= backend code) I had to write and also reducing the infrastructure blueprint of the application (= no database to spin up and maintain - PostgreSQL or DynamoDB).

After a quick Google search, I found out that [this approach is what companies like SimilarWeb do](https://similarweb.engineering/athena-serving-layer/). I then proceeded into a rabbit hole of Athena, Parquet and ORC optimisation. Here are my notes; notes that start with *[In theory]* are things I haven't tried and collected here for completeness.

### Notes

1. Athena's pricing and performance (= speed) is indexed on the amount of data scanned for each query.

1. [Using columnar storage formats (Parquet or ORC) is the first improvement step](https://docs.aws.amazon.com/athena/latest/ug/columnar-storage.html). They are great because they are column based (great for intensive read queries), have efficient compression (due to column based compression).

    ```python
    df.write.parquet("s3://users.parquet")
    ```

1. How to choose between Parquet and ORC: if you don't have many nested data types, Parquet might be unecessary. There is a tooling affinity for each format though: Hive and ORC, Spark and Parquet, Kafka and Avro... So given that ORC and Parquet are sensibly similar *at my scale* (note: see point 8 on predicate pushdown), I'd go for Parquet as it's the most convenient when using Spark.

1. Discard rows and columns that are known to be irrelevant. For example, if we have a long-tail distribution, consider throwing away those rows that are unlikely to be queried.

1. Denormalise the data as much as possible (= load after joins). This will inflate the data (hence increase cost) but will increase performance.

1. Athena support Hive partitions so they remain the best way to restrict the amount of data scanned by each query (= [use physical partitions in folders](https://docs.aws.amazon.com/athena/latest/ug/partitions.html)).

    ```python
    df.partitionBy("user_id").write.parquet(...)
    ```

1. Always turn on Google snappy compression

    ```python
    df.write.option("compression", "snappy").parquet(...)
    ```

1. *[In theory]* A (more advanced) feature of Parquet and ORC to not overlook is the use of column indexes, or `Predicate pushdown`. This combined with partitions can further improve performance. When an Athena query obtains specific column values from your data, it uses statistics from data block predicates, such as max/min values, to determine whether to read or skip the block.

    > Note: it's unclear if ORC indexing on columns is better than Parquet. Since Dec 2018, Parquet [now supports column indexes](https://issues.apache.org/jira/browse/PARQUET-1201) too. It's unclear if Spark as a backend for Praquet is implementing Parquet column indexes.

1. Keep in mind that for an effective storage index you need to [insert the data into the table sorted on the columns for which you want to leverage the storage index](https://snippetessay.wordpress.com/2015/07/25/hive-optimizations-with-indexes-bloom-filters-and-statistics/). It is much less effective on unsorted tables, because it contains the min-max values of the column. If you have a badly sorted table the min-max value for all blocks will be overlapping or even the same and then the storage index is of no use.

    ```python
    df.repartition(100, "user_id").write.parquet(...)
    ```

1. *[In theory]* Within a partition, it might be useful to sort rows (although the min-max value would be unchanged. so I'm not sure how that would help)

    ```python
    df.repartition(100, "user_id").sortWithinPartitions("user_id").write.parquet(...)
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
