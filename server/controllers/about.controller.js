import About from "../models/about.model.js";
import { generateSnapshot } from "../utils/snapshot.js";

// --------------------------------------------Get About--------------------------------------------------

export const getAbout = async (req, res) => {
  try {
    const abouts = await About.findOne();

    if (!abouts) {
      return res.status(404).json({
        success: false,
        message: "About section not found",
      });
    }

    res.status(200).json({
      success: true,
      data: abouts,
    });
  } catch (error) {
    console.error("Error fetching about:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch about section",
    });
  }
};

// --------------------------------------------Update or Create About--------------------------------------------------

export const updateAbout = async (req, res) => {
  try {
    const userId = req.userId;
    const { description1, description2, skills } = req.body;
    let about = await About.findOne({ user: userId });

    let resume = about?.resume;
    let publicId = about?.cloudinaryId;

    if (req.file) {
      const file = req.file;
      resume = file?.path || file?.secure_url;
      publicId = file?.filename || file?.public_id;
      if (!resume || !publicId) {
        console.error("Cloudinary upload failed:", file);
        return res.status(500).json({
          success: false,
          message: "Image upload failed.",
        });
      }
    }

    // If not found, create new
    if (!about) {
      const newAbout = new About({
        description1,
        description2,
        skills,
        resume: resume,
        cloudinaryId: publicId,
        user: userId,
      });

      const savedAbout = await newAbout.save();
      generateSnapshot();

      return res.status(201).json({
        success: true,
        message: "About section created successfully",
        data: savedAbout,
      });
    }

    about.description1 = description1 || about.description1;
    about.description2 = description2 || about.description2;
    if (
      skills &&
      Array.isArray(skills) &&
      JSON.stringify(skills) !== JSON.stringify(about.skills)
    ) {
      about.skills = skills;
    }

    if (req.file) {
      about.resume = req.file.path || req.file.secure_url;
      about.cloudinaryId = req.file.filename || req.file.public_id;
    }
    const savedAbout = await about.save();
    generateSnapshot();

    res.status(200).json({
      success: true,
      message: "About section updated successfully",
      data: savedAbout,
    });
  } catch (error) {
    console.error("Error updating about:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
