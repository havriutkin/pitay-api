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