const express = require('express');
const router = express.Router();

const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', [authMiddleware.confirmAuth], lessonController.create);
router.get('/id/:lessonId', lessonController.getById);
router.get('/owner/:ownerId', lessonController.getByOwnerId);
router.get('/key/:publicKey', lessonController.getByPublicKey);
router.put('/:lessonId', [authMiddleware.confirmAuth], lessonController.update);
router.delete('/:lessonId', [authMiddleware.confirmAuth], lessonController.delete);

module.exports = router;