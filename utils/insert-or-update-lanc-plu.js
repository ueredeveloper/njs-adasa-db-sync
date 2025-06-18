// Import the 'pg' module
const { Client } = require('pg');

require('dotenv').config();
// Extract variables from the .env file

async function fetchInsertOrUpdateLancamentoPluviais(grants) {

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
      INSERT INTO lancamento_pluviais_sync (
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

          end_endereco, 
          end_cidade,
          ta_id, 
          ta_descricao,
          emp_id, 
          emp_endereco,
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
          int_id, 
          int_processo, 
          int_num_ato, 
          int_latitude, 

          int_longitude, 
          int_shape, 
          int_data_publicacao, 
          int_data_vencimento,
          int_emp_id, 
          int_uh, 
          int_ti, 
          int_to, 
          int_ta, 
          int_situacao_id, 

          int_verificado, 
          int_observacao, 
          int_int_antigo, 
          int_nome
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, 
        $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, 
        $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
        $41, $42, $43, $44
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

        end_endereco = EXCLUDED.end_endereco,
        end_cidade = EXCLUDED.end_cidade,
        ta_id = EXCLUDED.ta_id,
        ta_descricao = EXCLUDED.ta_descricao,
        emp_id = EXCLUDED.emp_id,
        emp_endereco = EXCLUDED.emp_endereco,
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
        int_processo = EXCLUDED.int_processo,
        int_num_ato = EXCLUDED.int_num_ato,
        int_latitude = EXCLUDED.int_latitude,

        int_longitude = EXCLUDED.int_longitude,
        int_shape = EXCLUDED.int_shape,
        int_data_publicacao = EXCLUDED.int_data_publicacao,
        int_data_vencimento = EXCLUDED.int_data_vencimento,
        int_emp_id = EXCLUDED.int_emp_id,
        int_uh = EXCLUDED.int_uh,
        int_ti = EXCLUDED.int_ti,
        int_to = EXCLUDED.int_to,
        int_ta = EXCLUDED.int_ta,
        int_situacao_id = EXCLUDED.int_situacao_id,

        int_verificado = EXCLUDED.int_verificado,
        int_observacao = EXCLUDED.int_observacao,
        int_int_antigo = EXCLUDED.int_int_antigo,
        int_nome = EXCLUDED.int_nome
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

        grant.end_endereco,
        grant.end_cidade,
        grant.ta_id,
        grant.ta_descricao,
        grant.emp_id,
        grant.emp_endereco,
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
        grant.int_id,
        grant.int_processo,
        grant.int_num_ato,
        grant.int_latitude,

        grant.int_longitude,
        grant.int_shape,
        grant.int_data_publicacao,
        grant.int_data_vencimento,
        grant.int_emp_id,
        grant.int_uh,
        grant.int_ti,
        grant.int_to,
        grant.int_ta,
        grant.int_situacao_id,

        grant.int_verificado,
        grant.int_observacao,
        grant.int_int_antigo,
        grant.int_nome
      ];

      console.log(`Processed user: id da interferêwncia: ${grant.int_id}, id do usuário: ${grant.us_id}`);
      await client.query(query, values)
      
    }
  } finally {
    await client.end();
  }


}

module.exports = fetchInsertOrUpdateLancamentoPluviais;
