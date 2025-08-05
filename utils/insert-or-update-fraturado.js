// Import the 'pg' module
const { Client } = require('pg');

require('dotenv').config();
// Extract variables from the .env file

async function insertOrUpdateFraturado(system) {

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
            UPDATE hidrogeo_fraturado
            SET qtd_pocos = $1, pct_utilizada = $2
            WHERE objectid = $3
        `;

        const values = [
            system.qtd_pocos,
            system.pct_utilizada,
            system.OBJECTID
        ];

        await client.query(query, values);

    } catch (err) {
        console.error('Error executing query', err.stack);
    }
    finally {
        await client.end();
    }


}

module.exports = insertOrUpdateFraturado;