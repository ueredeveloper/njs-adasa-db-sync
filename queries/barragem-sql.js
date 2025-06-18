exports.dis_bar_query = function (less, grater){
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
	TIPO_OUT.DESCRICAO AS to_descricao,
    BH.OBJECTID_1 AS bh_id,
    BH.BACIA_NOME AS bh_nome, 
    /* uh */ 
    UH.OBJECTID AS uh_id,
    UH.UH_NOME AS uh_nome,
    /* barragem */
    BAR.RIO_BARRAGEM AS rio_barragem,
    BAR.ID_DOMINIO_BARRAGEM AS id_dominio_barragem,
    BAR.NOME_BARRAGEM AS nome_barragem,
    BAR.NOME_BARRAGEM2 AS nome_barragem2,
    BAR.DATA_INICIO AS data_inicio,
    BAR.DATA_FIM AS data_fim,
    BAR.VOLUME_HM3 AS volume_hm3,
    BAR.AREA_INUNDADA_HA AS area_inundada_ha,
    BAR.ALTURA_M AS altura_m,
    BAR.LARGURA_CRISTA_M AS largura_crista_m,
    BAR.COMPRIMENTO_CRISTA_M AS comprimento_crista_m,
    BAR.VAZAO_REMANESCENTE_LS AS vazao_remanescente_ls,
    BAR.AREA_CONTRIBUICAO AS area_contribuicao,
    BAR.TIPO_MATERIAL AS tipo_material,
    BAR.TIPO_ESTRUTURAL AS tipo_estrutural,
    BAR.VAZAO_ORGAO_EXTRAVASOR_LS AS vazao_orgao_extravasor_ls,
    BAR.TEM_ECLUSA AS tem_eclusa,
    BAR.DATA_ULT_INSPECAO AS data_ult_inspecao,
    BAR.OBSERVACAO AS observacao,
    BAR.MECANISMO_CONTROLE_EXTRAVASOR AS mecanismo_controle_extravasor,
    BAR.CLASS_BARR AS class_barr,
    BAR.COD_SNIBS AS cod_snibs,
    BAR.TIPO_INSPECAO AS tipo_inspecao,
    BAR.NIVEL_PERIGO AS nivel_perigo,
    BAR.CATEGORIA_RISCO AS categoria_risco,
    BAR.DANO_POTENCIAL AS dano_potencial,
    BAR.CLASSE_RESIDUO_BARRAGEM AS classe_residuo_barragem,
    BAR.TEM_PLANO_ACAO_EMERGENCIA AS tem_plano_acao_emergencia,
    BAR.TEM_PLANO_SEGURANCA AS tem_plano_seguranca,
    BAR.TEM_REVISAO_PERIODICA AS tem_revisao_periodica,
    BAR.CRIT_VAZAO_ORG_EXTRAVASOR AS crit_vazao_org_extravasor,
    BAR.TEM_PROJ_EXECUTIVO AS tem_proj_executivo,
    BAR.TEM_PROJ_CONSTRUIDO AS tem_proj_construido,
    BAR.TEM_PROJ_BASICO AS tem_proj_basico,
    BAR.TEM_PROJ_CONCEITUAL AS tem_proj_conceitual,
    BAR.FASE_VIDA_BARRAGEM AS fase_vida_barragem,
    BAR.REGULADA_PNSB AS regulada_pnsb,
    BAR.SUBT_OUT AS subt_out

    FROM [gisadmin].[BARRAGEM2] AS BAR
    LEFT JOIN [gisadmin].[INTERFERENCIA] AS I ON BAR.[ID_INTERFERENCIA] = I.[ID_INTERFERENCIA]
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
