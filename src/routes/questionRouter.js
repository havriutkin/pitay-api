const express = require('express');
const router = express.Router();

const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:lessonId', [authMiddleware.confirmAuth], questionController.getByLessonId);
router.put('/:questionId', questionController.update); 

module.exports = router;