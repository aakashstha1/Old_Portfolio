import Project from "../models/project.model.js";
import User from "../models/user.model.js";

import { deleteCloudinaryFile } from "../utils/cloudinaryDeletion.js";
import { generateSnapshot } from "../utils/snapshot.js";

// --------------------------------------------Get projects--------------------------------------------------

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    if (!projects) {
      return res.status(404).json({
        success: false,
        message: "Projects not found",
      });
    }

    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

// --------------------------------------------Get Single Project--------------------------------------------------

export const getSingleProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    console.error("Error fetching project:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
    });
  }
};

// --------------------------------------------Add New Projects--------------------------------------------------

export const addProject = async (req, res) => {
  try {
    const userId = req.userId;
    const { title, githubURL, figmaURL, websiteURL } = req.body;

    // Check for uploaded file
    if (!req.file) {
      console.error("Image upload missing in request.");
      return res.status(400).json({
        success: false,
        message: "Image file is required.",
      });
    }

    const file = req.file;

    if (!file.mimetype.startsWith("image/")) {
      return res.status(400).json({
        success: false,
        message: "Only image files are allowed.",
      });
    }

    // Check user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Validate cloudinary fields
    const imageURL = file.path || file.secure_url;
    const publicId = file.filename || file.public_id;

    if (!imageURL || !publicId) {
      console.error("Cloudinary upload failed:", file);
      return res.status(500).json({
        success: false,
        message: "Image upload failed.",
      });
    }

    const newProject = new Project({
      title,
      imgURL: imageURL,
      cloudinaryId: publicId,
      githubURL,
      figmaURL,
      websiteURL,
      user: userId,
    });

    const savedProject = await newProject.save();
    generateSnapshot();

    res.status(201).json({
      success: true,
      message: "Project added successfully.",
      data: savedProject,
    });
  } catch (error) {
    console.error("Error in addProject:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// --------------------------------------------Update Projects--------------------------------------------------

export const updateProject = async (req, res) => {
  try {
    const userId = req.userId;
    const { projectId } = req.params;
    const { title, githubURL, figmaURL, websiteURL } = req.body;

    const project = await Project.findOne({ _id: projectId, user: userId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (req.file) {
      if (!req.file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Only image files are allowed",
        });
      }
      project.imgURL = req.file.path || req.file.secure_url;
      project.cloudinaryId = req.file.filename || req.file.public_id;
    }

    project.title = title || project.title;
    project.githubURL = githubURL || project.githubURL;
    project.figmaURL = figmaURL || project.figmaURL;
    project.websiteURL = websiteURL || project.websiteURL;

    const updatedProject = await project.save();
    generateSnapshot();

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to update project",
    });
  }
};

// --------------------------------------------Delete Projects--------------------------------------------------

export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const resourceType = project.imgURL?.endsWith(".pdf") ? "raw" : "image";

    // Call helper to delete file from Cloudinary
    await deleteCloudinaryFile(project.cloudinaryId, resourceType);

    await Project.findByIdAndDelete(projectId);
    generateSnapshot();

    res.status(200).json({
      success: true,
      message: "Project deleted succesfully!",
    });
  } catch (error) {
    console.error("Error deleting project:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete project",
    });
  }
};
