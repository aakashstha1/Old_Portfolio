import {
  CONTACT_FORM_SUBMISSION_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";
import { transporter, sender } from "./nodemailer.config.js";

const escapeHtml = (str = "") => {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });
    console.log("Password reset email sent");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

export const sendResetSuccessEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });
    console.log("Password reset success email sent");
  } catch (error) {
    console.error("Error sending reset success email:", error);
    throw new Error("Failed to send password reset success email");
  }
};

export const submitMessage = async (name, email, phone, message) => {
  try {
    await transporter.sendMail({
      from: sender,
      to: process.env.MY_EMAIL,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      html: CONTACT_FORM_SUBMISSION_TEMPLATE.replace("{name}", escapeHtml(name))
        .replace("{email}", escapeHtml(email))
        .replace("{phone}", escapeHtml(phone || "N/A"))
        .replace("{message}", escapeHtml(message)),
    });
    console.log("Contact message email sent successfully");
  } catch (error) {
    console.error("Error sending contact form message:", error);
    throw new Error("Failed to send contact form message");
  }
};
