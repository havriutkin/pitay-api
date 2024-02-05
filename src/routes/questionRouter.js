const express = require('express');
const router = express.Router();

const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:lessonId', [authMiddleware.confirmAuth, authMiddleware.checkLessonOwnership], questionController.getByLessonId);
router.put('/:questionId',[authMiddleware.confirmAuth, authMiddleware.checkLessonOwnership], questionController.update); 

module.exports = router;