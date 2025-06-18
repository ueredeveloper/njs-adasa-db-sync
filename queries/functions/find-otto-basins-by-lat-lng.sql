/**
Cria função que busca por uma coordenada o polígono em que esta coordenada está contida e depois os polígonos
que se assemelham nos parâmetros cobacia e cocursodag.
Obs: a comparação cobacia é entre strings (cobacia>=...)


Cria uma classe com atributos e geometry.
  --CREATE TYPE otto_basin_class AS (attributes json, geometry json);
Se preciso deletar pra criar a função novamente
  --drop function find_otto_basins_by_lat_lng(double precision, double precision);
Se preciso recriar a classe
  --DROP TYPE IF EXISTS otto_basin_class;
Teste:
  --select * from find_otto_basins_by_lat_lng (-15.775139, -47.939599)

*/

CREATE OR REPLACE FUNCTION find_otto_basins_by_lat_lng (
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION
) 
RETURNS SETOF otto_basin_class AS $$

DECLARE
  v_cobacia TEXT;
  v_cocursodag TEXT;
  v_uh_rotulo TEXT;
  
BEGIN
  -- Buscar cobacia e cocursodag da bacia que contém o ponto
  SELECT cobacia, cocursodag, uh_rotulo
  INTO v_cobacia, v_cocursodag, v_uh_rotulo
  FROM otto_bacias _otto
  WHERE ST_Contains(
          _otto.geometry,
          ST_SetSRID(ST_MakePoint(longitude, latitude), 4674)
        )
  LIMIT 1;

  -- Retornar todas as bacias com os atributos e geometria
  RETURN QUERY
  SELECT 
    json_build_object(
      'objectid', objectid,
      'classe', classe,
      'cobacia', cobacia,
      'cocursodag', cocursodag,
      'cotrecho', cotrecho,
      'dra_pk', dra_pk,
      'dsversao', dsversao,
      'fid_1', fid_1,
      'fid_geoft_', fid_geoft_,
      'idbacia', idbacia,
      'nuareacont', nuareacont,
      'nunivotto', nunivotto,
      'nunivotto1', nunivotto1,
      'nunivotto2', nunivotto2,
      'nunivotto3', nunivotto3,
      'nunivotto4', nunivotto4,
      'nunivotto5', nunivotto5,
      'nunivotto6', nunivotto6,
      'nuordemcda', nuordemcda,
      'shape__are', shape__are,
      'shape_area', shape_area,
      'shape__len', shape__len,
      'shape_length', shape_length,
      'st_area_ge', st_area_ge,
      'st_perimet', st_perimet,
      'uh_nome', uh_nome,
      'uh_rotulo', uh_rotulo
    ) AS attributes,
    ST_AsGeoJSON(geometry)::json AS geometry
  FROM otto_bacias _otto
  WHERE 
    -- Não é preciso converter para número, a comparação é entre strings mesmo
    _otto.cobacia >= v_cobacia
	AND _otto.cocursodag LIKE v_cocursodag || '%'
    AND _otto.uh_rotulo = v_uh_rotulo;
    
END;

$$ LANGUAGE plpgsql;

/* 16/06/2025
 - Tambem foi criado para melhorar a velocidade das pesquisas:
    CREATE INDEX idx_otto_bacias_geom ON otto_bacias USING GIST (geometry);

- Índices nos campos de filtros

CREATE INDEX idx_otto_cobacia_numeric ON otto_bacias ((cobacia::NUMERIC));
CREATE INDEX idx_otto_uh_rotulo_numeric ON otto_bacias ((uh_rotulo::NUMERIC));
CREATE INDEX idx_otto_cocursodag ON otto_bacias (cocursodag);



*/