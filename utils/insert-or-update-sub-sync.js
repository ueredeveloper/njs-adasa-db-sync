// Import the 'pg' module
const { Client } = require('pg');

require('dotenv').config();
// Extract variables from the .env file

async function insertOrUpdateSubterraneaSync(users) {

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
      INSERT INTO subterranea_sync (
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
        tp_id,
        tp_descricao,
        to_id, 
        to_descricao, 
        bh_id, 
        bh_nome, 
        uh_id, 

        uh_nome,
        hg_codigo,
        hg_sistema,
        hg_subsistema,
        fin_finalidade, 
        dt_demanda
        ) 
        VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, 
            $30, $31, $32, $33, $34, $35, $36
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
            tp_id = EXCLUDED.tp_id,
            tp_descricao = EXCLUDED.tp_descricao,
            to_id = EXCLUDED.to_id,
            to_descricao = EXCLUDED.to_descricao,
            bh_id = EXCLUDED.bh_id,
            bh_nome = EXCLUDED.bh_nome,
            uh_id = EXCLUDED.uh_id,
            uh_nome = EXCLUDED.uh_nome,

            hg_codigo = EXCLUDED.hg_codigo,
            hg_sistema= EXCLUDED.hg_sistema,
            hg_subsistema = EXCLUDED.hg_subsistema,
            fin_finalidade = EXCLUDED.fin_finalidade,
            dt_demanda = EXCLUDED.dt_demanda;

    `;

    for (const user of users) {

      const values = [
        user.us_id, 
        user.us_nome, 
        user.us_cpf_cnpj, 
        user.us_email, 
        user.us_cep,
        user.us_endereco, 
        user.us_caixa_postal, 
        user.us_bairro,
        user.us_telefone_1, 
        user.emp_id,

        user.emp_endereco, 
        user.int_processo, 
        user.int_id, 
        user.int_num_ato,
        user.int_latitude, 
        user.int_longitude, 
        user.int_shape, 
        user.int_data_publicacao, 
        user.int_data_vencimento,
        user.ti_id,
        user.ti_descricao, 
        
        user.sp_id, 
        user.sp_descricao, 
        user.tp_id,
        user.tp_descricao,
        user.to_id, 
        user.to_descricao, 
        user.bh_id, 
        user.bh_nome,
        user.uh_id, 
        user.uh_nome, 

        user.hg_codigo,
        user.hg_sistema,
        user.hg_subsistema,
        user.fin_finalidade,
        user.dt_demanda
      ];

      await client.query(query, values);
      console.log(`Processed user: ${user.us_nome}`);

    }

  } catch (err) {
    console.error('Error executing query', err.stack);
  } finally {
    await client.end();
  }
}

module.exports = insertOrUpdateSubterraneaSync;

