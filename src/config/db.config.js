require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
});

const query = async(sql, params) => {
    try {
        const result = await pool.query(sql, params);
        return result.rows;
    } catch (err) {
        throw new Error(`Error when querying db: ${err.message}`);
    }
}

module.exports = {query, pool}