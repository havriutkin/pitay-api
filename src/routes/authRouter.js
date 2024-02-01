const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login/password', authController.loginPassword);
router.post('/signup', authController.signUp);
router.post('/logout', [authMiddleware.confirmAuth], authController.logout);

module.exports = router;