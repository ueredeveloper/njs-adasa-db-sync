// Importa os módulos necessários
const { Client } = require('pg');
const sql = require('mssql');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const fs = require('fs');        // File system
const path = require('path');    // File path utilities
const wellknown = require('wellknown'); // GeoJSON to WKT converter


const { ADASA_HOST, ADASA_DATABASE, ADASA_USERNAME, ADASA_PASSWORD, SUPABASE_URL, SUPABASE_KEY } = process.env;


const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Migração de tabelas estáticas como Unidades Hidrográficas, Bacias Hidrográficas, Hidrogeo Fraturado e Poroso
 * Como usar:  Mostre a função que deve ser chamada, por exemplo: migrateUnidadesHidrograficas (), 
 * e no console digite node utils/migrate-tables.js
 */

async function migrateHidrogeoFraturado() {
    // Configuração para o banco PostgreSQL
    const pgClient = new Client({
        connectionString: process.env.DATABASE_URL,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT || 5432,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl: { rejectUnauthorized: false },
    });

    // Configuração para o banco SQL Server
    const sqlConfig = {
        user: process.env.ADASA_USERNAME,
        password: process.env.ADASA_PASSWORD,
        server: process.env.ADASA_HOST,
        database: process.env.ADASA_DATABASE,
        trustServerCertificate: true,
    };

    try {
        // Conecta ao PostgreSQL
        await pgClient.connect();

        // Conecta ao SQL Server
        /* await sql.connect(sqlConfig);
 
         // Query no SQL Server
         const query = `
             SELECT 
                 [OBJECTID] AS objectid,
                 [uh_nome] AS un_nome,
                 [uh_codigo] AS uh_codigo,
                 [bacia_nome] AS bacia_nome,
                 [UH_LABEL] AS uh_label,
                 [NOME] AS nome,
                 [Hidrogeo] AS hidrogeo,
                 [Vazão] AS vazao,
                 [Area_sq_m] AS area_sq_m,
                 [Sistema] AS sistema,
 
                 [Subsistema] AS subsistema,
                 [REF] AS ref,
                 [RR_cm_ano] AS rr_cm_ano,
                 [Esp_raso] AS esp_raso,
                 [Ifr] AS ifr,
                 [RPR_cm_an] AS rpr_cm_an,
                 [Esp_profun] AS esp_profun,
                 [Ifp] AS ifp,
                 [RPP_cm_an] AS rpp_cm_an,
                 [RP_cm_ano] AS rp_cm_ano,
                 
                 [F_RPD] AS f_rpd,
                 [RPD] AS rpd,
                 [RE_cm_an] AS re_cm_an,
                 [Cod_plan] AS cod_plan,
                 [Shape].ToString() AS shape,
                 [GDB_GEOMATTR_DATA] AS gdb_geomattr_data
 
             FROM [SRH].[gisadmin].[HIDROGEO_FRATURADO_UH]
         `;
 
         const result = await sql.query(query);
 
         const records = result.recordset;*/

        // Migrando a partir de um json.
        const filePath = path.join(__dirname, '../json/hidrogeo-fraturado.json');
        const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        console.log(records.length)

        // Insere os dados no PostgreSQL
        for (const record of records) {
            const insertQuery = `
                INSERT INTO hidrogeo_fraturado (
                        objectid,
                        uh_nome,
                        uh_codigo,
                        bacia_nome,
                        uh_label,
                        nome,
                        hidrogeo,
                        vazao,
                        area_sq_m,
                        sistema,

                        subsistema,
                        ref,
                        rr_cm_ano,
                        esp_raso,
                        ifr,
                        rpr_cm_an,
                        esp_profun,
                        ifp,
                        rpp_cm_an,
                        rp_cm_ano,

                        f_rpd,
                        rpd,
                        re_cm_an,
                        cod_plan,
                        shape,
                        gdb_geomattr_data
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 
                    $17, $18, $19, $20, $21, $22, $23, $24, ST_GeomFromWKB($25, 4674), $26
                )
            `;

            const values = [
                record.objectid,
                record.uh_nome,
                record.uh_codigo,
                record.bacia_nome,
                record.uh_label,
                record.nome,
                record.hidrogeo,
                record.vazao,
                record.area_sq_m,
                record.sistema,
                record.subsistema,

                record.ref,
                record.rr_cm_ano,
                record.esp_raso,
                record.ifr,
                record.rpr_cm_an,
                record.esp_profun,
                record.ifp,
                record.rpp_cm_an,
                record.rp_cm_ano,
                record.f_rpd,
                record.rpd,

                record.re_cm_an,
                record.cod_plan,
                Buffer.from(record.shape, 'hex'),
                record.gdb_geomattr_data
            ];

            await pgClient.query(insertQuery, values);
        }

        console.log("Dados inseridos com sucesso!");

    } catch (err) {
        console.error("Erro durante a operação:", err);
    } finally {
        // Fecha as conexões
        await pgClient.end();
        sql.close();
    }
}

async function migratePoroso() {
    // Configuração para o banco PostgreSQL
    const pgClient = new Client({
        connectionString: process.env.DATABASE_URL,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT || 5432,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl: { rejectUnauthorized: false },
    });

    // Configuração para o banco SQL Server
    const sqlConfig = {
        user: process.env.ADASA_USERNAME,
        password: process.env.ADASA_PASSWORD,
        server: process.env.ADASA_HOST,
        database: process.env.ADASA_DATABASE,
        trustServerCertificate: true,
    };

    try {
        // Conecta ao PostgreSQL
        await pgClient.connect();

        // Conecta ao SQL Server
        await sql.connect(sqlConfig);

        // Migrando a partir de um json.
        const filePath = path.join(__dirname, '../json/hidrogeo-poroso.json');
        const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Insere os dados no PostgreSQL
        for (const record of records) {

            const insertQuery = `
                INSERT INTO hidrogeo_poroso (
                    objectid, 
                    uh_nome, 
                    uh_codigo, 
                    bacia_nome, 
                    uh_label, 
                    sistema, 
                    q_media, 
                    area_sq_m, 
                    b_m, 
                    ne, 

                    rp, 
                    re, 
                    rr, 
                    re_cm_ano, 
                    cod_plan, 
                    shape, 
                    gdb_geomattr_data
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, 
                    $7, $8, $9, $10, $11, $12, $13, $14, 
                    $15, ST_GeomFromWKB($16, 4674), $17
                )
            `;

            const values = [
                record.objectid,
                record.uh_nome,
                record.uh_codigo,
                record.bacia_nome,
                record.uh_label,
                record.sistema,
                record.q_media,
                record.area_sq_m,
                record.b_m,
                record.ne,

                record.rp,
                record.re,
                record.rr,
                record.re_cm_ano,
                record.cod_plan,
                Buffer.from(record.shape, 'hex'),
                record.gdb_geomattr_data
            ];

            await pgClient.query(insertQuery, values);
        }

        console.log("Dados inseridos com sucesso!");

    } catch (err) {
        console.error("Erro durante a operação:", err);
    } finally {
        // Fecha as conexões
        await pgClient.end();
        sql.close();
    }
}

async function migrateBaciasHidrograficas() {
    // Configuração para o banco PostgreSQL
    const pgClient = new Client({
        connectionString: process.env.DATABASE_URL,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT || 5432,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl: { rejectUnauthorized: false },
    });



    try {
        // Conecta ao PostgreSQL
        await pgClient.connect();

        // Migrando a partir de um json.
        const filePath = path.join(__dirname, '../json/bacias-hidrograficas.json');
        const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        records.slice(1).map(r => console.log(r))



        // Insere os dados no PostgreSQL
        for (const record of records) {

            // ATUALIZAÇÃO 1 - No banco azure adasa

            const insertQuery = `
                INSERT INTO bacias_hidrograficas (
                objectid, 
                bacia_nome, 
                shape_leng, 
                shape, 
                gdb_geomattr_data, 
                bacia_cod
                ) VALUES (
                    $1, $2, $3, ST_GeomFromWKB($4, 4674), $5, $6
                )   
            `;

            const values = [
                record.objectid,
                record.bacia_nome,
                record.shape_leng,
                Buffer.from(record.shape, 'hex'),
                record.gdb_geomattr_data,
                record.bacia_cod,
            ];

            await pgClient.query(insertQuery, values);


        }

        console.log("Dados inseridos com sucesso!");

    } catch (err) {
        console.error("Erro durante a operação:", err);
    } finally {
        // Fecha as conexões
        await pgClient.end();
        sql.close();
    }
}
/**
 * Esta tabela será migrada a partir de um json que tem, além das informações no banco de dados SQL Server, 
 * as vazões mensais de cada polígono. 
 */
async function migrateUnidadesHidrograficas() {
    // Configuração para o banco PostgreSQL
    const pgClient = new Client({
        connectionString: process.env.DATABASE_URL,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT || 5432,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl: { rejectUnauthorized: false },
    });

    // Configuração para o banco SQL Server
    const sqlConfig = {
        user: process.env.ADASA_USERNAME,
        password: process.env.ADASA_PASSWORD,
        server: process.env.ADASA_HOST,
        database: process.env.ADASA_DATABASE,
        trustServerCertificate: true,
    };

    try {
        // Conecta ao PostgreSQL
        await pgClient.connect();

        /* Se fosse buscar a uh no banco Sql Server da Adasa.

        // Conecta ao SQL Server
        await sql.connect(sqlConfig);

        // Query no SQL Server
        const query = `
            SELECT 
                 [OBJECTID] objectid
                ,[uh_nome]
                ,[uh_codigo]
                ,[bacia_nome]
                ,[bacia_codi]
                ,[subbacia_n]
                ,[subbcia_co]
                ,[shape_leng]
                ,[rg_hidro]
                ,[UH_LABEL] uh_label

                ,[Shape].ToString() shape
                ,[GDB_GEOMATTR_DATA] gdb_geomattr_data
                ,[Area_Km_sq] area_km_sq
                ,[ID_BACIA] id_bacia
            FROM [SRH].[gisadmin].[UNIDADES_HIDROGRAFICAS]
        `;*/

        //const result = await sql.query(query);

        // const records = result.recordset;


        // Migrando a partir de um json.
        const filePath = path.join(__dirname, '../json/unidades-hidrograficas.json');
        const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        console.log(records.length)

        // Insere os dados no PostgreSQL

        for (const record of records) {
            const insertQuery = `
                INSERT INTO unidades_hidrograficas (
                    objectid,
                    uh_nome,
                    uh_codigo,
                    bacia_nome,
                    bacia_codi,
                    subbacia_n,
                    subbcia_co,
                    shape_leng,
                    rg_hidro,
                    uh_label,

                    shape,
                    gdb_geomattr_data,
                    area_km_sq,
                    id_bacia,

                    qmm_jan,
                    qmm_fev,
                    qmm_mar,
                    qmm_abr,
                    qmm_mai,
                    qmm_jun,
                    qmm_jul,
                    qmm_ago,
                    qmm_set,
                    qmm_out,
                    qmm_nov,
                    qmm_dez
                ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                ST_GeomFromWKB($11, 4674), $12, $13, $14, $15, $16, $17, $18, $19, $20,
                $21, $22, $23, $24, $25, $26
                )
            `;

            const values = [
                record.objectid,
                record.uh_nome,
                record.uh_codigo,
                record.bacia_nome,
                record.bacia_codi,
                record.subbacia_n,
                record.subbcia_co,
                record.shape_leng,
                record.rg_hidro,
                record.uh_label,

                Buffer.from(record.shape, 'hex'),
                record.gdb_geomattr_data,
                record.area_km_sq,
                record.id_bacia,

                record.qmm_jan,
                record.qmm_fev,
                record.qmm_mar,
                record.qmm_abr,
                record.qmm_mai,
                record.qmm_jun,
                record.qmm_jul,
                record.qmm_ago,
                record.qmm_set,
                record.qmm_out,
                record.qmm_nov,
                record.qmm_dez,
            ];

            await pgClient.query(insertQuery, values); // 434 line
        }


        //  console.log("Dados inseridos com sucesso!");

    } catch (err) {
        console.error("Erro durante a operação:", err);
    } finally {
        // Fecha as conexões
        await pgClient.end();
        sql.close();
    }
}


async function migrateOttoBacias() {
    // Configuração para o banco PostgreSQL
    const pgClient = new Client({
        connectionString: process.env.DATABASE_URL,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT || 5432,
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        ssl: { rejectUnauthorized: false },
    });

    // Configuração para o banco SQL Server
    const sqlConfig = {
        user: process.env.ADASA_USERNAME,
        password: process.env.ADASA_PASSWORD,
        server: process.env.ADASA_HOST,
        database: process.env.ADASA_DATABASE,
        trustServerCertificate: true,
    };

    let _verify_column_error;

    try {
        // Conecta ao PostgreSQL
        await pgClient.connect();

        // Conecta ao SQL Server
        await sql.connect(sqlConfig);

        // Migrando a partir de um json.
        const filePath = path.join(__dirname, '../json/a-d-bho-211022.json');
        const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // console.log(records.features)

       /* for (const record of records.features) {
            if (record.geometry.rings.length === 3) console.log('result: ', "ring", record.geometry.rings, 'OBJECTID', record.attributes)
        }*/

        // Insere os dados no PostgreSQL
        for (const record of records.features) {

            // console.log(record.attributes.OBJECTID)

           // console.log('--------------------------> ', record.geometry.rings.length)
            let coordinates;

            /*
            // Se polígon adiciona chaves para salvar como multipolígono
            if (record.geometry.rings.length < 3) {
                // É um Polygon, transformamos em MultiPolygon
                coordinates = {
                    type: "Polygon",
                    coordinates: record.geometry.rings
                }

                // Se multipolígono, salva como está
            } else {
                // Já está no formato de MultiPolygon
                coordinates = {
                    type: "MultiPolygon",
                    coordinates: record.geometry.rings
                }
            }
*/

            coordinates = {
                    type: "Polygon",
                    coordinates: record.geometry.rings
                }



            const insertQuery = `
                INSERT INTO otto_bacias (
                    objectid,
                    fid_geoft_,
                    fid_1,
                    dra_pk,
                    idbacia,
                    cotrecho,
                    cocursodag,
                    cobacia,
                    nuareacont,
                    nuordemcda,
                    nunivotto1,
                    nunivotto2,
                    nunivotto3,
                    nunivotto4,
                    nunivotto5,
                    nunivotto6,
                    nunivotto,
                    dsversao,
                    st_area_ge,
                    st_perimet,
                    shape__are,
                    shape__len,
                    uh_nome,
                    uh_rotulo,
                    classe,
                    shape_length,
                    shape_area,
                    geometry
                )
                VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                    $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                    $21, $22, $23, $24, $25, $26, $27,
                    ST_Transform(ST_SetSRID(ST_GeomFromGeoJSON($28), 4326), 4674)
                )
            `;

            const values = [
                record.attributes.OBJECTID,
                record.attributes.fid_geoft_,
                record.attributes.fid_1,
                record.attributes.dra_pk,
                record.attributes.idbacia,
                record.attributes.cotrecho,
                record.attributes.cocursodag,
                record.attributes.cobacia,
                record.attributes.nuareacont,
                record.attributes.nuordemcda,
                record.attributes.nunivotto1,
                record.attributes.nunivotto2,
                record.attributes.nunivotto3,
                record.attributes.nunivotto4,
                record.attributes.nunivotto5,
                record.attributes.nunivotto6,
                record.attributes.nunivotto,
                record.attributes.dsversao,
                record.attributes.st_area_ge,
                record.attributes.st_perimet,
                record.attributes.Shape__Are,
                record.attributes.Shape__Len,
                record.attributes.UH_Nome,
                record.attributes.UH_rotulo,
                record.attributes.Classe,
                record.attributes.Shape_Length,
                record.attributes.Shape_Area,
                JSON.stringify(coordinates)
            ];



            _verify_column_error = record.attributes

            await pgClient.query(insertQuery, values);
        }

        console.log("Dados inseridos com sucesso!");

    } catch (err) {
        console.error("Erro durante a operação:", err, _verify_column_error);
    } finally {
        // Fecha as conexões
        await pgClient.end();
        sql.close();
    }
}



// configurações do banco
const config = {
    user: ADASA_USERNAME,
    password: ADASA_PASSWORD,
    server: ADASA_HOST,
    database: ADASA_DATABASE,
    trustServerCertificate: true,
};

/**
 * Busca os polígonos no banco de dados local (Sql Server) e migra para outro banco supabase (Postgres)
 */
async function migrateFromSupabaseUnidadesHidrograficas() {

    // Leitura dos polígonos em formato Json.
    const filePath = path.join(__dirname, '../json/unidades-hidrograficas.json');
    const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Migração dos polígonos lidos para outro banco (Supabase, postgres)
    for (const record of records) {
        // Migra os polígonos selecionados para outro banco de dados, no caso j-water-grantes - postgres
        const { data, error } = await supabase
            .from('unidades_hidrograficas')
            .upsert(record,
                { onConflict: 'objectid' })
            .select()
        if (error) {
            console.log(JSON.stringify({ message: error }))
        } else {
            console.log(JSON.stringify({ message: 'ok' }))
        }
    }

}

/**
 * Busca os polígonos no banco de dados local (Sql Server) e migra para outro banco supabase (Postgres)
 */
async function migrateFromSupabaseBaciasHidrograficas() {

    // Leitura dos polígonos em formato Json.
    const filePath = path.join(__dirname, '../json/bacias-hidrograficas.json');
    const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Migração dos polígonos lidos para outro banco (Supabase, postgres)
    for (const record of records) {
        // Migra os polígonos selecionados para outro banco de dados, no caso j-water-grantes - postgres
        const { data, error } = await supabase
            .from('bacias_hidrograficas')
            .upsert(record,
                { onConflict: 'objectid' })
            .select()
        if (error) {
            console.log(JSON.stringify({ message: error }))
        } else {
            console.log(JSON.stringify({ message: 'ok' }))
        }
    }

}

/**
 * Busca os polígonos no banco de dados local (Sql Server) e migra para outro banco supabase (Postgres)
 */
async function migrateFromSupabaseHidrogeoFraturado() {

    // Leitura dos polígonos em formato Json.
    const filePath = path.join(__dirname, '../json/hidrogeo-fraturado.json');
    const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Migração dos polígonos lidos para outro banco (Supabase, postgres)
    for (const record of records) {
        // Migra os polígonos selecionados para outro banco de dados, no caso j-water-grantes - postgres
        const { data, error } = await supabase
            .from('hidrogeo_fraturado')
            .upsert(record,
                { onConflict: 'objectid' })
            .select()
        if (error) {
            console.log(JSON.stringify({ message: error }))
        } else {
            console.log(JSON.stringify({ message: 'ok' }))
        }
    }

}

/**
 * Busca os polígonos no banco de dados local (Sql Server) e migra para outro banco supabase (Postgres)
 */
async function migrateFromSupabaseHidrogeoPoroso() {

    // Leitura dos polígonos em formato Json.
    const filePath = path.join(__dirname, '../json/hidrogeo-poroso.json');
    const records = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Migração dos polígonos lidos para outro banco (Supabase, postgres)
    for (const record of records) {
        // Migra os polígonos selecionados para outro banco de dados, no caso j-water-grantes - postgres
        const { data, error } = await supabase
            .from('hidrogeo_poroso')
            .upsert(record,
                { onConflict: 'objectid' })
            .select()
        if (error) {
            console.log(JSON.stringify({ message: error }))
        } else {
            console.log(JSON.stringify({ message: 'ok' }))
        }
    }

}

//31/01/2025 - Foi feito a migração destas tabelas para o banco postgres supabase (j-water-grants)
//migrateFromSupabaseUnidadesHidrograficas();
//migrateFromSupabaseBaciasHidrograficas ();
//migrateFromSupabaseHidrogeoFraturado ()
//migrateFromSupabaseHidrogeoPoroso();

// Migração para o banco postgres - adasa
//migrateUnidadesHidrograficas();
//migrateBaciasHidrograficas();
//migrateHidrogeoFraturado();
//migratePoroso();

migrateOttoBacias();


