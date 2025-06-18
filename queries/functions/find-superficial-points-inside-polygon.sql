/**
    Esta função foi criada com estes atributos para atender o projeto superficial. Na atualização do projeto pode
    ser feito uma função que atenda novos atributos etc.
    */
    
CREATE OR REPLACE FUNCTION find_superficial_points_inside_polygon (polygon text) returns table (
  NUM_PROCES text,
  USUARIO text,
  CPF_CNPJ text,
  LOGRADOURO text,
  Q_SEG_JAN text,
  Q_SEG_FEV text,
  Q_SEG_MAR text,
  Q_SEG_ABR text,
  Q_SEG_MAI text,
  Q_SEG_JUN text,
  Q_SEG_JUL text,
  Q_SEG_AGO text,
  Q_SEG_SET text,
  Q_SEG_OUT text,
  Q_SEG_NOV text,
  Q_SEG_DEZ text,
  Latitude text,
  Longitude text
) language sql as $$
select 
  int_processo NUM_PROCES,
  us_nome USUARIO,
  us_cpf_cnpj CPF_CNPJ,
  emp_endereco LOGRADOURO,
  REPLACE((dt_demanda::json #> '{demandas,0,vazao,0}')::text, '"', '') as Q_SEG_JAN,
  REPLACE((dt_demanda::json #> '{demandas,1,vazao,0}')::text, '"', '') as Q_SEG_FEV,
  REPLACE((dt_demanda::json #> '{demandas,2,vazao,0}')::text, '"', '') as Q_SEG_MAR,
  REPLACE((dt_demanda::json #> '{demandas,3,vazao,0}')::text, '"', '') as Q_SEG_ABR,
  REPLACE((dt_demanda::json #> '{demandas,4,vazao,0}')::text, '"', '') as Q_SEG_MAI,
  REPLACE((dt_demanda::json #> '{demandas,5,vazao,0}')::text, '"', '') as Q_SEG_JUN,
  REPLACE((dt_demanda::json #> '{demandas,6,vazao,0}')::text, '"', '') as Q_SEG_JUL,
  REPLACE((dt_demanda::json #> '{demandas,7,vazao,0}')::text, '"', '') as Q_SEG_AGO,
  REPLACE((dt_demanda::json #> '{demandas,8,vazao,0}')::text, '"', '') as Q_SEG_SET,
  REPLACE((dt_demanda::json #> '{demandas,9,vazao,0}')::text, '"', '') as Q_SEG_OUT,
  REPLACE((dt_demanda::json #> '{demandas,10,vazao,0}')::text, '"', '') as Q_SEG_NOV,
  REPLACE((dt_demanda::json #> '{demandas,11,vazao,0}')::text, '"', '') as Q_SEG_DEZ,
  int_latitude Latitude,
  int_longitude Longitude
from superficial_sync where ST_Contains(find_superficial_points_inside_polygon.polygon, int_shape)
$$;

