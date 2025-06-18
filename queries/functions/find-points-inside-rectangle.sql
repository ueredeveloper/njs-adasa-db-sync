
CREATE
OR REPLACE FUNCTION find_points_inside_rectangle (
  xmin double precision,
  ymin double precision,
  xmax double precision,
  ymax double precision
) RETURNS TABLE (
  subterranea JSONB,
  superficial JSONB,
  barragem JSONB,
  lancamento_efluentes JSONB,
  lancamento_pluviais JSONB
) AS $$
DECLARE
  envelope geometry := ST_MakeEnvelope(xmin, ymin, xmax, ymax, 4674);
BEGIN
  RETURN QUERY
  WITH subterranea_data AS (
    SELECT
      *
    FROM
      subterranea_sync
    WHERE
      ST_Contains(envelope, int_shape)
  ),
  superficial_data AS (
    SELECT
       *
    FROM
      superficial_sync
    WHERE
      ST_Contains(envelope, int_shape)
  ),
  barragem_data AS (
    SELECT
       *
    FROM
      barragem_sync
    WHERE
      ST_Contains(envelope, int_shape)
  ),
  lancamento_efluentes_data AS (
    SELECT
       *
    FROM
      lancamento_efluentes_sync
    WHERE
      ST_Contains(envelope, int_shape)
  ),
  lancamento_pluviais_data AS (
    SELECT
       *
    FROM
      lancamento_pluviais_sync
    WHERE
      ST_Contains(envelope, int_shape)
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


--Teste da função

SELECT
 *
from
find_points_inside_rectangle(
-48.03245315789265,
-15.686953346458246,
-47.94490585564655,
-15.658855927081074
);