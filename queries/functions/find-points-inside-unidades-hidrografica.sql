
CREATE OR REPLACE FUNCTION find_points_inside_unidade_hidrografica (shapeCode bigint) RETURNS TABLE (
  subterranea JSONB,
  superficial JSONB,
  barragem JSONB,
  lancamento_efluentes JSONB,
  lancamento_pluviais JSONB
) AS $$
DECLARE
    shape geometry;
BEGIN
	SELECT uh.shape INTO shape
		FROM unidades_hidrograficas uh
		WHERE uh.uh_codigo = shapeCode;	
  RETURN QUERY
  WITH subterranea_data AS (
    SELECT
      *
    FROM
      subterranea_sync sub
    WHERE
      ST_Contains(shape, sub.int_shape)
  ),
  superficial_data AS (
    SELECT
       *
    FROM
      superficial_sync sup
    WHERE
      ST_Contains(shape, sup.int_shape)
  ),
  barragem_data AS (
    SELECT
       *
    FROM
      barragem_sync bar
    WHERE
      ST_Contains(shape, bar.int_shape)
  ),
  lancamento_efluentes_data AS (
    SELECT
       *
    FROM
      lancamento_efluentes_sync efl
    WHERE
      ST_Contains(shape, efl.int_shape)
  ),
  lancamento_pluviais_data AS (
    SELECT
       *
    FROM
      lancamento_pluviais_sync plu
    WHERE
      ST_Contains(shape, plu.int_shape)
  )
  SELECT
    (SELECT jsonb_agg(_sub)
     FROM subterranea_data _sub) AS subterranea,
    (SELECT jsonb_agg(_sup)
     FROM superficial_data _sup) AS superficial,
     (SELECT jsonb_agg(_bar)
     FROM barragem_data _bar) AS barragem,
     (SELECT jsonb_agg(_lan_eflu)
     FROM lancamento_efluentes_data _lan_eflu) AS lancamento_efluentes,
     (SELECT jsonb_agg(_lan_plu)
     FROM lancamento_pluviais_data _lan_plu) AS lancamento_pluviais;
     
END;
$$ LANGUAGE plpgsql;