{{ config(
    materialized='incremental'
    , incremental_strategy='append'
    , on_schema_change='fail'
    , properties={
      'format': "'PARQUET'"
      , 'partitioning': "array['current_year']"
    }
    , enabled=false
) }}

with
    -- After the model is materialized it can reference itself
    {% if is_incremental() %}

        yesterday as (
            select *
            from {{ this }}
            where current_year = {{ var('current_year') }} - 1
        )

    -- In this case the model does not exist in the database yet.
    -- It can't reference itself, so we are using just some null values
    -- to represent the first time the model is being run
    {% else %}

        yesterday as (
            select
                cast(null as varchar) as actor
                , cast(null as varchar) as actor_id
                , cast(null as
                    array(
                        row(
                            year integer,
                            film varchar,
                            votes integer,
                            rating double,
                            film_id varchar
                        )
                    )
                ) as films
                , cast(null as varchar) as quality_class
                , cast(null as integer) as current_year
        )

    {% endif %}

    , today as (
        select *
        from {{ ref('stg_actor_films') }}
        where year = {{ var('current_year') }}
    )

select
    coalesce(y.actor, t.actor) as actor
    , coalesce(y.actor_id, t.actor_id) as actor_id
    , case
        when y.films is null
            then
                array_agg(
                    cast(
                        row(
                            t.year
                            , t.film
                            , t.votes
                            , t.rating
                            , t.film_id
                        -- for some weird reason in the dbt + trino integration
                        -- we have to explictly cast the array here
                        ) as row(
                            year integer
                            , film varchar
                            , votes integer
                            , rating double
                            , film_id varchar
                        )
                    )
                )
        when t.year is not null
            then
                y.films || array_agg(
                    cast(
                        row(
                            t.year
                            , t.film
                            , t.votes
                            , t.rating
                            , t.film_id
                        -- for some weird reason in the dbt + trino integration
                        -- we have to explictly cast the array here
                        ) as row(
                            year integer
                            , film varchar
                            , votes integer
                            , rating double
                            , film_id varchar
                        )
                    )
                )
        else y.films
    end as films
    , case
        when avg(t.rating) is not null
            then (
                case
                    when avg(t.rating) > 8
                        then 'star'
                    when avg(t.rating) > 7
                        then 'good'
                    when avg(t.rating) > 6
                        then 'average'
                    else 'bad'
                end
            )
        else y.quality_class
    end as quality_class
    , coalesce(t.actor_id is not null, false) as is_active
    , coalesce(t.year, y.current_year + 1) as current_year
from yesterday as y
full outer join today as t on y.actor_id = t.actor_id
group by
    y.actor
    , t.actor
    , y.actor_id
    , t.actor_id
    , y.films
    , t.year
    , y.current_year
    , y.quality_class
