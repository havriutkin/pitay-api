const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const { passport } = require('../config/passport.config');


module.exports.signUp = async (req, res, next) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await userService.createUser({username, password: hashedPassword, email});
        const userId = result[0].insert_user;
        const user = {
            id: userId,
            username: username,
            email: email
        }
        req.login(user, (err) => {
            if (err) { return next(err) }
            res.status(201).json({
                message: "Successfully signed up and logged in.",
                user: user
            })
        })
    } catch(err) {
        return next(err);
    }
}

module.exports.loginPassword = async (req, res, next) => {
    passport.authenticate('local', (err, user, _) => {
        if (err) { return next(err) }
        if (!user) { return res.status(401).json({ message: 'Authentication failed' }) }
        req.login(user, (err) => {
            if (err) { return next(err) }
            return res.status(200).json({ 
                message: 'Successfully logged in', 
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        })
    })(req, res, next);
}

module.exports.logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err) }
        res.status(200).json({ message: 'Successfully logged out'} )
    })
}