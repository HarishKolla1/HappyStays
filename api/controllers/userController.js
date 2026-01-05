const User = require('../models/User');
const cookieToken = require('../utils/cookieToken');
const bcrypt = require('bcryptjs')
const cloudinary = require('cloudinary').v2;
const crypto = require('crypto');
const sendEmail = require('../utils/emailUtils');
const uploadToS3 = require('../middlewares/uploadToS3');
const uploadProfileToS3 = require('../middlewares/uploadProfileToS3');


// Register/SignUp user
/**
 * Handles user registration.
 * Validates input, checks for existing users, creates a new user,
 * and issues a JWT token via cookie.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already registered!' });
    }

    // 1. Create User (isVerified will be false by default)
    user = await User.create({
      name,
      email,
      password,
    });

    // 2. Generate Verification Token
    const verifyToken = user.getVerifyEmailToken();
    await user.save({ validateBeforeSave: false });

    // 3. Construct Verification Link (Points to Frontend Page)
    // Example: http://localhost:5173/verify-email/abcdef123456
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
    
    const message = `Welcome to HappyStays! \n\nPlease click the link below to verify your email address: \n\n${verifyUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'HappyStays - Verify your email',
        message,
      });

      // 4. Send Success Response (BUT NO COOKIE/LOGIN)
      res.status(200).json({
        success: true,
        message: `Registration successful! Please check your email: ${email} to verify your account.`,
      });
      
    } catch (error) {
      // If email fails, delete the user so they can try again
      await user.deleteOne(); 
      return res.status(500).json({ message: 'Email could not be sent', error: error.message });
    }

  } catch (err) {
    res.status(500).json({ message: 'Internal server Error', error: err.message });
  }
};

// Login/SignIn user
/**
 * Handles user login.
 * Verifies credentials and issues a JWT token.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required!',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'User does not exist!',
      });
    }

    if (!user.isVerified) {
      return res.status(401).json({
        message: 'Please verify your email before logging in.',
      });
    }

    // Verify password match
    const isPasswordCorrect = await user.isValidatedPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: 'Email or password is incorrect!',
      });
    }

    // Issue authentication token
    cookieToken(user, res);
  } catch (err) {
    res.status(500).json({
      message: 'Internal server Error',
      error: err,
    });
  }
};

// Google Login
/**
 * Handles Google OAuth login.
 * Creates a new user if one doesn't exist, otherwise logs them in.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.googleLogin = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400), json({
        message: 'Name and email are required'
      })
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    // If user doesn't exist, create a new account with a random password
    if (!user) {
      user = await User.create({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10)
      })
    }

    // Issue authentication token
    cookieToken(user, res)
  } catch (err) {
    res.status(500).json({
      message: 'Internal server Error',
      error: err,
    });
  }
}

// Upload picture
// Upload picture
exports.uploadPicture = [
  (req, res, next) => {
    console.log('Step 1: Upload middleware invoked');
    // We don't need req.uploadFolder anymore because we hardcoded 'users/' in the new middleware
    next();
  },
  
  // USE THE NEW MIDDLEWARE HERE
  uploadProfileToS3.single('picture'), 
  
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      // Since we used multer-s3, .location will now exist!
      console.log('Success:', req.file.location);
      res.status(200).json(req.file.location);
    } catch (error) {
      console.log('Upload Error:', error);
      res.status(500).json({ message: 'Upload failed', error: error.message });
    }
  }
];

// update user
exports.updateUserDetails = async (req, res) => {
  try {
    const { name, password, email, picture } = req.body

    // Note: Assuming the email passed in body is correct, or better, 
    // you should get the email/ID from the logged-in user's token (req.user) 
    // to prevent updating other people's accounts. 
    // But sticking to your current logic:
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      })
    }

    // 1. Update Name if provided
    if (name) {
        user.name = name;
    }

    // 2. Update Picture if provided
    if (picture) {
        user.picture = picture;
    }

    // 3. Update Password ONLY if provided and not empty
    if (password && password.trim() !== '') {
        user.password = password;
        // The pre('save') hook in your model will handle the hashing automatically
        // because we are modifying the password field.
    }

    const updatedUser = await user.save();
    
    // Send back the new token/user data
    cookieToken(updatedUser, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
}

// Logout
exports.logout = async (req, res) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',   // Only send over HTTPS in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // Allow cross-origin requests in production
  });
  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // FIX: Use the correct method name defined in your User model
    const forgotToken = user.getForgotPasswordToken();

    // Save user without validation
    await user.save({ validateBeforeSave: false });

    const myUrl = `${process.env.CLIENT_URL}/password/reset/${forgotToken}`;
    
    const message = `Click on the link to reset your password: \n\n${myUrl}\n\nIf you have not requested this email, please ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'HappyStays Password Recovery',
        message,
      });

      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email}`,
      });
    } catch (error) {
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
      await user.save({ validateBeforeSave: false });

      console.log("Email Error:", error); // Log error to terminal
      return res.status(500).json({
        message: 'Email could not be sent',
        error: error.message,
      });
    }
  } catch (error) {
    console.log("Controller Error:", error); // Log error to terminal
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};


// reset password
exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;

    const encryToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      forgotPasswordToken: encryToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Token is invalid or expired',
      });
    }

    user.password = req.body.password;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save();

    // send token
    cookieToken(user, res);
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    // Hash the token from URL to compare with DB
    const encryToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      verifyToken: encryToken,
      verifyTokenExpiry: { $gt: Date.now() }, // Check if not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Verification link is invalid or has expired' });
    }

    // Mark as verified and clear tokens
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;
    await user.save();

    // Now verify is done, user can login manually. 
    // Or you can call cookieToken(user, res) here to auto-login upon verification.
    res.status(200).json({ success: true, message: 'Email verified successfully! You can now login.' });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};