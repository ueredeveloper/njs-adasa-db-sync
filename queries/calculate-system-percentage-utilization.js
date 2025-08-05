exports.calculate_number_of_interferecies_and_percentage_fraturado = function (objectId) {
	return `
		/** 21/07/2025 - QUANTIDADE DE POÇOS E PORCENTAGEM UTILIZADA NO SUBSISTEMA HIDROGEO FRATURADO
			Se não houver poços no polígono específico, o subsistema não aparecerá no resultado, não sendo assim necessário
			a atualização.

			Foi utilizado o somatório da vazão (LH), multilipado pelas horas de bombeamentoe
			e multiplicado pelos dias, até chegar na vazão anual. Esta forma mostrou uma 
			vazão anual mais próxima da realidade.

		*/

		USE SRH;
		SELECT 
			_HG.OBJECTID,
			_HG.Cod_plan,
			-- Quantidade de Poços no Subsistema
			COUNT(DISTINCT _INT.ID_INTERFERENCIA) AS qtd_pocos,
		
			-- Este tipo de cálculo dá um somatório de vazão menor, por isso escolhi fazer o cálculo pela vazão hora * tempo de captação * dias
			/*SUM(
			-- se diferente de null e diferente de zero
			CASE WHEN _DEM.VAZAO_DIA IS NOT NULL AND _DEM.VAZAO_DIA <> 0
			-- calcula pela vazão diária
			THEN _DEM.VAZAO_DIA * _DEM.QT_DIAS
			-- faz o somatório da vazão por por hora e horas de captação
			ELSE _DEM.VAZAO_HORA * _DEM.TEMPO_CAPTACAO * _DEM.QT_DIAS

			END) / 1000.0 / _HG.RE_cm_an * 100 AS per_utilizacao,
			*/
			-- Porcentagem de Utilização (Somatório das outorgas anual em metros cúbicos, didivido pela vazão anual do sistema em metros cúbicos, multiplicado por cem)
			SUM(_DEM.VAZAO_HORA * _DEM.TEMPO_CAPTACAO * _DEM.QT_DIAS) / 1000.0 / _HG.RE_cm_an * 100 AS pct_utilizada
			-- Se precisar para cálculos, vazão anual utilizada
			--SUM(_DEM.VAZAO_HORA * _DEM.TEMPO_CAPTACAO * _DEM.QT_DIAS) / 1000.0 AS q_anual_utilizada

		FROM [gisadmin].[HIDROGEO_FRATURADO_UH] _HG 

		LEFT JOIN [gisadmin].[INTERFERENCIA] _INT 
			-- Adiciona o SRID 4674 no polígono e faz o contains
			ON geometry::STGeomFromWKB(_HG.Shape.STAsBinary(), 4674).STContains(
			-- Adiciona o SRID 4674 no ponto
				geometry::STPointFromText(
					'POINT(' + 
					CONVERT(NVARCHAR(20), _INT.LONGITUDE) + ' ' + 
					CONVERT(NVARCHAR(20), _INT.LATITUDE) + ')',
					4674
				)
			) = 1

		LEFT JOIN [gisadmin].[SUBTERRANEA2] _SUB 
			ON _SUB.ID_INTERFERENCIA = _INT.ID_INTERFERENCIA

		LEFT JOIN [gisadmin].[DEMANDA_TOTAL_SUB] _DEM 
			ON _DEM.ID_INTERFERENCIA = _SUB.ID_INTERFERENCIA

		WHERE 
			-- Faz para apenas uma área para teste
			_HG.OBJECTID = ${objectId} AND 
			-- Filtra apenas poços tubulares
			_SUB.ID_SISTEMA NOT IN (1, 2, 3, 4)
			-- Remove processos em análise, indeferidos, obturados e irregular.
			AND _INT.ID_SITUACAO NOT IN (2,7,9, 10)

		GROUP BY 
			_HG.OBJECTID,
			_HG.RE_cm_an,
			_HG.Cod_plan
		ORDER BY _HG.OBJECTID`;
}

exports.calculate_number_of_interferecies_and_percentage_poroso = function (objectId) {
	return `
		/** 21/07/2025 - QUANTIDADE DE POÇOS E PORCENTAGEM UTILIZADA NO SUBSISTEMA HIDROGEO POROSO
		Se não houver poços no polígono específico, o subsistema não aparecerá no resultado, não sendo assim necessário
		a atualização.

		Foi utilizado o somatório da vazão (LH), multilipado pelas horas de bombeamentoe
		e multiplicado pelos dias, até chegar na vazão anual. Esta forma mostrou uma 
		vazão anual mais próxima da realidade.

		*/

		USE SRH;
		SELECT 
		_HG.OBJECTID,
		_HG.Cod_plan,
		-- Quantidade de Poços no Subsistema
		COUNT(DISTINCT _INT.ID_INTERFERENCIA) AS qtd_pocos,
	
		-- Este tipo de cálculo dá um somatório de vazão menor, por isso escolhi fazer o cálculo pela vazão hora * tempo de captação * dias
		/*SUM(
		-- se diferente de null e diferente de zero
		CASE WHEN _DEM.VAZAO_DIA IS NOT NULL AND _DEM.VAZAO_DIA <> 0
		-- calcula pela vazão diária
		THEN _DEM.VAZAO_DIA * _DEM.QT_DIAS
		-- faz o somatório da vazão por por hora e horas de captação
		ELSE _DEM.VAZAO_HORA * _DEM.TEMPO_CAPTACAO * _DEM.QT_DIAS

		END) / 1000.0 / _HG.RE_cm_an * 100 AS per_utilizacao,
		*/
		-- Porcentagem de Utilização (Somatório das outorgas anual em metros cúbicos, didivido pela vazão anual do sistema em metros cúbicos, multiplicado por cem)
		SUM(_DEM.VAZAO_HORA * _DEM.TEMPO_CAPTACAO * _DEM.QT_DIAS) / 1000.0 / _HG.RE_cm_ano * 100 AS pct_utilizada
		-- Se precisar para cálculos, vazão anual utilizada
		--SUM(_DEM.VAZAO_HORA * _DEM.TEMPO_CAPTACAO * _DEM.QT_DIAS) / 1000.0 AS q_anual_utilizada

		FROM [gisadmin].HIDROGEO_POROSO_UH _HG 

		LEFT JOIN [gisadmin].[INTERFERENCIA] _INT 
			-- Adiciona o SRID 4674 no polígono e faz o contains
			ON geometry::STGeomFromWKB(_HG.Shape.STAsBinary(), 4674).STContains(
			-- Adiciona o SRID 4674 no ponto
				geometry::STPointFromText(
					'POINT(' + 
					CONVERT(NVARCHAR(20), _INT.LONGITUDE) + ' ' + 
					CONVERT(NVARCHAR(20), _INT.LATITUDE) + ')',
					4674
				)
			) = 1

		LEFT JOIN [gisadmin].[SUBTERRANEA2] _SUB 
			ON _SUB.ID_INTERFERENCIA = _INT.ID_INTERFERENCIA

		LEFT JOIN [gisadmin].[DEMANDA_TOTAL_SUB] _DEM 
			ON _DEM.ID_INTERFERENCIA = _SUB.ID_INTERFERENCIA

		WHERE 
			-- Faz para apenas uma área para teste
			_HG.OBJECTID = ${objectId} AND 
			-- Filtra apenas poços manuais, 
			_SUB.ID_SISTEMA IN (1, 2, 3, 4)
			-- Remove processos em análise, indeferidos, obturados e irregular.

		GROUP BY 
			_HG.OBJECTID,
			_HG.RE_cm_ano,
			_HG.Cod_plan
		ORDER BY _HG.OBJECTID`;
}