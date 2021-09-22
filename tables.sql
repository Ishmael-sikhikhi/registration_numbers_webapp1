create table towns(
id serial primary key not null,
town_name varchar(20) not null,
town_str text not null
);

create table regNum (
	id serial not null primary key,
	reg_num text not null,
	town_id int,
	foreign key (town_id) references towns(id)
);

alter table towns add constraint uniq_desc_constraint unique(town_str);