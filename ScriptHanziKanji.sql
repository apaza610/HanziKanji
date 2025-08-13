-- use hanzi_db;

drop table hanzi_list;

create table hanzi_list(
	hanzi_glyph		nchar(2) primary key unique,
	hanzi_traduc	nvarchar(30),
	hanzi_mnemon	nvarchar(500)
);

desc hanzi_list;

insert into hanzi_list (hanzi_glyph, hanzi_traduc, hanzi_mnemon) values ('爱','amor','es los mas super duper');
insert into hanzi_list (hanzi_glyph, hanzi_traduc, hanzi_mnemon) values ('你','tu','si ni usando anzuelo y mosca puedes el problema eres TU');
insert into hanzi_list values ('他','el','si el es el');

select * from hanzi_list ;

select * from hanzi_list where hanzi_glyph like '你';

update hanzi_list set hanzi_mnemon = 'olasss' where hanzi_glyph ='今';