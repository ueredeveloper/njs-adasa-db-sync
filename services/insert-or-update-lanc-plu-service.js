const sql = require("mssql");
const { createClient } = require('@supabase/supabase-js');
const { lancamento_pluviais } = require("../queries/lancamento-pluviais-sql");
const fetchInsertOrUpdateLancamentoPluviais = require("../utils/insert-or-update-lanc-plu");

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
router.get("/insert-or-update-lancamento-pluviais", async (req, res) => {

    console.log('atualiza lançamento de águas pluviais');

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
            // for (let i = 0; i <= 22000; i = i + 200) {
            for (let i = 10000; i <= 15000; i = i + 200) {

                sleep(time).then(() => {
                    let ii = i + 200
                    let now = new Date()
                    console.log('upsert lancamento pluvial -----', i, ii, 'seg: ', begin.getSeconds(), 'now: ', now.getSeconds());

                    //let _query = dis_sub_por_query(i, ii);
                    let _query = lancamento_pluviais(i, ii);
                    // requisição

                    request.query(_query, async function (err, recordset) {
                        if (err) console.log(err);


                        let outorgas = recordset.recordsets[0].map((outorga, index) => {

                            // conversão para o formato postgres
                            let { x, y } = outorga.int_shape.points[0]
                            outorga.int_shape = `POINT(${x} ${y})`;
                            //outorga.ti_id = outorga.ti_id[0]
                            //outorga.ti_descricao = outorga.ti_descricao[0]

                            return outorga;
                        })

                        // ATUALIZAÇÃO 1
                        // atualização do banco azure postgres adasa
                       //fetchInsertOrUpdateLancamentoPluviais(outorgas);

                        // ATUALIZAÇÃO 2
                        // Atualização do banco supabase postgres
                       /*const { data, error } = await supabase
                            .from('lancamento_pluviais')
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
                        const { data, error } = await supabase
                            .from('lancamento_pluviais_sync')
                            .upsert(outorgas,
                                { onConflict: 'int_id' })
                            .select()
                        if (error) {
                            console.log(JSON.stringify({ message: error }))
                        } else {
                            console.log(JSON.stringify({ message: 'ok' }))
                        }


                    });

                });
                time = time + 3000

            }
        }

        saveEveryHundred();

    });


});

module.exports = router;
