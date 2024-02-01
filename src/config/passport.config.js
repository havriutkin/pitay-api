const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(async function verify(email, password, cb){
    try {
        const data = await userService.getUserByEmail({email});

        if (data.length < 1){
            return cb(null, false, {message: 'Incorrect email or password'});
        }

        if (!await bcrypt.compare(password, data[0].password)){
            return cb(null, false, {message: 'Incorrect email or password'});
        }

        return cb(null, data[0]);

    } catch(err) {
        cb(err);
    }

}));

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, {
            id: user.id,
            username: user.username,
            email: user.email
        })
    })
})

passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    })
})

module.exports = { passport };