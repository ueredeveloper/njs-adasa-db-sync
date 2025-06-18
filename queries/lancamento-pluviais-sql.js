// A coluna observações no banco precisa ter 500 caracteres ou mais


exports.lancamento_pluviais =  function (less, grater){
    return `
    use SRH;
        SELECT 
        _us.ID_USUARIO AS us_id,
        _us.NOME AS us_nome,
        _us.CPF_CNPJ AS us_cpf_cnpj,
        _us.EMAIL AS us_email,
        _us.CEP AS us_cep,
        _us.ENDERECO AS us_endereco,
        _us.CAIXA_POSTAL AS us_caixa_postal,
        _us.BAIRRO AS us_bairro,
        _us.TELEFONE_1 AS us_telefone_1,
        _us.TELEFONE_2 AS us_telefone_2,

        /* endereço */
        _end.ENDERECO AS end_endereco,
        _end.CIDADE AS end_cidade,
        /* tipo ato */
        _ta.ID_TIPO_ATO AS ta_id,
        _ta.DESCRICAO AS ta_descricao,
        /* endereço */ 
        _end.ID_EMPREENDIMENTO AS emp_id,
        _end.ENDERECO AS emp_endereco, 
        /* tipo interferencia */
        _ti.ID_TIPO_INTERFERENCIA AS ti_id,
        _ti.DESCRICAO AS ti_descricao, 
        /* situação: arquivado, anális_end... */ 
        _sp.ID_SITUACAO AS sp_id,
        _sp.DESCRICAO AS sp_descricao, 

        /* tipo outorga: direito, prévia, registro */ 
        _to.ID_TIPO_OUTORGA AS to_id,
        _to.DESCRICAO AS to_descricao, /* bacia **/ 
        _bh.OBJECTID_1 AS bh_id,
        _bh.BACIA_NOME AS bh_nome, 
        /* uh */ 
        _uh.OBJECTID AS uh_id,
        _uh.UH_NOME AS uh_nome,
        /* interferência */ 
        _int.ID_INTERFERENCIA AS int_id,
        _int.NUM_PROCESSO AS int_processo,
        _int.NUM_ATO AS int_num_ato,
        _int.LATITUDE AS int_latitude,

        _int.LONGITUDE AS int_longitude,
        _int.SHAPE AS int_shape,
        _int.DT_PUBLICACAO AS int_data_publicacao,
        _int.DT_VENCIMENTO AS int_data_vencimento, 
        _int.ID_EMPREENDIMENTO AS int_emp_id,
        _int.ID_UH AS int_uh,
        _int.ID_TIPO_INTERFERENCIA AS int_ti,
        _int.ID_TIPO_OUTORGA AS int_to,
        _int.ID_TIPO_ATO AS int_ta,
        _int.ID_SITUACAO AS int_situacao_id,

        _int.VERIFICADO AS int_verificado,
        _int.OBSERVACAO AS int_observacao,
        _int.ID_INTERF_ANTIGO AS int_int_antigo,
        _int.NOME AS int_nome
  
        FROM [SRH].[gisadmin].[INTERFERENCIA] _int

        LEFT JOIN [gisadmin].[EMPREENDIMENTO] AS _end ON _end.[ID_EMPREENDIMENTO] = _int.[ID_EMPREENDIMENTO]
        LEFT JOIN [gisadmin].[USUARIO] AS _us ON _us.[ID_USUARIO] = _end.[ID_USUARIO]
        LEFT JOIN [gisadmin].[TIPO_INTERFERENCIA] AS _ti ON _int.[ID_TIPO_INTERFERENCIA] = _ti.[ID_TIPO_INTERFERENCIA]
        LEFT JOIN [gisadmin].[SITUACAO_PROCESSO] AS _sp ON _int.[ID_SITUACAO] = _sp.[ID_SITUACAO]
        LEFT JOIN [gisadmin].[UNIDADES_HIDROGRAFICAS] AS _uh ON _int.[ID_UH] = _uh.[OBJECTID]
        LEFT JOIN [gisadmin].[BACIAS_HIDROGRAFICAS] AS _bh ON _uh.[ID_BACIA] = _bh.[OBJECTID_1]
        LEFT JOIN [gisadmin].[TIPO_OUTORGA] _to ON _to.ID_TIPO_OUTORGA = _int.ID_TIPO_OUTORGA
        LEFT JOIN [gisadmin].[TIPO_ATO] _ta ON _ta.[ID_TIPO_ATO] = _int.ID_TIPO_ATO
        /* CONDITION */
        WHERE _int.ID_TIPO_INTERFERENCIA = 3 AND _int.ID_INTERFERENCIA >= ${less} AND _int.ID_INTERFERENCIA <= ${grater} 
`
}