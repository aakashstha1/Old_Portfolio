import express from "express";
import {
  forgotPassword,
  login,
  logout,
  // register,
  resetPassword,
  updatePassword,
} from "../controllers/user.controller.js";
import { authentication } from "../middleware/authentication.js";
import { getIntro, updateIntro } from "../controllers/intro.controller.js";
import { getAbout, updateAbout } from "../controllers/about.controller.js";
import {
  // getContact,
  sendMsg,
  // updateContact,
} from "../controllers/contact.controller.js";
import { getLinks, updateLinks } from "../controllers/link.controller.js";

import { upload } from "../middleware/multerAsCloudinary.js";

const router = express.Router();

//Admin routes
// router.route("/admin/register").post(register);
router.route("/admin/login").post(login);
router.route("/admin/logout").post(logout);
router.route("/admin/update").put(authentication, updatePassword);
router.route("/admin/forgot-password").post(forgotPassword);
router.route("/admin/reset-password/:token").post(resetPassword);

//Intro routes
router.route("/get-intro").get(getIntro);
router
  .route("/update-intro")
  .put(authentication, upload.single("imgURL"), updateIntro);

//About routes
router.route("/get-about").get(getAbout);
router
  .route("/update-about")
  .put(authentication, upload.single("resume"), updateAbout);

//Contact routes
// router.route("/get-contact").get(getContact);
// router.route("/update-contact").put(authentication, updateContact);
router.route("/sendMsg").post(sendMsg);

//Links routes
router.route("/get-links").get(getLinks);
router.route("/update-links").put(authentication, updateLinks);

//Visit Counter

export default router;
