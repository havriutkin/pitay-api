const { query } = require("../config/db.config");

/* ------------- CREATE ------------- */

module.exports.createQuestion = async ({question, lessonId}) => {
    const sql = "SELECT FROM insert_question($1, $2)";
    const parameters = [question, lessonId];

    try {
        const response = await query(sql, parameters);
        return response[0];
    } catch(err) {
        throw new Error(`Error when creating question: \n\t${err.message}`);
    }
}

/* ------------- READ ------------- */

module.exports.getQuestionById = async ({questionId}) => {
    const sql = "SELECT * FROM get_question_by_id($1)";
    const parameters = [questionId];

    try {
        const response = await query(sql, parameters);
        return response[0];
    } catch(err) {
        throw new Error(`Error when getting question by id: \n\t${err.message}`);
    }
}

module.exports.getQuestionsByLessonId = async ({lessonId}) => {
    const sql = "SELECT * FROM get_question_by_lesson_id($1)";
    const parameters = [lessonId];

    try {
        const response = await query(sql, parameters);
        return response;
    } catch(err) {
        throw new Error(`Error when getting question by lesson id: \n\t${err.message}`);
    }
}