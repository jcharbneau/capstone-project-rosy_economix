with raw_data as (
    select
        "Year" as year,
        "Originating Crisis" as originating_crisis,
        "Policy Date" as policy_date,
        "Policy Title" as policy_title,
        "Policy Description" as policy_description,
        "Federal Policy Number" as federal_policy_number,
        "Attribution Link" as attribution_link,
        "President" as president,
        "Vice President" as vice_president,
        "Govt Intervention" as govt_intervention
    from {{ ref('raw_government_bailout_stimulus') }}
),

cleaned_data as (
    select
        year,
        originating_crisis,
        case
            when policy_date = '' or policy_date is null then null
            else cast(policy_date as date)
        end as policy_date, -- Convert to date, handle nulls and empty strings
        policy_title,
        policy_description,
        federal_policy_number,
        case
            when attribution_link is not null then split_part(attribution_link, ' ', 1) -- Keep first link
            else null
        end as attribution_link,
        president,
        vice_president,
        case
            when govt_intervention = 'True' then true
            when govt_intervention = 'False' then false
            else false
        end as govt_intervention -- Convert to boolean
    from raw_data
)

select * from cleaned_data order by year