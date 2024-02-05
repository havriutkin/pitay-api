const questionService = require('../services/questionService');

module.exports.getByLessonId = async (req, res, next) => {
    const lessonId = req.params.lessonId;

    try {
        const questions = await questionService.getQuestionsByLessonId({lessonId});
        return res.status(200).json({
            message: 'Success.',
            questions: questions
        });
    } catch(err) {
        const newError = new Error(`Question controller error when getting by lesson id.\n\t${err.message}`);
        return next(newError);
    }
}

// Can only update isAnswered state
module.exports.update = async (req, res, next) => {
    const questionId = req.params.questionId;
    const currentQuestionObj = req.body.questionObj;

    const isAnswered = req.body.isAnswered || currentQuestionObj.isAnswered;
    const question = currentQuestionObj.question;

    try {
        await questionService.updateQuestionById({questionId, question, isAnswered});
        res.status(200).json({
            message: 'Success. Question was updated'
        })
    } catch(err) {
        const newError = new Error(`Question controller error when updating.\n\t${err.message}`);
        return next(newError);
    }
}