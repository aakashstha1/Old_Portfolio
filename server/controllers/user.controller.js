import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateCookie } from "../utils/generateCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../nodemailer/emails.js";
import crypto from "crypto";

// --------------------------------------------Login--------------------------------------------------

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials!" });
    }

    generateCookie(res, user._id);

    await user.save();
    const { password: pwd, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: rest,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Failed to login!" });
  }
};

// --------------------------------------------Logout--------------------------------------------------

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// --------------------------------------------Register--------------------------------------------------

// export const register = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     // Check if all required fields are provided
//     if (!username || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required!",
//       });
//     }

//     // Check for existing user
//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "User already exists with this email or username!",
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcryptjs.hash(password, 10);

//     // Create user
//     const newUser = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     const { password: pwd, ...rest } = newUser._doc;

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully!",
//       user: rest,
//     });
//   } catch (error) {
//     console.error("Register Error:", error);
//     res.status(500).json({ success: false, message: "Failed to register!" });
//   }
// };

// --------------------------------------------Update Password--------------------------------------------------

export const updatePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const oldPasswordMatch = await bcryptjs.compare(oldPassword, user.password);

    if (!oldPasswordMatch) {
      return res.status(400).json({ message: "password didn't match!" });
    }

    const updatedPassword = await bcryptjs.hash(newPassword, 10);

    user.password = updatedPassword;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed succesfully!" });
  } catch (error) {
    console.error("update Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to change password!" });
  }
};

// --------------------------------------------Forget password--------------------------------------------------

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found!" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    // send email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/admin/reset-password/${resetToken}`,
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// --------------------------------------------Reset password--------------------------------------------------

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
