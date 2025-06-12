const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");
const crypto = require("crypto");
const db = require("../config/mysql_database");
const bcrypt = require("bcryptjs");
const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().required().max(50),
  email: Joi.string().email().required().max(255),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords must match',  // Custom error message
  }),
});

// Register a user
exports.registerUserApi = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, confirmPassword, role } = req.body;
   // Check if password and confirmPassword match
   if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await registerSchema.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
  } catch (error) {
    // Joi validation failed, send 400 Bad Request with error details
    return next(
      new ErrorHandler(
        error.details.map((d) => d.message),
        400
      )
    );
  }

  // Check if email already exists
  const existingUser = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (existingUser[0].length > 0) {
    // If email already exists, send a 400 Bad Request response
    return next(new ErrorHandler("Email already exists", 400));
  }

  const userData = { name, email, password: hashedPassword, role };
  const userInsert = await db.query("INSERT INTO users SET ?", userData);

  // Get the ID of the last inserted row
  const lastInsertId = userInsert[0].insertId;

  // Fetch the latest inserted user data using the ID
  const userDetail = await db.query("SELECT * FROM users WHERE id = ?", [
    lastInsertId,
  ]);
  const user = userDetail[0][0];
  // Assuming `user` is the object returned from MySQL query
  const token = User.generateToken(user.id); 
  res.cookie('testCookie', 'testValue', {
    httpOnly: true,
    expires: new Date(Date.now() + 86400000), // 1 day
  });// Adjust as per your user object structure

  sendToken(user, token, 201, res);
});

// Login user
exports.loginUserApi = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const userData = await db.query(
    "SELECT * FROM users WHERE email = ? limit 1",
    [email]
  );
  const user = userData[0][0];

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const isPasswordMatched = await User.comparePasswords(
    password,
    user.password
  );

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const token = User.generateToken(user.id);

  // ✅ Set cookie
  sendToken(user, token, 201, res); 

  // ✅ Send JSON response to frontend
  res.status(200).json({
    success: true,
    message: 'Login successful',
    user,
    token,
  });
});


exports.logoutApi = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

//forgot password for sending token in mail
// exports.forgotPasswordApi = catchAsyncErrors(async (req, res, next) => {
//   //const user = await User.findOne({email: req.body.email})
//   const userData = await db.query(
//     "SELECT * FROM users WHERE email = ? limit 1",
//     [req.body.email]
//   );
//   const user = userData[0][0];

//   if (!user) {
//     return next(new ErrorHandler("User not found", 404));
//   }

//   //get ResetPasswordToken token
//   const resetTokenValues = User.getResetPasswordToken();

//   const resetToken = resetTokenValues.resetToken;
//   const resetPasswordToken = resetTokenValues.resetPasswordToken;
//   const resetPasswordExpire = resetTokenValues.resetPasswordExpire;

//   /*await user.save({validateBeforeSave: false});*/

//   const resetPasswordUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/api/v1/password/reset/${resetToken}`;

//   const message = `password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested reset password then please ingone it`;

//   try {
//     const query =
//       "UPDATE users SET reset_password_token = ?, reset_password_expire = ? WHERE email = ?";
//     // Execute the update query
//     const result = await db.query(query, [
//       resetPasswordToken,
//       resetPasswordExpire,
//       req.body.email,
//     ]);

//     await sendEmail({
//       email: user.email,
//       subject: "Password Recovery",
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Email sent successfully to ${user.email}`,
//     });
//   } catch (error) {
//     await db.query(
//       `UPDATE users SET reset_password_token = '', reset_password_expire = '' WHERE email = ${req.body.email}`
//     );

//     return next(new ErrorHandler(error.message, 500));
//   }
// });

exports.forgotPasswordApi = async (req, res, next) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const [userData] = await db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);
    const user = userData[0];

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit alphanumeric code
    const code = crypto.randomBytes(3).toString("hex").toUpperCase();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // valid for 5 mins

    // Update code & expiry in DB
    await db.query(
      "UPDATE users SET reset_code = ?, reset_code_expiry = ? WHERE email = ?",
      [code, expiry, email]
    );

    const message = `Your password reset code is: ${code}\nIt is valid for 5 minutes.`;

    await sendEmail({
      email,
      subject: "Password Reset Code",
      message,
    });

    res.status(200).json({ success: true, message: `Reset code sent to ${email}` });
  } catch (err) {
    next(err);
  }
};

exports.verifyResetCode = async (req, res, next) => {
  const { email, code } = req.body;

  if (!email || !code) return res.status(400).json({ message: "Email and code are required" });

  try {
    const [userData] = await db.query(
      "SELECT reset_code, reset_code_expiry FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const user = userData[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.reset_code !== code)
      return res.status(400).json({ message: "Incorrect code" });

    if (new Date() > new Date(user.reset_code_expiry))
      return res.status(400).json({ message: "Code has expired" });

    // ✅ Mark code as verified
    await db.query(
      "UPDATE users SET reset_code_verified = TRUE WHERE email = ?",
      [email]
    );

    res.status(200).json({ success: true, message: "Code verified" });
  } catch (err) {
    next(err);
  }
};


exports.resetPasswordApi = async (req, res, next) => {
  const { email, newPassword } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!newPassword) return res.status(400).json({ message: "New password is required" });

  try {
    const [userData] = await db.query(
      "SELECT reset_code_verified FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    const user = userData[0];
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.reset_code_verified)
      return res.status(400).json({ message: "Reset code not verified" });

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db.query(
      `UPDATE users 
       SET password = ?, reset_code = NULL, reset_code_expiry = NULL, reset_code_verified = FALSE 
       WHERE email = ?`,
      [hashedPassword, email]
    );

    res.status(200).json({ success: true, message: "Password has been reset" });
  } catch (err) {
    next(err);
  }
};


// reset user password
// exports.resetPasswordApi = catchAsyncErrors(async (req, res, next) => {
//   //creating token hash
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const currentTime = Date.now();

//   const query = `
//         SELECT *
//         FROM users
//         WHERE reset_password_token = ? 
//         AND reset_password_expire > ?
//     `;

//   // Execute the query
//   const userDetail = await db.query(query, [resetPasswordToken, currentTime]);
//   const user = userDetail[0][0];

//   if (!user) {
//     return next(
//       new ErrorHandler(
//         "Reset password token is invalid or has been expired",
//         404
//       )
//     );
//   }

//   if (req.body.password !== req.body.confirmPassword) {
//     return next(new ErrorHandler("Password does not matched", 404));
//   }

//   const hashedPassword = await bcrypt.hash(req.body.password, 10);

//   const query_2 =
//     "UPDATE users SET password = ?, reset_password_token = ?,reset_password_expire = ?  WHERE id = ?";
//   // Execute the update query
//   const result = await db.query(query_2, [hashedPassword, "", "", user.id]);

//   const token = User.generateToken(user.id); // Adjust as per your user object structure

//   sendToken(user, token, 201, res);
// });

// get user detail
exports.getUserDetailApi = catchAsyncErrors(async (req, res, next) => {
  const userDetail = await db.query("SELECT * FROM users WHERE id = ?", [
    req.user.id,
  ]);
  const user = userDetail[0][0];

  res.status(200).json({
    success: true,
    user,
  });
});

// update user password
exports.updatePasswordApi = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return next(new ErrorHandler("Unauthorized request", 401));
  }

  const { oldPassword, newPassword, confirmPassword } = req.body;

  // Check all required fields
  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("All password fields are required", 400));
  }

  // Fetch user from DB
  const [userResult] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
  const user = userResult[0];

  if (!user || !user.password) {
    return next(new ErrorHandler("User not found or password missing", 404));
  }

  // Compare current password
  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  // Match new passwords
  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("New passwords do not match", 400));
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId]);

  // Generate new token if needed
  const token = User.generateToken ? User.generateToken(userId) : null;

  return sendToken(user, token, 200, res);
});

// update user profile
exports.updateProfileApi = catchAsyncErrors(async (req, res, next) => {
  await db.query("UPDATE users SET name = ? , email = ? WHERE id = ?", [
    req.body.name,
    req.body.email,
    req.user.id,
  ]);

  res.status(200).json({
    success: true,
  });
});
