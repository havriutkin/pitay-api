const express = require('express');
const router = express.Router();

const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', [authMiddleware.confirmAuth], lessonController.create);
router.get('/', lessonController.get);
router.put('/:lessonId', [authMiddleware.confirmAuth, authMiddleware.checkLessonOwnership], lessonController.update);
router.delete('/:lessonId', [authMiddleware.confirmAuth, authMiddleware.checkLessonOwnership], lessonController.delete);

module.exports = router;