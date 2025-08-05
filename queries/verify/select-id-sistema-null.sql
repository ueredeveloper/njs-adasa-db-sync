-- Esta consulta retorna as interferências subterrâneas cujos dados sobre o sistema aquífero ainda não foram definidos,
-- ou seja, onde o campo ID_SISTEMA está nulo. Isso indica que o sistema (ex: fraturado, R3 ou poroso P1) ainda não foi informado.
-- A query também retorna informações complementares como o número do processo, nome do usuário, tipo de poço, subsistema e endereço.

--24/07/2025 Solicitei que o lucas mude o tipo poço para tipo tubular raso. 


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
  -- remove processos de campanha 190000763/2005
  -- filtra por tipo de poço e exclui situação de processos 'em análise', 'obturado' e 'indeferidos' e 'irregulares'
  WHERE _SUB.[ID_SISTEMA] IS NULL AND _SUB.ID_TIPO_POCO IS NULL AND _INT.NUM_PROCESSO <> '190000763/2005' AND _INT.ID_SITUACAO NOT IN (2,7,9,10)
  