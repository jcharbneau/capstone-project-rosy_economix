import sys
from datetime import datetime
from awsglue.utils import getResolvedOptions
from awsglue.context import GlueContext
from awsglue.job import Job
from pyspark.sql import SparkSession

catalog_name = 'eczachly-academy-warehouse'
spark = (SparkSession.builder.config(
    'spark.sql.defaultCatalog', catalog_name)
         .config(f"spark.sql.catalog.{catalog_name}", "org.apache.iceberg.spark.SparkCatalog")
         .config(
    f'spark.sql.catalog.{catalog_name}.catalog-impl',
    'org.apache.iceberg.rest.RESTCatalog')
         .config(
    f'spark.sql.catalog.{catalog_name}.warehouse',
    catalog_name).config(
    'spark.sql.catalog.eczachly-academy-warehouse.uri',
    'https://api.tabular.io/ws/').getOrCreate())

args = getResolvedOptions(sys.argv, ["JOB_NAME", "ds", 'output_table'])
run_date = args['ds']
output_table = args['output_table']

glueContext = GlueContext(spark.sparkContext)
spark = glueContext.spark_session
spark.sql(f"""
    CREATE TABLE IF NOT EXISTS {output_table} (
        some_column STRING
    )
    USING iceberg
    PARTITIONED BY(date DATE)
""")
schema = ["some_column", "date"]
date = datetime.strptime(run_date, "%Y-%m-%d").date()
df = spark.createDataFrame([('some_data', date)], schema)
df.writeTo(output_table).using("iceberg").partitionedBy("date").overwritePartitions()
job = Job(glueContext)
job.init(args["JOB_NAME"], args)
