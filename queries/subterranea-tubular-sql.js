exports.dis_sub_tub_query = function (less, grater) {
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
           --U.TELEFONE_2 AS us_telefone_2,
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
		   /* tipo poço: manual ou tubular */
           CASE 
			WHEN SUB.ID_SISTEMA IS NOT NULL AND SUB.ID_SISTEMA IN (1, 2, 3, 4) THEN 1
			 ELSE 2
			  END AS tp_id,
           CASE 
			WHEN SUB.ID_SISTEMA IS NOT NULL AND SUB.ID_SISTEMA IN (1, 2, 3, 4) THEN 'MANUAL'
			 ELSE 'TUBULAR'
			  END AS tp_descricao,
		   /* tipo outorga: direito, prévia, registro */
		   TIPO_OUT.ID_TIPO_OUTORGA AS to_id,
		   TIPO_OUT.DESCRICAO AS to_descricao,
		   /* bacia **/
           BH.OBJECTID_1 AS bh_id,
           BH.BACIA_NOME AS bh_nome,
		   /* uh */
           UH.OBJECTID AS uh_id,
           UH.UH_NOME AS uh_nome,
		   /* subsistema */
		   HG.Cod_plan AS hg_codigo,
		   HG.Sistema AS hg_sistema,
		   HG.Subsistema AS hg_subsistema,
			
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
   
           dt_demanda = (SELECT
			(
			SELECT ID_INTERFERENCIA id_interferencia,
			ID_DEMANDA_TOTAL AS id_demanta_total,
			VAZAO_HORA AS vazao_lh, /* [jan-dez] vazao_lh -> vazão (l/h) */
			VAZAO_DIA AS vazao_ld,
			MES AS mes,
			VAZAO_HORA/1000 AS vazao_mh, /* [jan-dez] vazao_mh -> vazão jan-dez (m³/h) -> FÓRMULA: vazao_lh/1000 */
			TEMPO_CAPTACAO AS tempo_h, /* [jan-dez] tempo_h  tempo de bombeamento (h) */
			(VAZAO_HORA/1000)*TEMPO_CAPTACAO AS vol_max_md, /* vol_max_md -> vol max dia (m³/dia) -> FÓRMULA: vazao_mh * tempo_h */
			QT_DIAS AS periodo_d, /* [jan-dez] periodo_dm -> periodo (dias/mês) */
			(VAZAO_HORA/1000)*TEMPO_CAPTACAO*QT_DIAS AS vol_mensal_mm /*  vol mensal (m³/mês) -> FORMULA: vazao_mh * tempo_h * periodo_dm */
			FROM [gisadmin].[DEMANDA_TOTAL_SUB] AS DT
			WHERE DT.ID_INTERFERENCIA = I.ID_INTERFERENCIA
			FOR XML PATH('demandas'), TYPE
			), /* SELECT 1*/
			(
			SELECT SUM((VAZAO_HORA/1000)*TEMPO_CAPTACAO*QT_DIAS) AS vol_anual_ma 
			FROM [gisadmin].[DEMANDA_TOTAL_SUB] AS DT WHERE DT.ID_INTERFERENCIA = I.ID_INTERFERENCIA FOR XML PATH(''), TYPE
			) /* SELECT 2 */
			FOR XML PATH('demandas')) /* UNIR SELECTS 1 E 2 */
            
    FROM [gisadmin].[SUBTERRANEA2] AS SUB
    LEFT JOIN [gisadmin].[INTERFERENCIA] AS I ON SUB.[ID_INTERFERENCIA] = I.[ID_INTERFERENCIA]
    LEFT JOIN [gisadmin].[EMPREENDIMENTO] AS E ON E.[ID_EMPREENDIMENTO] = I.[ID_EMPREENDIMENTO]
    LEFT JOIN [gisadmin].[USUARIO] AS U ON U.[ID_USUARIO] = E.[ID_USUARIO]
    LEFT JOIN [gisadmin].[TIPO_INTERFERENCIA] AS TI ON I.[ID_TIPO_INTERFERENCIA] = TI.[ID_TIPO_INTERFERENCIA]
    LEFT JOIN [gisadmin].[SITUACAO_PROCESSO] AS SP ON I.[ID_SITUACAO] = SP.[ID_SITUACAO]
    LEFT JOIN [gisadmin].[TIPO_POCO] AS TP ON SUB.[ID_TIPO_POCO] = TP.[ID_TIPO_POCO]
    LEFT JOIN [gisadmin].[UNIDADES_HIDROGRAFICAS] AS UH ON I.[ID_UH] = UH.[OBJECTID]
    LEFT JOIN [gisadmin].[BACIAS_HIDROGRAFICAS] AS BH ON UH.[ID_BACIA] = BH.[OBJECTID_1]
	LEFT JOIN [gisadmin].[TIPO_OUTORGA] TIPO_OUT ON TIPO_OUT.ID_TIPO_OUTORGA = I.ID_TIPO_OUTORGA
    LEFT JOIN [gisadmin].[HIDROGEO_FRATURADO_UH] AS HG ON HG.Shape.STContains(geometry::STGeomFromText(I.SHAPE.ToString(), 4674)) = 1 
	-- Condições: Não é do subsistema poroso (1,2,3,4), o subisistema não é nulo e está entre os ids de interferência 1 a 100, por exemplo
    WHERE SUB.ID_SISTEMA NOT IN (1, 2, 3, 4) AND  SUB.ID_SISTEMA IS NOT NULL AND I.ID_INTERFERENCIA >= ${less} AND I.ID_INTERFERENCIA <= ${grater}               
    `
}