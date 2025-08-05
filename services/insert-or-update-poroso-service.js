/**
 * Rota para sincronizar dados do sistema poroso entre um banco SQL Server local e um 
 * banco PostgreSQL no Azure.
 *
 * @module routers/insertOrUpdateFraturadoService
 * @requires express
 * @requires mssql
 * @requires xml2js
 * @requires dotenv
 *
 * @description
 * Esta rota conecta-se ao banco de dados SQL Server local, executa uma consulta e 
 * calcula número de poçose porcentagem de utilização dos subsistemas poroso. 
 * Na sequência atualiza outro banco postgres.
 */

// Importações de bibliotecas e módulos

const sql = require("mssql");
const xml2js = require('xml2js');
const { createClient } = require('@supabase/supabase-js');
const { calculate_number_of_interferecies_and_percentage_poroso } = require("../queries/calculate-system-percentage-utilization");
const insertOrUpdateFraturado = require("../utils/insert-or-update-fraturado");
const insertOrUpdatePoroso = require("../utils/insert-or-update-poroso");



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
 * @memberof module:routers/insertOrUpdateFraturadoService
 * @param {Object} req - Objeto de solicitação do Express.
 * @param {Object} res - Objeto de resposta do Express.
 *
 * @description
 * Calcula número de poços e porcentagem de utilização de um subsistema e atualiza no banco postgres.
 */
router.get("/insert-or-update-poroso", async (req, res) => {

    console.log('atualiza número de poços e porcentagem no sistema poroso');

    sql.connect(config, function (err) {
        if (err) console.log(err);
        // criar requisisão
        var request = new sql.Request();

        for (let objectId = 1; objectId <= 141; objectId++) {

            let _query = calculate_number_of_interferecies_and_percentage_poroso (objectId);

            request.query(_query, async function (err, recordset) {
                if (err) {
                    console.log(err);
                }

                try {
                    // ATUALIZAÇÃO 1
                    // Envia lista de outorgas para inserir ou atualizar no banco postgres
                    if (recordset.recordset[0] !== undefined) {
                        //response.push(recordset.recordset[0])

                        console.log(recordset.recordset[0])

                        insertOrUpdatePoroso(recordset.recordset[0]);
                    }

                    // ATUALIZAÇÃO 2
                    // Atualização do banco supabase postgres
                    /*const { data, error } = await supabase
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
                    // Atualização do banco supabase postgres - db=name=j-water-grants
                    /* const { data, error } = await supabase
                         .from('barragem_sync')
                         .upsert(outorgas,
                             { onConflict: 'int_id' })
                         .select()
                     if (error) {
                         console.log(JSON.stringify({ message: error }))
                     } else {
                         console.log(JSON.stringify({ message: 'ok' }))
                     }*/


                } catch (error) {
                    console.log(error, recordset);
                }
               

            });

        }

    });

});

module.exports = router;
