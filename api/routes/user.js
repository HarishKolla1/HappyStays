const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  googleLogin,
  uploadPicture,
  updateUserDetails,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require('../controllers/userController');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/google/login').post(googleLogin)
router.route('/upload-picture').post(uploadPicture);
router.route('/update-user').put(updateUserDetails)
router.route('/logout').get(logout);
router.route('/forgot-password').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/verify-email/:token').get(verifyEmail);


module.exports = router;