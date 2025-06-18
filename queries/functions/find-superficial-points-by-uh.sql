/**
 Pesquisa pontos utilizando o número da uh e converte os atributos para utilizar no projeto supeficial. Estes
 atributos serão modificados os nomes ao atualizar o projeto superficial.

 */

CREATE OR REPLACE FUNCTION find_superficial_points_by_uh (uh_codigo int) returns table (
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
  -- busca valor no json dt_demanda, neste valor usa-se o replace para retirar aspas duplas
  REPLACE((dt_demanda::json #> '{demandas,0,vazao}')::text, '"', '') as Q_SEG_JAN,
  REPLACE((dt_demanda::json #> '{demandas,1,vazao}')::text, '"', '') as Q_SEG_FEV,
  REPLACE((dt_demanda::json #> '{demandas,2,vazao}')::text, '"', '') as Q_SEG_MAR,
  REPLACE((dt_demanda::json #> '{demandas,3,vazao}')::text, '"', '') as Q_SEG_ABR,
  REPLACE((dt_demanda::json #> '{demandas,4,vazao}')::text, '"', '') as Q_SEG_MAI,
  REPLACE((dt_demanda::json #> '{demandas,5,vazao}')::text, '"', '') as Q_SEG_JUN,
  REPLACE((dt_demanda::json #> '{demandas,6,vazao}')::text, '"', '') as Q_SEG_JUL,
  REPLACE((dt_demanda::json #> '{demandas,7,vazao}')::text, '"', '') as Q_SEG_AGO,
  REPLACE((dt_demanda::json #> '{demandas,8,vazao}')::text, '"', '') as Q_SEG_SET,
  REPLACE((dt_demanda::json #> '{demandas,9,vazao}')::text, '"', '') as Q_SEG_OUT,
  REPLACE((dt_demanda::json #> '{demandas,10,vazao}')::text, '"', '') as Q_SEG_NOV,
  REPLACE((dt_demanda::json #> '{demandas,11,vazao}')::text, '"', '') as Q_SEG_DEZ,
  int_latitude Latitude,
  int_longitude Longitude
FROM superficial_sync sup where sup.uh_codigo = find_superficial_points_by_uh.uh_codigo
$$;