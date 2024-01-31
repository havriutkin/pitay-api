// ? Should try-except query block be a separate function? Check what returned data looks like

const { query } = require('../config/db.config');

/* ------------- CREATE ------------- */

module.exports.createUser = async ({username, password, email}) => {
    // ! NOT SAVE. PASSWORD MUST BE HASHED
    const sql = "SELECT insert_user($1, $2, $3)";
    const parameters = [username, password, email]
    try {
        const result = await query(sql, parameters);
        return result;
    } catch(err) {
        throw new Error(`Error when creating user: \n\t${err.message}`);
    }
}


/* ------------- READ ------------- */

module.exports.getUserById = async ({userId}) => {
    const sql = "SELECT * FROM get_user_by_id($1)";
    const parameters = [userId];
    try {
        const result = await query(sql, parameters);
        return result;
    } catch (err) {
        throw new Error(`Error when getting user by id: \n\t${err.message}`);
    }
}

module.exports.getUserByEmail = async ({email}) => {
    const sql = "SELECT * FROM get_user_by_email($1)";
    const parameters = [email];
    try {
        const result = await query(sql, parameters);
        return result;
    } catch(err) {
        throw new Error(`Error when getting user by email: \n\t${err.message}`);
    }
}


/* ------------- UPDATE ------------- */

module.exports.updateUserById = async ({userId, username, password, email}) => {
    const sql = "SELECT update_user($1)";
    const parameters = [userId, username, password, email];
    // ! NOT SAFE. PASSWORD IS NOT HASHED
    // TODO HASH PASSWORD
    try {
        const result = await query(sql, parameters);
        return result;
    } catch(err) {
        throw new Error(`Error when updating user by id: \n\t${err.message}`);
    }
}

/* ------------- DELETE ------------- */

module.exports.deleteUserById = async ({userId}) => {
    const sql = "SELECT delete_user($1)";
    const parameters = [userId];

    try {
        const result = await query(sql, parameters);
        return result;
    } catch(err) {
        throw new Error(`Error when deleting user by id: \n\t${err.message}`);
    }
}
