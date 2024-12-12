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

const { dis_sub_por_query } = require("../queries/subterranea-manual-sql");
const insertOrUpdateSubterraneaSync = require("../utils/insert-or-update-sub");

require('dotenv').config();

// Variáveis de ambiente para configuração do banco
const { ADASA_HOST, ADASA_DATABASE, ADASA_USERNAME, ADASA_PASSWORD } = process.env;
// Configurações do banco SQL Server
const config = {
    user: ADASA_USERNAME,
    password: ADASA_PASSWORD,
    server: ADASA_HOST,
    database: ADASA_DATABASE,
    trustServerCertificate: true,
};

const router = require("express").Router();

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

router.get("/insert-or-update-subterranea-manual", async (req, res) => {

    console.log('manual')
    sql.connect(config, function (err) {

        if (err) console.log(err);

        // criar requirisão
        var request = new sql.Request();

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        function saveEveryHundred() {
            let begin = new Date();

            let time = 3000;
            for (let i = 0; i <= 22000; i = i + 200) {
                sleep(time).then(() => {
                    let ii = i + 200
                    let now = new Date()
                    let _query = dis_sub_por_query(i, ii);
               
                    request.query(_query, async function (err, recordset) {
                        if (err) console.log(err);

                        let outorgas = recordset.recordsets[0].map((outorga, index) => {
                            
                            if (outorga.fin_finalidade != null) {

                                // conversão xml to json

                                xml2js.parseString(
                                    outorga.fin_finalidade,
                                    { explicitArray: false, normalizeTags: true, explicitRoot: false }, (err, result) => {
                                        if (err) {
                                            console.log("erro: ", outorga.us_nome, outorga.int_id)
                                            throw err
                                        }
                                        outorga.fin_finalidade = result
                                    });
                            }
                            if (outorga.dt_demanda != null) {
                                // conversão xml to json

                                xml2js.parseString(outorga.dt_demanda,
                                    { explicitArray: false, normalizeTags: true, explicitRoot: false }, (err, result) => {
                                        if (err) {
                                            console.log("erro: ", outorga.us_nome, outorga.int_id)
                                            throw err
                                        }
                                        outorga.dt_demanda = result
                                    });
                            }

                            return outorga;
                        });

                        console.log(outorgas.length)

                        insertOrUpdateSubterraneaSync(outorgas)

                    });

                });
                time = time + 3000

            }
        }

        saveEveryHundred();

    });
});

module.exports = router;