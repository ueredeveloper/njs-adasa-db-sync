-- Esta consulta retorna as interfer�ncias subterr�neas cujos dados sobre o sistema aqu�fero ainda n�o foram definidos,
-- ou seja, onde o campo ID_SISTEMA est� nulo. Isso indica que o sistema (ex: fraturado, R3 ou poroso P1) ainda n�o foi informado.
-- A query tamb�m retorna informa��es complementares como o n�mero do processo, nome do usu�rio, tipo de po�o, subsistema e endere�o.

SELECT _SUB.[ID_INTERFERENCIA]
	  ,_INT.NUM_PROCESSO
	  ,_US.NOME
      ,_SUB.[ID_TIPO_POCO]
      ,_SUB.[ID_SISTEMA]
      ,_SUB.[ID_SUBSISTEMA]
	  ,_EMP.ENDERECO

  FROM [SRH].[gisadmin].[SUBTERRANEA2] _SUB
  LEFT JOIN [gisadmin].[INTERFERENCIA] _INT ON _INT.ID_INTERFERENCIA = _SUB.ID_INTERFERENCIA
  LEFT JOIN [gisadmin].[EMPREENDIMENTO] _EMP ON _EMP.ID_EMPREENDIMENTO = _INT.ID_EMPREENDIMENTO
  LEFT JOIN [gisadmin].[USUARIO] _US ON _US.ID_USUARIO = _EMP.ID_USUARIO
  WHERE _SUB.[ID_SISTEMA] IS NULL
