/**
 * Rota para sincronizar dados de outorgas superficiais entre um banco SQL Server local e um banco PostgreSQL no Azure.
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
 * executa uma consulta para obter os dados de outorgas superficiais, converte
 * campos em XML para JSON e envia os dados convertidos para um banco PostgreSQL hospedado no Azure.
 */

// Importações de bibliotecas e módulos

const sql = require("mssql");
const xml2js = require('xml2js');
const { createClient } = require('@supabase/supabase-js');
const { lancamento_efluentes } = require("../queries/lancamento-efluentes-sql");
const insertOrUpdateLancamentoEfluentes = require("../utils/insert-or-update-lanc-efl");


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
router.get("/insert-or-update-lancamento-efluentes", async (req, res) => {

    console.log('atualiza lançamento de efluentes');

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
            for (let i = 10800; i <= 12200; i = i + 200) {
                const promise = sleep(time).then(() => {
                    let ii = i + 200;
                    let now = new Date();
                    console.log('upsert efluentes -----', i, ii, begin.getSeconds(), now.getSeconds());

                    let _query = lancamento_efluentes(i, ii);

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

                            console.log(outorgas.length);

                            try {
                                // ATUALIZAÇÃO 1
                                // atualização do banco azure postgres adasa
                                insertOrUpdateLancamentoEfluentes(outorgas);

                                // ATUALIZAÇÃO 2
                                // Atualização do banco supabase postgres
                               /* const { data, error } = await supabase
                                    .from('lancamento_efluentes')
                                    .upsert(outorgas,
                                        { onConflict: 'int_id' })
                                    .select()
                                if (error) {
                                    console.log(JSON.stringify({ message: error }))
                                } else {
                                    console.log(JSON.stringify({ message: 'ok' }))
                                }*/

                                // ATUALIZAÇÃO 3
                                // Atualização do banco supabase postgres - db=name=j-water-grants
                               /* const { data, error } = await supabase
                                    .from('lancamento_efluentes_sync')
                                    .upsert(outorgas,
                                        { onConflict: 'int_id' })
                                    .select()
                                if (error) {
                                    console.log(JSON.stringify({ message: error }))
                                } else {
                                    console.log(JSON.stringify({ message: 'ok' }))
                                }*/
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
            console.log("Update - Lançamento de Efluentes: Completo! ");

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
