/* criação de uma tabela para armazenar a shape com info e polígon, por exemplo, hidrogeo_fraturado

    É preciso criar um tipo de dado antes de criar a função:
        CREATE TYPE hg_info_shape AS (info json, shape geometry);
 */
 
CREATE
OR REPLACE FUNCTION find_all_points_in_a_subsystem (point text, tp_id integer) RETURNS TABLE (
  subterranea JSONB,
  superficial JSONB,
  barragem JSONB,
  lancamento_efluentes JSONB,
  lancamento_pluviais JSONB,
  hidrogeo JSONB
) AS $$
declare
       hg_info_shape hg_info_shape;
BEGIN
  if (find_all_points_in_a_subsystem.tp_id = 1) then
            select 
                json_build_object(
                    'uh_codigo', uh_codigo, 
                    'uh_label', uh_label,
                    'uh_nome', uh_nome,
                    'bacia_nome', bacia_nome,
                    'sistema', sistema,
                    'cod_plan', cod_plan,
                    're_cm_ano', re_cm_ano
                ) info, hp.shape shape into hg_info_shape.info, hg_info_shape.shape from hidrogeo_poroso hp where st_contains(hp.shape, point);
        else
            select 
                json_build_object(
                            'uh_codigo', uh_codigo,
                            'uh_label', uh_label,
                            'uh_nome', uh_nome,
                            'bacia_nome', bacia_nome,
                            'sistema', sistema,
                            'subsistema', subsistema,
                            'cod_plan', cod_plan,
                            're_cm_ano', re_cm_an
                ) info, hf.shape shape into hg_info_shape.info, hg_info_shape.shape from hidrogeo_fraturado hf where st_contains(hf.shape, point);
        end if;
  RETURN QUERY
  WITH subterranea_data AS (
      -- filtra por tipo de poço e exclui situação de processos 'em análise', 'obturado' e 'indeferidos'
      select * from subterranea _sub where st_contains(hg_info_shape.shape, _sub.int_shape) and _sub.tp_id = find_all_points_in_a_subsystem.tp_id and _sub.sp_id not in (2,7,9)
  ),
  superficial_data AS (
    
      select * from superficial _sup where st_contains(hg_info_shape.shape, _sup.int_shape) and _sup.sp_id not in (2,7,9)

  ),
  barragem_data AS (
    
      select * from barragem _bar where st_contains(hg_info_shape.shape, _bar.int_shape)
  ),
  lancamento_efluentes_data AS (
    
      select * from lancamento_efluentes _efl where st_contains(hg_info_shape.shape, _efl.int_shape)
  ),
  lancamento_pluviais_data AS (
    
      select * from lancamento_pluviais _plu where st_contains(hg_info_shape.shape, _plu.int_shape)
  )
  SELECT
    (SELECT jsonb_agg(_sub)
     FROM subterranea_data _sub
    ) AS subterranea,
    (SELECT jsonb_agg(_sup)
     FROM superficial_data _sup) AS subterranea,
    (SELECT jsonb_agg(_bar)
     FROM barragem_data _bar) AS barragem,
    (SELECT jsonb_agg(_lan_eflu)
     FROM lancamento_efluentes_data _lan_eflu) AS lancamento_efluentes,
    (SELECT jsonb_agg(_lan_plu)
     FROM lancamento_pluviais_data _lan_plu) AS lancamento_pluviais,
    (SELECT jsonb_agg(hg_info_shape)) AS hidrogeo;
	 
END;
$$ LANGUAGE plpgsql;

-- TESTE DE FUNÇÃO
select * from find_all_points_in_a_subsystem('SRID=4674;POINT(-47.5917014 -15.6913214)', 2)

