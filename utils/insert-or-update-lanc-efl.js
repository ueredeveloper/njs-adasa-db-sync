// Import the 'pg' module
const { Client } = require('pg');

require('dotenv').config();
// Extract variables from the .env file

async function insertOrUpdateLancamentoEfluentes(grants) {

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
      INSERT INTO lancamento_efluentes_sync (
        us_id, 
        us_nome, 
        us_cpf_cnpj, 
        us_email, 
        us_cep, 
        us_endereco, 
        us_caixa_postal, 
        us_bairro, 
        us_telefone_1, 
        us_telefone_2, 
		
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

        nome_manancial, 
        classe_manancial, 
        tipo_tratamento, 
        q_projeto, 
        q_media, 
        area_atendimento
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, 
        $31, $32, $33, $34, $35, $36
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
        us_telefone_2 = EXCLUDED.us_telefone_2,

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
        nome_manancial = EXCLUDED.nome_manancial,

        classe_manancial = EXCLUDED.classe_manancial,
        tipo_tratamento = EXCLUDED.tipo_tratamento,
        q_projeto = EXCLUDED.q_projeto,
        q_media = EXCLUDED.q_media,
        area_atendimento = EXCLUDED.area_atendimento;
    `;

    for (const grant of grants) {
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
        grant.us_telefone_2,

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
        grant.to_id,
        grant.to_descricao,
        grant.bh_id,
        grant.bh_nome,
        grant.uh_id,
        grant.uh_nome,
        grant.nome_manancial,
        grant.classe_manancial,

        grant.tipo_tratamento,
        grant.q_projeto,
        grant.q_media,
        grant.area_atendimento
      ];
      await client.query(query, values);
      //console.log(`Processed user: ${grant.us_nome}`);
    }
  } finally {
    await client.end();
  }




}

module.exports = insertOrUpdateLancamentoEfluentes;
