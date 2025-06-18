CREATE OR REPLACE FUNCTION find_points_inside_circle(center TEXT, radius INT)
RETURNS TABLE (
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
      ST_DWithin(
        ST_GeographyFromText(ST_AsText(int_shape)),
        ST_GeogFromText(center),
        radius
      )
  ),
  superficial_data AS (
    SELECT
      *
    FROM
      superficial_sync
    WHERE
      ST_DWithin(
        ST_GeographyFromText(ST_AsText(int_shape)),
        ST_GeogFromText(center),
        radius
      )
  ),
  barragem_data AS (
    SELECT
      *
    FROM
      barragem_sync
    WHERE
      ST_DWithin(
        ST_GeographyFromText(ST_AsText(int_shape)),
        ST_GeogFromText(center),
        radius
      )
  ),
  lancamento_efluentes_data AS (
    SELECT
      *
    FROM
      lancamento_efluentes_sync
    WHERE
      ST_DWithin(
        ST_GeographyFromText(ST_AsText(int_shape)),
        ST_GeogFromText(center),
        radius
      )
  ),
  lancamento_pluviais_data AS (
    SELECT
      *
    FROM
      lancamento_pluviais_sync
    WHERE
      ST_DWithin(
        ST_GeographyFromText(ST_AsText(int_shape)),
        ST_GeogFromText(center),
        radius
      )
  )
  SELECT
    (SELECT jsonb_agg(_sub) FROM subterranea_data _sub) AS subterranea,
    (SELECT jsonb_agg(_sup) FROM superficial_data _sup) AS superficial,
    (SELECT jsonb_agg(_bar) FROM barragem_data _bar) AS barragem,
    (SELECT jsonb_agg(_lan_eflu) FROM lancamento_efluentes_data _lan_eflu) AS lancamento_efluentes,
    (SELECT jsonb_agg(_lan_plu) FROM lancamento_pluviais_data _lan_plu) AS lancamento_pluviais;
END;
$$ LANGUAGE plpgsql;


-- Testando a função 

SELECT * 
FROM find_points_inside_circle(
    'POINT(-47.771528841602674 -15.665510397630516)', 
    2921
);

