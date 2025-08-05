-- busca interferencias dentro de um polígono no subsistema

-- 05/08/2025 - Não vou utilizar no momento, vou fazer pelo sql server
select _hg.objectid, _hg.cod_plan, count(_sub.id) as qtd_pocos
from hidrogeo_fraturado _hg
left join subterranea_sync _sub on ST_Contains(_hg.shape, _sub.int_shape)
where _hg.objectid = 1 and _sub.tp_id = 2
group by _hg.objectid, _hg.cod_plan

-- busca o codplan e nome do subsistema específico do objectid = 1, por exemplo
select _hg.objectid, _hg.cod_plan, _hg.sistema, _hg.subsistema 
from hidrogeo_fraturado _hg
where _hg.objectid = 1

-- busca uma interferência por processo
select * from subterranea_sync _sub
where _sub.int_processo like '%197000156/2007%'