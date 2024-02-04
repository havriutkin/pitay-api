const questionService = require('../services/questionService');
const lessonService = require('../services/lessonService');

// ! Authorization must be abstracted as middleware

// TODO update -> change status
// TODO delete 

module.exports.getByLessonId = async (req, res, next) => {
    const lessonId = req.params.lessonId;

    // Check if user owns this lesson
    try {
        const lesson = await lessonService.getLessonById({lessonId});
        if (lesson[0].owner_id !== req.user.id) {
            return res.status(401).json({
                message: 'Not owner.'
            });
        }
    } catch(err) {
        const newError = new Error(`Question controller error when ensuring authorization.\n\t${err.message}`);
        return next(newError);
    }

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
    // TODO
    try {
        const questionId = req.params.questionId;
        const currentQuestionObj = (await questionService.getQuestionById({questionId}))[0];

        // Check if user owns this lesson
        const lesson = await lessonService.getLessonById({lessonId: currentQuestionObj.lesson_id});
        if (lesson[0].owner_id !== req.user.id) {
            return res.status(401).json({
                message: 'Not owner.'
            });
        }
        
        const isAnswered = req.body.isAnswered || currentQuestionObj.isAnswered;
        const question = currentQuestionObj.question;

        await questionService.updateQuestionById({questionId, question, isAnswered});
        res.status(200).json({
            message: 'Success. Question was updated'
        })
    } catch(err) {
        const newError = new Error(`Question controller error when updating.\n\t${err.message}`);
        return next(newError);
    }
}