


CREATE OR REPLACE FUNCTION find_points_inside_polygon (polygon text) RETURNS TABLE (
  subterranea JSONB,
  superficial JSONB,
  barragem JSONB,
  lancamento_efluentes JSONB,
  lancamento_pluviais JSONB
) AS $$

BEGIN
  RETURN QUERY
  WITH subterranea_data AS (
    SELECT
      *
    FROM
      subterranea_sync
    WHERE
      ST_Contains(polygon, int_shape)
  ),
  superficial_data AS (
    SELECT
       *
    FROM
      superficial_sync
    WHERE
      ST_Contains(polygon, int_shape)
  ),
  barragem_data AS (
    SELECT
       *
    FROM
      barragem_sync 
    WHERE
      ST_Contains(polygon, int_shape)
  ),
  lancamento_efluentes_data AS (
    SELECT
       *
    FROM
      lancamento_efluentes_sync
    WHERE
      ST_Contains(polygon, int_shape)
  ),
  lancamento_pluviais_data AS (
    SELECT
       *
    FROM
      lancamento_pluviais_sync
    WHERE
      ST_Contains(polygon, int_shape)
  )
  SELECT
    (SELECT jsonb_agg(_sub)
     FROM subterranea_data _sub) AS subterranea,
    (SELECT jsonb_agg(_sup)
     FROM superficial_data _sup) AS subterranea,
     (SELECT jsonb_agg(_bar)
     FROM barragem_data _bar) AS barragem,
     (SELECT jsonb_agg(_lan_eflu)
     FROM lancamento_efluentes_data _lan_eflu) AS lancamento_efluentes,
     (SELECT jsonb_agg(_lan_plu)
     FROM lancamento_pluviais_data _lan_plu) AS lancamento_pluviais;
     
END;
$$ LANGUAGE plpgsql;


-- Teste de função
SELECT
 *
from
find_points_inside_polygon('SRID=4674;POLYGON((-47.688280935546885 -15.523548585858514,-47.47816741015626 -15.583083716212162,-47.65120207812501 -15.647891240856955,-47.688280935546885 -15.523548585858514))');

