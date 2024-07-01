-- models/marts/jobs_analysis.sql

select * from {{ ref('int_jobs_analysis') }}
