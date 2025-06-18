
exports.dis_sup_query = function (less, grater) {
    return `
    /* SUPERFICIAL */
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
		   /* endereço */
           E.ID_EMPREENDIMENTO AS emp_id,
           E.ENDERECO AS emp_endereco,
		   /* interferência */
           I.NUM_PROCESSO AS int_processo,
           I.ID_INTERFERENCIA AS int_id,
           I.NUM_ATO AS int_num_ato,
           I.LATITUDE AS int_latitude,
           I.LONGITUDE AS int_longitude,
           CASE 
            WHEN I.[SHAPE].ToString() LIKE '%POINT (-15%' OR I.[SHAPE].ToString() LIKE '%POINT (-16%' THEN 
                'POINT (' + CONVERT(NVARCHAR(20), [LONGITUDE]) + ' ' + CONVERT(NVARCHAR(20), [LATITUDE]) + ')'
            ELSE 
                I.[SHAPE].ToString() 
                END AS int_shape,
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
		   /* bacia **/
           BH.OBJECTID_1 AS bh_id,
           BH.BACIA_NOME AS bh_nome,
		   /* uh */
           UH.OBJECTID AS uh_id,
           UH.UH_NOME AS uh_nome,
           UH.uh_codigo AS uh_codigo, /* 10/08/23 -> ADICIONAR EM TODAS AS TABELAS A INFORMAÇÃO CÓDIGO DA UH */
           /* area */
           SUP.AREA_IRRIGADA sup_area_irrigada,
		   SUP.TAMANHO_PROP sup_area_propriedade,
		   /*
           fin_finalidade =
            (SELECT
            (SELECT 
				fin.ID_FINALIDADE AS id_finalidade,
				fin.ID_TIPO_FINALIDADE AS id_tipo_finalidade, 
				fin.ID_INTERFERENCIA AS id_interferencia,
				fin.VAZAO AS vazao,
				fin.SUBFINALIDADE AS subfinalidade,
				tf.DESCRICAO AS descricao
            FROM [gisadmin].[FINALIDADE] AS fin
            JOIN [gisadmin].[TIPO_FINALIDADE] AS tf ON tf.ID_TIPO_FINALIDADE = fin.ID_TIPO_FINALIDADE
            WHERE fin.ID_INTERFERENCIA = I.ID_INTERFERENCIA
            FOR XML PATH('finalidades'),
            ROOT('finalidade_total'))),*/

			 fin_finalidade =
        (SELECT
        (SELECT *
        FROM [SRH].[gisadmin].[FINALIDADE] fin
        JOIN [SRH].[gisadmin].[TIPO_FINALIDADE] AS tf ON tf.ID_TIPO_FINALIDADE = fin.ID_TIPO_FINALIDADE
        WHERE fin.ID_INTERFERENCIA = I.ID_INTERFERENCIA
        FOR XML PATH('FINALIDADES'),
        ROOT('ROOT'))),
   /*
            demandas = (SELECT (SELECT 
			ID_INTERFERENCIA id_interferencia,
			ID_DEMANDA_TOTAL AS id_demanta_total,
			VAZAO AS vazao, /* [jan-dez] vazao_lh -> vazão (l/s) */

			TEMPO_CAPTACAO AS tempo, /* [jan-dez] tempo_hd  tempo de captação (h/dia) */
			QT_DIAS AS periodo, /* [jan-dez] periodo_dm -> periodo (dias/mês) */
			MES mes /* mês do ano */
			FROM [gisadmin].[DEMANDA_TOTAL] AS DT
			WHERE DT.ID_INTERFERENCIA = I.ID_INTERFERENCIA
			FOR XML PATH('demandas'),
			ROOT('demanda_total')))*/
			 dt_demanda =
        (SELECT
        (SELECT *
        FROM [SRH].[gisadmin].[DEMANDA_TOTAL] AS DT
        WHERE DT.ID_INTERFERENCIA = I.ID_INTERFERENCIA
        FOR XML PATH('DEMANDAS'),
        ROOT('ROOT') ))

			
    FROM [SRH].[gisadmin].[SUPERFICIAL2] AS SUP
    LEFT JOIN [gisadmin].[INTERFERENCIA] AS I ON SUP.[ID_INTERFERENCIA] = I.[ID_INTERFERENCIA]

    LEFT JOIN [gisadmin].[EMPREENDIMENTO] AS E ON E.[ID_EMPREENDIMENTO] = I.[ID_EMPREENDIMENTO]
    LEFT JOIN [gisadmin].[USUARIO] AS U ON U.[ID_USUARIO] = E.[ID_USUARIO]
    LEFT JOIN [gisadmin].[TIPO_INTERFERENCIA] AS TI ON I.[ID_TIPO_INTERFERENCIA] = TI.[ID_TIPO_INTERFERENCIA]
    LEFT JOIN [gisadmin].[SITUACAO_PROCESSO] AS SP ON I.[ID_SITUACAO] = SP.[ID_SITUACAO]
    
    LEFT JOIN [gisadmin].[UNIDADES_HIDROGRAFICAS] AS UH ON I.[ID_UH] = UH.[OBJECTID]
    LEFT JOIN [gisadmin].[BACIAS_HIDROGRAFICAS] AS BH ON UH.[ID_BACIA] = BH.[OBJECTID_1]
	LEFT JOIN [gisadmin].[TIPO_OUTORGA] TIPO_OUT ON TIPO_OUT.ID_TIPO_OUTORGA = I.ID_TIPO_OUTORGA

    WHERE TI.ID_TIPO_INTERFERENCIA = 1 AND I.ID_INTERFERENCIA >= ${less} AND I.ID_INTERFERENCIA <= ${grater}
    `
}