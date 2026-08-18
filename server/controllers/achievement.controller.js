import Achievement from "../models/achievement.model.js";
import User from "../models/user.model.js";

import { deleteCloudinaryFile } from "../utils/cloudinaryDeletion.js";
import { generateSnapshot } from "../utils/snapshot.js";

// --------------------------------------------Get achievements--------------------------------------------------

export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    if (!achievements) {
      return res.status(404).json({
        success: false,
        message: "Achievements not found",
      });
    }

    res.status(200).json({ success: true, data: achievements });
  } catch (error) {
    console.error("Error fetching Achievements:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
    });
  }
};

// --------------------------------------------Add New Achievement--------------------------------------------------

export const addAchievement = async (req, res) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

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
        imgURL: imageURL,
        cloudinaryId: publicId,
        message: "Image upload failed.",
      });
    }

    const newAchievement = new Achievement({
      title,
      imgURL: imageURL,
      cloudinaryId: publicId,
      user: userId,
    });

    const savedAchievement = await newAchievement.save();
    generateSnapshot();

    res.status(201).json({
      success: true,
      message: "Achievement added successfully.",
      data: savedAchievement,
    });
  } catch (error) {
    console.error("Error in addAchievement:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// --------------------------------------------Delete Achievement--------------------------------------------------

export const deleteAchievement = async (req, res) => {
  try {
    const { achievementId } = req.params;
    const achievement = await Achievement.findById(achievementId);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    const resourceType = achievement.imgURL?.endsWith(".pdf") ? "raw" : "image";

    // Call helper to delete file from Cloudinary
    await deleteCloudinaryFile(achievement.cloudinaryId, resourceType);

    await Achievement.findByIdAndDelete(achievementId);
    generateSnapshot();

    res.status(200).json({
      success: true,
      message: "Achievement deleted succesfully!",
    });
  } catch (error) {
    console.error("Error deleting achievement:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete achievement",
    });
  }
};
