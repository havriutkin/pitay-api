require('dotenv').config();
const pgSession = require('connect-pg-simple');

module.exports.pgStore = new pgSession({
    conString: `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
})