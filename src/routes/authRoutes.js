const express = require('express');
const {
  register,
  login,
  getMe,
  logout,
  updateDetails,
  updatePassword
} = require('../controllers/authController');

const router = express.Router();

const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.get('/logout', auth, logout);
router.put('/updatedetails', auth, updateDetails);
router.put('/updatepassword', auth, updatePassword);

module.exports = router;