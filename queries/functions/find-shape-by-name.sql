/**
    Busca shapes pelo nome no banco de dados
    */

CREATE OR REPLACE FUNCTION find_shape_by_name (shapeName text)
    RETURNS jsonb AS
$$
BEGIN
    IF shapeName = 'bacias_hidrograficas' THEN
        RETURN (SELECT jsonb_agg(jsonb_build_object('shape', t.*)) FROM bacias_hidrograficas t);
    ELSIF shapeName = 'unidades_hidrograficas' THEN
        RETURN (SELECT jsonb_agg(jsonb_build_object('shape',  t.*)) FROM unidades_hidrograficas t);
    ELSIF shapeName = 'hidrogeo_fraturado' THEN
        RETURN (SELECT jsonb_agg(jsonb_build_object('shape',  t.*)) FROM hidrogeo_fraturado t);
    ELSIF shapeName = 'hidrogeo_poroso' THEN
        RETURN (SELECT jsonb_agg(jsonb_build_object('shape',  t.*)) FROM hidrogeo_poroso t);
    ELSE
        RAISE EXCEPTION 'Nome da shape inválido!!!';
    END IF;
END;
$$ LANGUAGE plpgsql;