const { query } = require("../config/db.config");

/* ------------- CREATE ------------- */

module.exports.createLesson = async ({title, ownerId}) => {
    // TODO: GENERATE PRIVATE AND PUBLIC KEYS BASED ON TITLE AND OWNERID AND RANDOM
    const privateKey = "TODO";
    const publicKey = "TODO";
    const sql = "SELECT FROM insert_lesson($1, $2, $3, $4)";
    const parameters = [title, privateKey, publicKey, ownerId]
    try {
        const response = await query(sql, parameters);
        return response[0];
    } catch(err) {
        throw new Error(`Error when creating lesson: \n\t${err.message}`)
    }
}

/* ------------- READ ------------- */

module.exports.getLessonById = async ({lessonId}) => {
    const sql = "SELECT * FROM get_lesson_by_id($1)";
    const parameters = [lessonId];

    try {
        const response = await query(sql, parameters);
        return response[0];
    } catch(err) {
        throw new Error(`Error when getting lesson by id: \n\t${err.message}`);
    }
}

module.exports.getLessonByPublicKey = async ({publicKey}) => {
    const sql = "SELECT * FROM get_lesson_by_public_key($1)";
    const parameters = [publicKey];
    try {
        const response = await query(sql, parameters);
        return response[0];
    } catch(err) {
        throw new Error(`Error when getting lesson by public key: \n\t${err.message}`);
    }
}

module.exports.getLessonsByOwnerId = async ({ownerId}) => {
    const sql = "SELECT * FROM get_lesson_by_owner_id($1)";
    const parameters = [ownerId];

    try {
        const response = await query(sql, parameters);
        return response;
    } catch(err) {
        throw new Error(`Error when getting lesson by owner id: \n\t${err.message}`);
    }
}