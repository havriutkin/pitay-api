require('dotenv').config();
const session = require('express-session');
const pgStore = require('./pgStore.config');

module.exports.sessionMiddleware = session({
    store: pgStore,
    secret: process.env.SESSIONKEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
});

