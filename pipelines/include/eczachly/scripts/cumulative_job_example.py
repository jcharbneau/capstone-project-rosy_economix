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
year = int(run_date.split('-')[0])
last_year = year - 1

output_table = args['output_table']

glueContext = GlueContext(spark.sparkContext)
spark = glueContext.spark_session
spark.sql(f"""
   CREATE TABLE IF NOT EXISTS {output_table} (
  player_name STRING,
  height STRING,
  college STRING,
  country STRING,
  draft_year STRING,
  draft_round STRING,
  draft_number STRING,
  seasons ARRAY<STRUCT<
    season: INT,
    age: INT,
    weight: INT,
    gp: INT,
    pts: DOUBLE,
    reb: DOUBLE,
    ast: DOUBLE
  >>,
  is_active BOOLEAN,
  years_since_last_active INT,
  current_season INT
)
USING iceberg
PARTITIONED BY (current_season)
""")


spark.sql(f"""
INSERT OVERWRITE TABLE {output_table}
WITH last_season AS (
    SELECT
      *
    FROM
      {output_table}
    WHERE
      current_season = {last_year}
  ),
  this_season AS (
    SELECT
      *
    FROM
      bootcamp.nba_player_seasons
    WHERE season = {year}
  )
SELECT
  COALESCE(ls.player_name, ts.player_name) AS player_name,
  COALESCE(ls.height, ts.height) AS height,
  COALESCE(ls.college, ts.college) AS college,
  COALESCE(ls.country, ts.country) AS country,
  COALESCE(ls.draft_year, ts.draft_year) AS draft_year,
  COALESCE(ls.draft_round, ts.draft_round) AS draft_round,
  COALESCE(ls.draft_number, ts.draft_number) AS draft_number,
  CASE
    WHEN ts.season IS NULL THEN ls.seasons
    WHEN ts.season IS NOT NULL
    AND ls.seasons IS NULL THEN ARRAY(
      NAMED_STRUCT(
        'season', ts.season,
        'age', ts.age,
        'weight', ts.weight,
        'gp', CAST(ts.gp AS INTEGER),
        'pts', ts.pts,
        'reb', ts.reb,
        'ast', ts.ast
      )
    )
    WHEN ts.player_name IS NOT NULL
    AND ls.seasons IS NOT NULL THEN ARRAY_UNION(ARRAY(
      NAMED_STRUCT(
        'season', ts.season,
        'age', ts.age,
        'weight', ts.weight,
        'gp', CAST(ts.gp AS INTEGER),
        'pts', ts.pts,
        'reb', ts.reb,
        'ast', ts.ast
      )
    ), ls.seasons)
  END AS seasons,
  ts.season IS NOT NULL AS is_active,
  CASE
    WHEN ts.player_name IS NOT NULL THEN 0
    ELSE ls.years_since_last_active + 1
  END AS years_since_last_active,
  {year} AS current_season
FROM
  last_season ls
  FULL OUTER JOIN this_season ts ON ls.player_name = ts.player_name
  """
)

job = Job(glueContext)
job.init(args["JOB_NAME"], args)

