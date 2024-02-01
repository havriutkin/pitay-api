require('dotenv').config();
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { pool } = require('./db.config');

module.exports.middleware = session({
    store: new pgSession({
        pool: pool,
    }),
    secret: process.env.SESSIONKEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
});

