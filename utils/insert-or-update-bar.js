// Import the 'pg' module
const { Client } = require('pg');

require('dotenv').config();
// Extract variables from the .env file

async function insertOrUpdateBarragens(grants) {

  const client = new Client({
    connectionString: process.env.DATABASE_URL || null,
    host: process.env.DATABASE_HOST || null,
    port: process.env.DATABASE_PORT || 5432,
    user: process.env.DATABASE_USERNAME || null,
    password: process.env.DATABASE_PASSWORD || null,
    database: process.env.DATABASE_NAME || null,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
  
    const query = `
      INSERT INTO barragem_sync (
        us_id,
        us_nome,
        us_cpf_cnpj,
        us_email,
        us_cep,
        us_endereco,
        us_caixa_postal,
        us_bairro,
        us_telefone_1,
        emp_id,
        
        emp_endereco,
        int_processo,
        int_id,
        int_num_ato,
        int_latitude,
        int_longitude,
        int_shape,
        int_data_publicacao,
        int_data_vencimento,
        ti_id,
        
        ti_descricao,
        sp_id,
        sp_descricao,
        to_id,
        to_descricao,
        bh_id,
        bh_nome,
        uh_id,
        uh_nome,
        rio_barragem,

        id_dominio_barragem,
        nome_barragem,
        nome_barragem2,
        data_inicio,
        data_fim,
        volume_hm3,
        area_inundada_ha,
        altura_m,
        largura_crista_m,
        comprimento_crista_m,

        vazao_remanescente_ls,
        area_contribuicao,
        tipo_material,
        tipo_estrutural,
        vazao_orgao_extravasor_ls,
        tem_eclusa,
        data_ult_inspecao,
        observacao,
        mecanismo_controle_extravasor,
        class_barr,

        cod_snibs,
        tipo_inspecao,
        nivel_perigo,
        categoria_risco,
        dano_potencial,
        classe_residuo_barragem,
        tem_plano_acao_emergencia,
        tem_plano_seguranca,
        tem_revisao_periodica,
        crit_vazao_org_extravasor,

        tem_proj_executivo,
        tem_proj_construido,
        tem_proj_basico,
        tem_proj_conceitual,
        fase_vida_barragem,
        regulada_pnsb,
        subt_out
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
        $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, 
        $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43,
        $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57,
        $58, $59, $60, $61, $62, $63, $64, $65, $66, $67
      )
      ON CONFLICT (int_id) 
      DO UPDATE SET
        us_id = EXCLUDED.us_id,
        us_nome = EXCLUDED.us_nome,
        us_cpf_cnpj = EXCLUDED.us_cpf_cnpj,
        us_email = EXCLUDED.us_email,
        us_cep = EXCLUDED.us_cep,
        us_endereco = EXCLUDED.us_endereco,
        us_caixa_postal = EXCLUDED.us_caixa_postal,
        us_bairro = EXCLUDED.us_bairro,
        us_telefone_1 = EXCLUDED.us_telefone_1,
        emp_id = EXCLUDED.emp_id,
        
        emp_endereco = EXCLUDED.emp_endereco,
        int_processo = EXCLUDED.int_processo,
        int_num_ato = EXCLUDED.int_num_ato,
        int_latitude = EXCLUDED.int_latitude,
        int_longitude = EXCLUDED.int_longitude,
        int_shape = EXCLUDED.int_shape,
        int_data_publicacao = EXCLUDED.int_data_publicacao,
        int_data_vencimento = EXCLUDED.int_data_vencimento,
        ti_id = EXCLUDED.ti_id,
        ti_descricao = EXCLUDED.ti_descricao,
        
        sp_id = EXCLUDED.sp_id,
        sp_descricao = EXCLUDED.sp_descricao,
        to_id = EXCLUDED.to_id,
        to_descricao = EXCLUDED.to_descricao,
        bh_id = EXCLUDED.bh_id,
        bh_nome = EXCLUDED.bh_nome,
        uh_id = EXCLUDED.uh_id,
        uh_nome = EXCLUDED.uh_nome,
        
        rio_barragem = EXCLUDED.rio_barragem,
        id_dominio_barragem = EXCLUDED.id_dominio_barragem,
        nome_barragem = EXCLUDED.nome_barragem,
        nome_barragem2 = EXCLUDED.nome_barragem2,
        data_inicio = EXCLUDED.data_inicio,
        data_fim = EXCLUDED.data_fim,
        volume_hm3 = EXCLUDED.volume_hm3,
        area_inundada_ha = EXCLUDED.area_inundada_ha,
        altura_m = EXCLUDED.altura_m,
        largura_crista_m = EXCLUDED.largura_crista_m,
        comprimento_crista_m = EXCLUDED.comprimento_crista_m,
        vazao_remanescente_ls = EXCLUDED.vazao_remanescente_ls,
        area_contribuicao = EXCLUDED.area_contribuicao,
        tipo_material = EXCLUDED.tipo_material,
        tipo_estrutural = EXCLUDED.tipo_estrutural,
        vazao_orgao_extravasor_ls = EXCLUDED.vazao_orgao_extravasor_ls,
        tem_eclusa = EXCLUDED.tem_eclusa,
        data_ult_inspecao = EXCLUDED.data_ult_inspecao,
        observacao = EXCLUDED.observacao,
        mecanismo_controle_extravasor = EXCLUDED.mecanismo_controle_extravasor,
        class_barr = EXCLUDED.class_barr,
        cod_snibs = EXCLUDED.cod_snibs,
        tipo_inspecao = EXCLUDED.tipo_inspecao,
        nivel_perigo = EXCLUDED.nivel_perigo,
        categoria_risco = EXCLUDED.categoria_risco,
        dano_potencial = EXCLUDED.dano_potencial,
        classe_residuo_barragem = EXCLUDED.classe_residuo_barragem,
        tem_plano_acao_emergencia = EXCLUDED.tem_plano_acao_emergencia,
        tem_plano_seguranca = EXCLUDED.tem_plano_seguranca,
        tem_revisao_periodica = EXCLUDED.tem_revisao_periodica,
        crit_vazao_org_extravasor = EXCLUDED.crit_vazao_org_extravasor,
        tem_proj_executivo = EXCLUDED.tem_proj_executivo,
        tem_proj_construido = EXCLUDED.tem_proj_construido,
        tem_proj_basico = EXCLUDED.tem_proj_basico,
        tem_proj_conceitual = EXCLUDED.tem_proj_conceitual,
        fase_vida_barragem = EXCLUDED.fase_vida_barragem,
        regulada_pnsb = EXCLUDED.regulada_pnsb,
        subt_out = EXCLUDED.subt_out;
    `;
  
    for (const grant of grants) {

      console.log(grant.int_id, grant.us_nome)
      const values = [
        grant.us_id,
        grant.us_nome,
        grant.us_cpf_cnpj,
        grant.us_email,
        grant.us_cep,
        grant.us_endereco,
        grant.us_caixa_postal,
        grant.us_bairro,
        grant.us_telefone_1,
        grant.emp_id,
  
        grant.emp_endereco,
        grant.int_processo,
        grant.int_id,
        grant.int_num_ato,
        grant.int_latitude,
        grant.int_longitude,
        grant.int_shape,
        grant.int_data_publicacao,
        grant.int_data_vencimento,
        grant.ti_id,
  
        grant.ti_descricao,
        grant.sp_id,
        grant.sp_descricao,
        grant.to_tipo_outorga,
        grant.to_descricao,
        grant.bh_id,
        grant.bh_nome,
        grant.uh_id,
        grant.uh_nome,
  
        grant.rio_barragem,
        grant.id_dominio_barragem,
        grant.nome_barragem,
        grant.nome_barragem2,
        grant.data_inicio,
        grant.data_fim,
        grant.volume_hm3,
        grant.area_inundada_ha,
        grant.altura_m,
        grant.largura_crista_m,
        grant.comprimento_crista_m,
        grant.vazao_remanescente_ls,
        grant.area_contribuicao,
        grant.tipo_material,
        grant.tipo_estrutural,
        grant.vazao_orgao_extravasor_ls,
        grant.tem_eclusa,
        grant.data_ult_inspecao,
        grant.observacao,
        grant.mecanismo_controle_extravasor,
        grant.class_barr,
        grant.cod_snibs,
        grant.tipo_inspecao,
        grant.nivel_perigo,
        grant.categoria_risco,
        grant.dano_potencial,
        grant.classe_residuo_barragem,
        grant.tem_plano_acao_emergencia,
        grant.tem_plano_seguranca,
        grant.tem_revisao_periodica,
        grant.crit_vazao_org_extravasor,
        grant.tem_proj_executivo,
        grant.tem_proj_construido,
        grant.tem_proj_basico,
        grant.tem_proj_conceitual,
        grant.fase_vida_barragem,
        grant.regulada_pnsb,
        grant.subt_out
      ];
  
      await client.query(query, values);
      //console.log(`Processed user: ${grant.us_nome}`);
    }
  } catch (err) {
    console.error('Error executing query', err.stack);
  }
  
}

module.exports = insertOrUpdateBarragens;
