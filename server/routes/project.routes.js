import express from "express";
import {
  addProject,
  deleteProject,
  getAllProjects,
  getSingleProject,
  updateProject,
} from "../controllers/project.controller.js";
import { authentication } from "../middleware/authentication.js";
import { upload } from "../middleware/multerAsCloudinary.js";

const router = express.Router();

router.route("/add").post(authentication, upload.single("imgURL"), addProject);
router.route("/get").get(getAllProjects);
router.route("/:projectId").get(getSingleProject);
router
  .route("/update/:projectId")
  .patch(authentication, upload.single("imgURL"), updateProject);
router.route("/:projectId").delete(authentication, deleteProject);

export default router;
