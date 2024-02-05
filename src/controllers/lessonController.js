const lessonService = require('../services/lessonService');


module.exports.create = async(req, res, next) => {
    const title = req.body?.title || false;
    const ownerId = req.user.id;    // ! Route must be protected by auth middleware 

    if (!title) {return res.status(400).json({message: 'No title provided.'})};

    try {
        const result = await lessonService.createLesson({title, ownerId});
        return res.status(201).json({
            message: 'Success.',
            publicKey: result[0].insert_lesson
        })
    } catch(err) {
        const newError = new Error(`Lesson controller error when creating.\n\t${err.message}`);
        return next(newError);
    }

}

const getById = async (req, res, next) => {
    const lessonId = req.query.lessonId;

    try {
        const result = await lessonService.getLessonById({ lessonId });
        if (result.length === 0) {
            return res.status(404).json({
                message: 'No lesson with given id found.'
            });
        }

        const lesson = {
            id: result[0].id,
            title: result[0].title,
            publicKey: result[0].public_key,
            ownerId: result[0].owner_id
        }

        return res.status(200).json({
            message: "Success.",
            lesson: lesson
        });
    } catch(err) {
        const newError = new Error(`Lesson controller error when getting by id.\n\t${err.message}`);
        return next(newError);
    }
}

const getByOwnerId = async  (req, res, next) => {
    const ownerId = req.query.ownerId;

    try {
        const result = await lessonService.getLessonsByOwnerId({ownerId});
        const lessons = result.map(lesson => {
            return {
                id: lesson.id,
                title: lesson.title,
                publicKey: lesson.public_key,
                ownerId: lesson.owner_id
            }
        })

        return res.status(200).json({
            message: 'Success.',
            lessons: lessons
        })
    } catch(err) {
        const newError = new Error(`Lesson controller error when getting by owner id.\n\t${err.message}`);
        return next(newError);
    }
}

const getByPublicKey = async (req, res, next) => {
    const publicKey = req.query.publicKey;

    try {
        const result = await lessonService.getLessonByPublicKey({ publicKey });
        if (result.length === 0) {
            return res.status(404).json({
                message: 'No lesson with given public key found.'
            });
        }

        const lesson = {
            id: result[0].id,
            title: result[0].title,
            publicKey: result[0].public_key,
            ownerId: result[0].owner_id
        }

        return res.status(200).json({
            message: "Success.",
            lesson: lesson
        });
    } catch(err) {
        const newError = new Error(`Lesson controller error when getting by public key.\n\t${err.message}`);
        return next(newError);
    }
}

module.exports.get = async (req, res, next) => {
    const { lessonId, ownerId, publicKey } = req.query;
    if (lessonId) { return getById(req, res, next) }
    if (ownerId) { return getByOwnerId(req, res, next) }
    if (publicKey) { return getByPublicKey(req, res, next) }

    return res.status(400).json({
        message: 'Bad request.'
    });
}

module.exports.update = async(req, res, next) => {
    const lessonId = req.params.lessonId;
    const title = req.body?.title || false;

    if (!title) {return res.status(400).json({message: 'No title provided.'})};

    try {
        const result = await lessonService.updateLessonById({lessonId, title});
        return res.status(201).json({
            message: 'Success.',
            publicKey: result[0].update_lesson
        })
    } catch(err) {
        const newError = new Error(`Lesson controller error when updating.\n\t${err.message}`);
        return next(newError);
    }
}

module.exports.delete = async (req, res, next) => {
    const lessonId = req.params?.lessonId;

    try {
        await lessonService.deleteLessonById({ lessonId });
        return res.status(200).json({
            message: "Lesson was deleted."
        })
    } catch(err) {
        const newError = new Error(`Lesson controller error when deleting.\n\t${err.message}`);
        return next(newError);
    }
}