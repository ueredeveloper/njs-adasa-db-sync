/**
 * Rota para sincronizar dados de outorgas de barragens entre um banco SQL Server local e um banco PostgreSQL no Azure.
 *
 * @module routers/insertOrUpdateSuperficialSync
 * @requires express
 * @requires mssql
 * @requires xml2js
 * @requires dotenv
 * @requires ../queries/superficial
 * @requires ../utils/insert-or-update-superficial-sync
 *
 * @description
 * Esta rota conecta-se ao banco de dados SQL Server local,
 * executa uma consulta para obter os dados de outorgas de barragem, converte
 * campos em XML para JSON e envia os dados convertidos para um banco PostgreSQL hospedado no Azure.
 */

// Importações de bibliotecas e módulos

const sql = require("mssql");
const xml2js = require('xml2js');
const { createClient } = require('@supabase/supabase-js');
const { dis_bar_query } = require("../queries/barragem-sql");
const insertOrUpdateBarragens = require("../utils/insert-or-update-bar");

require('dotenv').config();

// Variáveis de ambiente para configuração do banco
const { ADASA_HOST, ADASA_DATABASE, ADASA_USERNAME, ADASA_PASSWORD, SUPABASE_URL, SUPABASE_KEY } = process.env;
// Configurações do banco SQL Server
const config = {
    user: ADASA_USERNAME,
    password: ADASA_PASSWORD,
    server: ADASA_HOST,
    database: ADASA_DATABASE,
    trustServerCertificate: true,
};

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const router = require("express").Router();

/**
 * Rota GET para inserir ou atualizar dados de outorgas superficiais.
 *
 * @name GET/insert-or-update-superficial-sync
 * @function
 * @memberof module:routers/insertOrUpdateBarragem
 * @param {Object} req - Objeto de solicitação do Express.
 * @param {Object} res - Objeto de resposta do Express.
 *
 * @description
 * Conecta ao banco de dados SQL Server, executa consultas em lotes, converte campos XML para JSON e insere ou atualiza os dados no PostgreSQL.
 */
router.get("/insert-or-update-barragem", async (req, res) => {

    console.log('atualiza barragens');

    sql.connect(config, function (err) {
        if (err) console.log(err);

        // criar requisisão
        var request = new sql.Request();

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function saveEveryHundred() {
            let begin = new Date();
            let time = 3000;
            let promises = []; // Store all promises to track completion

            //for (let i = 0; i <= 22000; i = i + 200) {
            // em barragem o melhore é ir fazendo de dois mil em dois mil
            for (let i = 8000; i <= 22000; i = i + 200) {
                const promise = sleep(time).then(() => {
                    let ii = i + 200;
                    let now = new Date();
                    console.log('upsert barragem -----', i, ii, begin.getSeconds(), now.getSeconds());

                    let _query = dis_bar_query(i, ii);

                    return new Promise((resolve) => {
                        request.query(_query, async function (err, recordset) {
                            if (err) {
                                console.log(err);
                                return resolve();
                            }

                            let outorgas = recordset.recordsets[0].map((outorga, index) => {
                                console.log(outorga.int_id, index);
                                let { x, y } = outorga.int_shape.points[0];
                                outorga.int_shape = `POINT(${x} ${y})`;
                                return outorga;
                            });

                            console.log('quantidade enviada: ', outorgas.length);

                            try {
                                // ATUALIZAÇÃO 1
                                // Envia lista de outorgas para inserir ou atualizar no banco postgres
                                insertOrUpdateBarragens(outorgas);

                                /*

                                
                                // ATUALIZAÇÃO 2
                                // Atualização do banco supabase postgres - db=name=j-water-grants
                                const { data, error } = await supabase
                                    .from('barragem')
                                    .upsert(outorgas,
                                        { onConflict: 'int_id' })
                                    .select()
                                if (error) {
                                    console.log(JSON.stringify({ message: error }))
                                } else {
                                    console.log(JSON.stringify({ message: 'ok' }))
                                }*/
                               
                                

                                // ATUALIZAÇÃO 3
                                // Atualização do banco supabase postgres
                                const { data, error } = await supabase
                                    .from('barragem_sync')
                                    .upsert(outorgas,
                                        { onConflict: 'int_id' })
                                    .select()
                                if (error) {
                                    console.log(JSON.stringify({ message: error }))
                                } else {
                                    console.log(JSON.stringify({ message: 'ok' }))
                                }

                               
                            } catch (error) {
                                console.log(error);
                            }

                            resolve();
                        });
                    });
                });

                promises.push(promise);
                time = time + 3000;
            }

            // Wait for all operations to complete
            await Promise.all(promises);

            // Process complete - send alert
            console.log("Update - Barragens: Completo! ");
            /*res.send(`
                <script>
                    alert("Processo concluído com sucesso!");
                    window.history.back();
                </script>
            `);*/
        }

        saveEveryHundred();
    });
});

module.exports = router;
