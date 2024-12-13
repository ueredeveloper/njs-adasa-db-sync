// Importa os módulos necessários
const { Client } = require('pg');
const sql = require('mssql');
require('dotenv').config();

const fs = require('fs');        // File system
const path = require('path');    // File path utilities
const wellknown = require('wellknown'); // GeoJSON to WKT converter

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

        records.slice(1).map(r=> console.log(r))

        

        // Insere os dados no PostgreSQL
        for (const record of records) {
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

//migrateUnidadesHidrograficas();
//migrateBaciasHidrograficas();
//migrateHidrogeoFraturado();
//migratePoroso();


