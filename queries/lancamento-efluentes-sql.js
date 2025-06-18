
exports.lancamento_efluentes =  function (less, grater){
    return `
    USE SRH;
        SELECT 
        /* usuário */ 
        U.ID_USUARIO AS us_id,
        U.NOME AS us_nome,
        U.CPF_CNPJ AS us_cpf_cnpj,
        U.EMAIL AS us_email,
        U.CEP AS us_cep,
        U.ENDERECO AS us_endereco,
        U.CAIXA_POSTAL AS us_caixa_postal,
        U.BAIRRO AS us_bairro,
        U.TELEFONE_1 AS us_telefone_1,
        U.TELEFONE_2 AS us_telefone_2, 

        /* endereço */ 
        E.ID_EMPREENDIMENTO AS emp_id,
        E.ENDERECO AS emp_endereco, 
        /* interferência */ 
        I.NUM_PROCESSO AS int_processo,
        I.ID_INTERFERENCIA AS int_id,
        I.NUM_ATO AS int_num_ato,
        I.LATITUDE AS int_latitude,
        I.LONGITUDE AS int_longitude,
        I.SHAPE AS int_shape,
        I.DT_PUBLICACAO AS int_data_publicacao,
        I.DT_VENCIMENTO AS int_data_vencimento, 

        /* tipo interferência */ 
        TI.ID_TIPO_INTERFERENCIA AS ti_id,
        TI.DESCRICAO AS ti_descricao, 
        /* situação: arquivado, análise... */ 
        SP.ID_SITUACAO AS sp_id,
        SP.DESCRICAO AS sp_descricao, 
        /* tipo outorga: direito, prévia, registro */ 
        TIPO_OUT.ID_TIPO_OUTORGA AS to_id,
        TIPO_OUT.DESCRICAO AS to_descricao, /* bacia **/ 
        BH.OBJECTID_1 AS bh_id,
        BH.BACIA_NOME AS bh_nome, 
        /* uh */ 
        UH.OBJECTID AS uh_id,
        UH.UH_NOME AS uh_nome,
        /* lançamento */
        LANC.NOME_MANANCIAL AS nome_manancial,

        LANC.CLASSE_MANANCIAL AS classe_manancial,
        LANC.TIPO_TRATAMENTO AS tipo_tratamento,
        LANC.QPROJETO AS q_projeto,
        LANC.QMEDIA AS q_media,
        LANC.AREA_ATENDIMENTO AS area_atendimento

        FROM [gisadmin].[LANCAMENTO_EFLUENTES2] AS LANC
        LEFT JOIN [gisadmin].[INTERFERENCIA] AS I ON LANC.[ID_INTERFERENCIA] = I.[ID_INTERFERENCIA]
        LEFT JOIN [gisadmin].[EMPREENDIMENTO] AS E ON E.[ID_EMPREENDIMENTO] = I.[ID_EMPREENDIMENTO]
        LEFT JOIN [gisadmin].[USUARIO] AS U ON U.[ID_USUARIO] = E.[ID_USUARIO]
        LEFT JOIN [gisadmin].[TIPO_INTERFERENCIA] AS TI ON I.[ID_TIPO_INTERFERENCIA] = TI.[ID_TIPO_INTERFERENCIA]
        LEFT JOIN [gisadmin].[SITUACAO_PROCESSO] AS SP ON I.[ID_SITUACAO] = SP.[ID_SITUACAO]
        LEFT JOIN [gisadmin].[UNIDADES_HIDROGRAFICAS] AS UH ON I.[ID_UH] = UH.[OBJECTID]
        LEFT JOIN [gisadmin].[BACIAS_HIDROGRAFICAS] AS BH ON UH.[ID_BACIA] = BH.[OBJECTID_1]
        LEFT JOIN [gisadmin].[TIPO_OUTORGA] TIPO_OUT ON TIPO_OUT.ID_TIPO_OUTORGA = I.ID_TIPO_OUTORGA
        /* CONDITION */
        WHERE I.ID_INTERFERENCIA >= ${less} AND I.ID_INTERFERENCIA <= ${grater} 

`
}