const questionService = require('../services/questionService');
const lessonService = require('../services/lessonService');

module.exports.confirmAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Not authenticated." });
}

// TODO create middleware for authorization 
module.exports.checkLessonOwnership = async (req, res, next) => {
    const userId = req.user.id;
    let lessonId = req.params.lessonId || null;
    let questionId = req.params.questionId || null;

    try {
        // If questionID provided, retrieve lessonId
        if (questionId) {
            const currentQuestionObj = (await questionService.getQuestionById({questionId}))[0];
            req.body.questionObj = currentQuestionObj;  // Attach question to request
            lessonId = currentQuestionObj.lesson_id;
        }

        // Retrieve lesson by id
        if (!lessonId) { return res.status(400).json({ message: 'Bad request.' })};
        const lesson = await lessonService.getLessonById({lessonId});

        if (lesson[0].owner_id == userId) {
            return next();
        }

        return res.status(401).json({
            message: 'Not owner.'
        });
    } catch(err) {
        const newError = new Error(`Error when ensuring lesson ownership ${err.message}`);
        return next(newError);
    }
}