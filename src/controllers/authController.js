const userService = require('../services/userService');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await userService.createUser({username, password: hashedPassword, email});
        const userId = result[0].insert_user;
        res.status(201).json({
            message: "Success.",
            userId: userId
        });
    } catch(err) {
        next(err);
    }
}