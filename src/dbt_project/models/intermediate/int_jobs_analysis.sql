-- models/intermediate/int_jobs_analysis.sql

with master_dates as (
    select generate_series(
        (select min(date) from {{ ref('stg_labor_force_participation_rate') }}),
        (select max(date) from {{ ref('stg_labor_force_participation_rate') }}),
        '1 month'::interval
    )::date as date
),

labor_force_participation_rate as (
    select
        md.date,
        coalesce(lf.labor_force_participation_rate, 0) as labor_force_participation_rate
    from master_dates md
    left join {{ ref('stg_labor_force_participation_rate') }} lf on md.date = lf.date
),

discouraged_workers as (
    select
        md.date,
        coalesce(dw.discouraged_workers, 0) as discouraged_workers
    from master_dates md
    left join {{ ref('stg_discouraged_workers') }} dw on md.date = dw.date
),

marginally_attached_workers as (
    select
        md.date,
        coalesce(ma.marginally_attached_workers, 0) as marginally_attached_workers
    from master_dates md
    left join {{ ref('stg_marginally_attached_workers') }} ma on md.date = ma.date
),

underemployment_rate as (
    select
        md.date,
        coalesce(ur.underemployment_rate, 0) as underemployment_rate
    from master_dates md
    left join {{ ref('stg_underemployment_rate') }} ur on md.date = ur.date
),

federal_funds_rate as (
    select
        md.date,
        coalesce(ffr.federal_funds_rate, 0) as federal_funds_rate
    from master_dates md
    left join {{ ref('stg_federal_funds_effective_rate') }} ffr on md.date = ffr.date
),

year_treasury_rate as (
    select
        md.date,
        ytr.year_treasury_rate
    from master_dates md
    left join {{ ref('stg_10_year_treasury_constant_maturity_rate') }} ytr on md.date = ytr.date
),

job_openings as (
    select
        md.date,
        coalesce(jo.job_openings, 0) as job_openings
    from master_dates md
    left join {{ ref('stg_job_openings') }} jo on md.date = jo.date
),

unemployment_rate as (
    select
        md.date,
        coalesce(urate.unemployment_rate, 0) as unemployment_rate
    from master_dates md
    left join {{ ref('stg_unemployment_rate') }} urate on md.date = urate.date
),

combined_data as (
    select
        md.date,
        lf.labor_force_participation_rate,
        dw.discouraged_workers,
        ma.marginally_attached_workers,
        ur.underemployment_rate,
        ffr.federal_funds_rate,
        ytr.year_treasury_rate,
        jo.job_openings,
        urate.unemployment_rate
    from master_dates md
    left join labor_force_participation_rate lf on md.date = lf.date
    left join discouraged_workers dw on md.date = dw.date
    left join marginally_attached_workers ma on md.date = ma.date
    left join underemployment_rate ur on md.date = ur.date
    left join federal_funds_rate ffr on md.date = ffr.date
    left join year_treasury_rate ytr on md.date = ytr.date
    left join job_openings jo on md.date = jo.date
    left join unemployment_rate urate on md.date = urate.date
),

filled_data as (
    select
        date,
        labor_force_participation_rate,
        discouraged_workers,
        marginally_attached_workers,
        underemployment_rate,
        federal_funds_rate,
        year_treasury_rate,
        job_openings,
        unemployment_rate,
        coalesce(labor_force_participation_rate,
                 last_value(labor_force_participation_rate) over (order by date
                 rows between unbounded preceding and current row)) as filled_labor_force_participation_rate,
        coalesce(discouraged_workers,
                 last_value(discouraged_workers) over (order by date
                 rows between unbounded preceding and current row)) as filled_discouraged_workers,
        coalesce(marginally_attached_workers,
                 last_value(marginally_attached_workers) over (order by date
                 rows between unbounded preceding and current row)) as filled_marginally_attached_workers,
        coalesce(underemployment_rate,
                 last_value(underemployment_rate) over (order by date
                 rows between unbounded preceding and current row)) as filled_underemployment_rate,
        coalesce(federal_funds_rate,
                 last_value(federal_funds_rate) over (order by date
                 rows between unbounded preceding and current row)) as filled_federal_funds_rate,
        coalesce(year_treasury_rate,
                 last_value(year_treasury_rate) over (order by date
                 rows between unbounded preceding and current row)) as filled_year_treasury_rate,
        coalesce(job_openings,
                 last_value(job_openings) over (order by date
                 rows between unbounded preceding and current row)) as filled_job_openings,
        coalesce(unemployment_rate,
                 last_value(unemployment_rate) over (order by date
                 rows between unbounded preceding and current row)) as filled_unemployment_rate
    from combined_data
),

interpolated_data as (
    select
        date,
        labor_force_participation_rate,
        discouraged_workers,
        marginally_attached_workers,
        underemployment_rate,
        federal_funds_rate,
        year_treasury_rate,
        job_openings,
        unemployment_rate,
        coalesce(labor_force_participation_rate,
                 (lag(labor_force_participation_rate) over (order by date) + lead(labor_force_participation_rate) over (order by date)) / 2) as interpolated_labor_force_participation_rate,
        coalesce(discouraged_workers,
                 (lag(discouraged_workers) over (order by date) + lead(discouraged_workers) over (order by date)) / 2) as interpolated_discouraged_workers,
        coalesce(marginally_attached_workers,
                 (lag(marginally_attached_workers) over (order by date) + lead(marginally_attached_workers) over (order by date)) / 2) as interpolated_marginally_attached_workers,
        coalesce(underemployment_rate,
                 (lag(underemployment_rate) over (order by date) + lead(underemployment_rate) over (order by date)) / 2) as interpolated_underemployment_rate,
        coalesce(federal_funds_rate,
                 (lag(federal_funds_rate) over (order by date) + lead(federal_funds_rate) over (order by date)) / 2) as interpolated_federal_funds_rate,
        coalesce(year_treasury_rate,
                 (lag(year_treasury_rate) over (order by date) + lead(year_treasury_rate) over (order by date)) / 2) as interpolated_year_treasury_rate,
        coalesce(job_openings,
                 (lag(job_openings) over (order by date) + lead(job_openings) over (order by date)) / 2) as interpolated_job_openings,
        coalesce(unemployment_rate,
                 (lag(unemployment_rate) over (order by date) + lead(unemployment_rate) over (order by date)) / 2) as interpolated_unemployment_rate
    from filled_data
)

select
    date,
    coalesce(labor_force_participation_rate, interpolated_labor_force_participation_rate) as labor_force_participation_rate,
    coalesce(discouraged_workers, interpolated_discouraged_workers) as discouraged_workers,
    coalesce(marginally_attached_workers, interpolated_marginally_attached_workers) as marginally_attached_workers,
    coalesce(underemployment_rate, interpolated_underemployment_rate) as underemployment_rate,
    coalesce(federal_funds_rate, interpolated_federal_funds_rate) as federal_funds_rate,
    coalesce(year_treasury_rate, interpolated_year_treasury_rate) as year_treasury_rate,
    coalesce(job_openings, interpolated_job_openings) as job_openings,
    coalesce(unemployment_rate, interpolated_unemployment_rate) as unemployment_rate
from interpolated_data
order by date
