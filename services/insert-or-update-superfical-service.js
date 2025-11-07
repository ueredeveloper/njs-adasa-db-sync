/**
 * Rota para sincronizar dados de outorgas superficiais entre um banco SQL Server local e um banco PostgreSQL no Azure.
 *
 * @module routers/insertOrUpdateSuperficialSync
 * @requires express
 * @requires mssql
 * @requires xml2js
 * @requires dotenv
 * @requires ../queries/superficial
 * @requires ../utils/insert-or-update-superficial
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
const { dis_sup_query } = require("../queries/superficial-sql");
const insertOrUpdateSuperficialSync = require("../utils/insert-or-update-sup");

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

const router = require("express").Router();

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Rota GET para inserir ou atualizar dados de outorgas superficiais.
 *
 * @name GET/insert-or-update-superficial
 * @function
 * @memberof module:routers/insertOrUpdateSuperficialSync
 * @param {Object} req - Objeto de solicitação do Express.
 * @param {Object} res - Objeto de resposta do Express.
 *
 * @description
 * Conecta ao banco de dados SQL Server, executa consultas em lotes, converte campos XML para JSON e insere ou atualiza os dados no PostgreSQL.
 */
router.get("/insert-or-update-superficial", async (req, res) => {

    console.log('atualização superficial')

    sql.connect(config, function (err) {
        if (err) console.log(err);

        // Cria uma nova instância de requisição para consultas SQL
        var request = new sql.Request();

        /**
         * Função auxiliar para criar um atraso (sleep) em milissegundos.
         * @param {number} ms - Milissegundos para aguardar.
         * @returns {Promise} Promessa resolvida após o tempo especificado.
         */
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        /**
         * Processa os dados de forma incremental em lotes de 200 registros.
         * Executa consultas no SQL Server, converte os campos XML para JSON e
         * chama a função de inserção/atualização no PostgreSQL.
         */
        async function saveEveryHundred() {

            let begin = new Date();
            let time = 3000;
            let totalIterations = Math.ceil(22000 / 200) + 1;
            let completedIterations = 0;
            let promises = [];

            for (let i = 0; i <= 22000; i = i + 200) {
                let promise = sleep(time).then(() => {
                    let ii = i + 200
                    let now = new Date()
                    let _query = dis_sup_query(i, ii);
                    // requisição

                    return new Promise((resolve) => {
                        request.query(_query, async function (err, recordset) {
                            if (err) {
                                console.log(err);
                                return resolve();
                            }
                            
                            // Processa os registros obtidos da consulta    
                            let outorgas = recordset.recordsets[0].map((outorga, index) => {

                                // conversão para o formato postgres (json)
                                if (outorga.fin_finalidade !== null) {
                                    // conversão xml to json
                                    xml2js.parseString(
                                        outorga.fin_finalidade,
                                        { explicitArray: false, normalizeTags: true, explicitRoot: false }, (err, result) => {
                                            if (err) {
                                                throw err, outorga.us_id, outorga.int_id
                                            }
                                            outorga.fin_finalidade = result
                                        });
                                }
                                if (outorga.dt_demanda !== null) {
                                    
                                    // conversão xml to json
                                    xml2js.parseString(outorga.dt_demanda,
                                        { explicitArray: false, normalizeTags: true, explicitRoot: false }, (err, result) => {
                                            if (err) {
                                                throw err
                                            }
                                            outorga.dt_demanda = result
                                        });
                                }

                                return outorga;
                            });

                            // ATUALIZAÇÃO 1 - Envia lista de outorgas para inserir ou atualizar no banco postgres
                            
                            insertOrUpdateSuperficialSync(outorgas);

                            /*
                            // ATUALIZAÇÃO 2
                            // Atualização do banco supabase postgres - pg-drainage
                            const { data, error } = await supabase
                                .from('superficial')
                                .upsert(outorgas,
                                    { onConflict: 'int_id' })
                                .select()
                            if (error) {
                                console.log(JSON.stringify({ message: error }))
                            } else {
                                console.log(JSON.stringify({ message: 'ok' }))
                            }
                            */
                            // ATUALIZAÇÃO 3
                            // Atualização do banco supabase postgres - db=name=j-water-grants
                            const { data, error } = await supabase
                                .from('superficial_sync')
                                .upsert(outorgas,
                                    { onConflict: 'int_id' })
                                .select()
                            if (error) {
                                console.log(JSON.stringify({ message: error }))
                            } else {
                                console.log(JSON.stringify({ message: 'ok' }))
                            }

                            resolve();
                        });
                    });
                });

                promises.push(promise);
                time = time + 3000;
                completedIterations++;
            }

            // Wait for all operations to complete
            await Promise.all(promises);
            
            // Process complete - send alert
            console.log("Update - Superficial: Completo! ");
            
            /*res.send(`
                <script>
                    alert("Processo de atualização superficial concluído!\\n\\nTotal de iterações: ${completedIterations}\\nInício: ${begin.toLocaleTimeString()}\\nTérmino: ${new Date().toLocaleTimeString()}\\nDuração: ${((new Date() - begin)/1000} segundos");
                    window.history.back();
                </script>
            `);*/
        }

        saveEveryHundred();
    });

});

module.exports = router;
