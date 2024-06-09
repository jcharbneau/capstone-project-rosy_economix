{{ config(materialized='table') }}

with gdp as (
    select date, gdp_value from {{ ref('stg_gdp') }}
),
cpi as (
    select date, cpi_value from {{ ref('stg_cpi') }}
),
unemployment as (
    select date, unemployment_rate from {{ ref('stg_unemployment_rate') }}
),
hourly_earnings as (
    select date, avg_hourly_earnings from {{ ref('stg_average_hourly_earnings') }}
),
weekly_earnings as (
    select date, avg_weekly_earnings from {{ ref('stg_average_weekly_earnings') }}
),
employment_cost as (
    select date, employment_cost_index from {{ ref('stg_employment_cost_index') }}
),
job_openings as (
    select date, job_openings from {{ ref('stg_job_openings') }}
),
nonfarm_payrolls as (
    select date, nonfarm_payrolls from {{ ref('stg_nonfarm_payrolls') }}
),
total_wages as (
    select date, total_wages_and_salaries from {{ ref('stg_total_wages_and_salaries') }}
)

select
    gdp.date,
    gdp.gdp_value,
    cpi.cpi_value,
    unemployment.unemployment_rate,
    hourly_earnings.avg_hourly_earnings,
    weekly_earnings.avg_weekly_earnings,
    employment_cost.employment_cost_index,
    job_openings.job_openings,
    nonfarm_payrolls.nonfarm_payrolls,
    total_wages.total_wages_and_salaries
from gdp
left join cpi on gdp.date = cpi.date
left join unemployment on gdp.date = unemployment.date
left join hourly_earnings on gdp.date = hourly_earnings.date
left join weekly_earnings on gdp.date = weekly_earnings.date
left join employment_cost on gdp.date = employment_cost.date
left join job_openings on gdp.date = job_openings.date
left join nonfarm_payrolls on gdp.date = nonfarm_payrolls.date
left join total_wages on gdp.date = total_wages.date
order by date