drop schema if exists netflix cascade;
create schema if not exists netflix;

create table netflix.peliculas_raw(
	show_id text,
	type text,
	title text,
	director text,
	actors text,
	country text,
	date_added text,
	release_year numeric,
	rating text,
	duration text,
	listed_in text,
	description text
	);
	
create domain netflix.dom_text_clean as text
  check (value is null or length(btrim(value) > 0));

  CREATE DOMAIN netflix.email AS TEXT
CHECK (VALUE ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

  copy netflix.peliculas_raw
  from '/backups/netflix_titles.csv'
  csv header
  delimiter ','
  escape '\';
  -- quote '"'

  select count(*) from netflix.peliculas_raw;

  select * from netflix.peliculas_raw limit 5;

SELECT count(DISTINCT director)
FROM netflix.peliculas_raw;



create table netflix.dim_type(
id serial primary key,
value text unique);

create table netflix.dim_rating(
id serial primary key,
value text unique);

with cleaned as(
	select
	    NULLIF(regexp_replace(lower(coalesce(type,'')),     '\s+', ' ', 'g'), '')     AS type
	from netflix.peliculas_raw
	)
	insert into netflix.dim_type(value)
	select distinct type from cleaned where type is not null
	on conflict (value) do nothing;
	



with cleaned as(
	select
	    NULLIF(regexp_replace(lower(coalesce(rating,'')),     '\s+', ' ', 'g'), '')     AS rating
	from netflix.peliculas_raw
	)
	insert into netflix.dim_rating(value)
	select distinct rating from cleaned where rating is not null
	on conflict (value) do nothing;
	
select * from netflix.dim_type;
select * from netflix.dim_rating;

create table netflix.peliculas(
	id varchar(6) primary key,
	tipo text,
	titulo text,
	director text,
	actores text,
	pais text,
	date_added text,
	release_year numeric,
	rating text,
	duration text,
	listed_in text,
	description text,
	type_id int,
	rating_id int
);

insert into netflix.peliculas (
	id ,
	tipo ,
	titulo ,
	director ,
	actores ,
	pais ,
	date_added ,
	release_year ,
	rating ,
	duration ,
	listed_in ,
	description )
select 
	show_id as id,
	type as tipo,
	title as titulo,
	director ,
	actors as actores,
	country as pais,
	date_added ,
	release_year ,
	rating ,
	duration ,
	listed_in ,
	description 
from netflix.peliculas_raw;

select * from netflix.peliculas;

update netflix.peliculas p
set type_id = dt.id
from netflix.dim_type dt
where lower(tipo) = lower(dt.value);

update netflix.peliculas p
set rating_id = dr.id
from netflix.dim_rating dr
where lower(rating) = lower(dr.value);

select * from netflix.dim_type;
select * from netflix.dim_rating

ALTER TABLE netflix.peliculas
    ADD CONSTRAINT fk_type FOREIGN KEY (type_id) REFERENCES netflix.dim_type(id),
    ADD CONSTRAINT fk_rating FOREIGN KEY (rating_id) REFERENCES netflix.dim_rating(id);

ALTER TABLE netflix.peliculas
    DROP COLUMN tipo,
    DROP COLUMN rating;

select count(*)
from netflix.peliculas p
left join netflix.dim_type t
on p.type_id = t.id
where p.type_id is null;

select count(*)
from netflix.peliculas p
left join netflix.dim_rating r
on p.type_id = r.id
where p.type_id is null;


-- 1
