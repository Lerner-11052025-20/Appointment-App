const express = require('express');
const router = express.Router();
const {
  register,
  verifyOtp,
  login,
  forgotPassword,
  getMe,
  resendOtp,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/resend-otp', resendOtp);
router.get('/me', protect, getMe);

module.exports = router;