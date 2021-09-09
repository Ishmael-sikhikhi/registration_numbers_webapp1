create table towns(
town_id text not null primary key,
town_name text not null
);

create table regNum (
	id serial not null primary key,
	reg_num text not null,
	town_id char(2),
	foreign key (towns_id) references towns(town_id)
);

alter table towns add constraint uniq_desc_constraint unique(town_name);