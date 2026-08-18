import Intro from "../models/intro.model.js";
import { generateSnapshot } from "../utils/snapshot.js";

// --------------------------------------------Get Intro--------------------------------------------------
export const getIntro = async (req, res) => {
  try {
    const intros = await Intro.find();

    if (!intros || intros.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Intro section not found",
      });
    }

    res.status(200).json({ success: true, data: intros[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to fetch intro!" });
  }
};

// --------------------------------------------Update Intro--------------------------------------------------
export const updateIntro = async (req, res) => {
  try {
    const userId = req.userId;
    const { welcomeText, firstName, lastName, caption, description } = req.body;

    let intro = await Intro.findOne({ user: userId });

    let imgURL = intro?.imgURL;
    let cloudinaryId = intro?.cloudinaryId;

    // Handle image upload only if provided
    if (req.file) {
      const file = req.file;

      if (!file.mimetype.startsWith("image/")) {
        return res.status(400).json({
          success: false,
          message: "Only image files are allowed.",
        });
      }

      const imageURL = file.path || file.secure_url;
      const publicId = file.filename || file.public_id;

      if (!imageURL || !publicId) {
        console.error("Cloudinary upload failed:", file);
        return res.status(500).json({
          success: false,
          message: "Image upload failed.",
        });
      }

      imgURL = imageURL;
      cloudinaryId = publicId;
    }

    // If not found, create new one
    if (!intro) {
      const newIntro = new Intro({
        welcomeText,
        firstName,
        lastName,
        caption,
        description,
        imgURL,
        cloudinaryId,
        user: userId,
      });

      const savedIntro = await newIntro.save();
      generateSnapshot();

      return res.status(201).json({
        success: true,
        message: "Intro created successfully",
        data: savedIntro,
      });
    }

    // Update existing intro
    intro.welcomeText = welcomeText || intro.welcomeText;
    intro.firstName = firstName || intro.firstName;
    intro.lastName = lastName || intro.lastName;
    intro.caption = caption || intro.caption;
    intro.description = description || intro.description;
    intro.imgURL = imgURL || intro.imgURL;
    intro.cloudinaryId = cloudinaryId || intro.cloudinaryId;

    const savedIntro = await intro.save();
    generateSnapshot();

    res.status(200).json({
      success: true,
      message: "Intro updated successfully",
      data: savedIntro,
    });
  } catch (error) {
    console.error("Error updating intro:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
