const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, changeEmail, verifyEmail, googleLogin } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-email', changeEmail);
router.post('/verify-email', verifyEmail);
router.post('/google-login', googleLogin);

module.exports = router;
