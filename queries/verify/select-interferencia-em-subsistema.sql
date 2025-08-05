
/**
Selecionar interferências em um subsistema específico
*/
USE SRH;
DECLARE @int_shape geometry;
DECLARE @int_vazao_anual NUMERIC(10,4);
SELECT 
_INT.ID_INTERFERENCIA,
    _HF.uh_nome, 
	-- CÓDIGO DO SUSBSISTEMA
	_HF.Cod_plan,
	-- VAZÃO MENSAL EM METROS CÚBICOS
	(SELECT SUM(VAZAO_DIA*QT_DIAS)/1000 FROM [SRH].[gisadmin].[DEMANDA_TOTAL_SUB] __DEM WHERE __DEM.ID_INTERFERENCIA = _SUB.ID_INTERFERENCIA)

FROM [gisadmin].[HIDROGEO_FRATURADO_UH] _HF 
LEFT JOIN [gisadmin].[INTERFERENCIA] _INT 
    ON _HF.Shape.STContains(
        geometry::STPointFromText(
                    'POINT(' + 
                    CONVERT(NVARCHAR(20), _INT.LONGITUDE) + ' ' + 
                    CONVERT(NVARCHAR(20), _INT.LATITUDE) + ')', 
                    4674
                )
    ) = 1
LEFT JOIN [gisadmin].[SUBTERRANEA2] _SUB ON _SUB.ID_INTERFERENCIA = _INT.ID_INTERFERENCIA
WHERE _HF.OBJECTID = 42 AND _SUB.ID_SISTEMA NOT IN (1,2,3,4)
GROUP BY _INT.ID_INTERFERENCIA, _HF.OBJECTID,  
_HF.uh_nome, _HF.Cod_plan, _INT.NUM_PROCESSO, _INT.LATITUDE, _INT.LONGITUDE, _SUB.ID_SISTEMA, _SUB.ID_INTERFERENCIA, _HF.RE_cm_an


