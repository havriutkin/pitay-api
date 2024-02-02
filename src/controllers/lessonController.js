const lessonService = require('../services/lessonService');

/*
    TODO change route params to query string parameters
    TODO change update and delete to public key as identifier
    ! ATTENTION
*/


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
        next(newError);
    }

}

module.exports.getById = async (req, res, next) => {
    const lessonId = req.params?.lessonId || false;
    
    if (!lessonId) {
        return res.status(400).json({
            message: 'No id provided.'
        })
    }

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
        next(newError);
    }
}

module.exports.getByOwnerId = async  (req, res, next) => {
    const ownerId = req.params?.ownerId || false;

    if (!ownerId) {
        return res.status(400).json({
            message: 'No owner id provided.'
        })
    }

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
        next(newError);
    }
}

module.exports.getByPublicKey = async (req, res, next) => {
    const publicKey = req.params?.publicKey || false;
    
    if (!publicKey) {
        return res.status(400).json({
            message: 'No public key provided.'
        })
    }

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
        next(newError);
    }
}

module.exports.update = async(req, res, next) => {
    const lessonId = req.params.lessonId;
    const title = req.body?.title || false;
    const ownerId = req.user.id;    // ! Route must be protected by auth middleware

    if (!title) {return res.status(400).json({message: 'No title provided.'})};

    // Check if user owns this lesson
    const lesson = await lessonService.getLessonById({lessonId});
    if (lesson[0].owner_id !== ownerId) {
        return res.status(401).json({
            message: 'Not owner.'
        });
    }

    try {
        const result = await lessonService.updateLessonById({lessonId, title});
        return res.status(201).json({
            message: 'Success.',
            publicKey: result[0].update_lesson
        })
    } catch(err) {
        const newError = new Error(`Lesson controller error when updating.\n\t${err.message}`);
        next(newError);
    }
}

module.exports.delete = async (req, res, next) => {
    const lessonId = req.params?.lessonId || false;

    if (!lessonId) {
        return res.status(400).json({
            message: "No lesson id provided."
        })
    }


    // Check if user owns this lesson
    // TODO try catch
    const lesson = await lessonService.getLessonById({lessonId});
    if (lesson[0].owner_id !== req.user.id) {
        return res.status(401).json({
            message: 'Not owner.'
        });
    }

    try {
        await lessonService.deleteLessonById({ lessonId });
        return res.status(200).json({
            message: "Lesson was deleted."
        })
    } catch(err) {
        const newError = new Error(`Lesson controller error when deleting.\n\t${err.message}`);
        next(newError);

    }
}