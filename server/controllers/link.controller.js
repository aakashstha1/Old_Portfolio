import Link from "../models/link.model.js";
import { generateSnapshot } from "../utils/snapshot.js";

// --------------------------------------------Get Links--------------------------------------------------

export const getLinks = async (req, res) => {
  try {
    const links = await Link.find();

    if (!links) {
      return res.status(404).json({
        success: false,
        message: "Links not found",
      });
    }

    res.status(200).json({
      success: true,
      data: links[0],
    });
  } catch (error) {
    console.error("Error fetching links:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch links",
    });
  }
};

// --------------------------------------------Update Links--------------------------------------------------

export const updateLinks = async (req, res) => {
  try {
    const userId = req.userId;
    const { fbURL, email, instaURL, linkedinURL, githubURL } = req.body;

    let link = await Link.findOne({ user: userId });

    // If not found, create new
    if (!link) {
      const newLink = new Link({
        fbURL,
        email,
        instaURL,
        linkedinURL,
        githubURL,
        user: userId,
      });

      const savedLink = await newLink.save();
      generateSnapshot();

      return res.status(201).json({
        success: true,
        message: "Links created successfully",
        data: savedLink,
      });
    }

    link.fbURL = fbURL || link.fbURL;
    link.email = email || link.email;
    link.instaURL = instaURL || link.instaURL;
    link.linkedinURL = linkedinURL || link.linkedinURL;
    link.githubURL = githubURL || link.githubURL;

    const savedLink = await link.save();
    generateSnapshot();

    res.status(200).json({
      success: true,
      message: "Links updated successfully",
      data: savedLink,
    });
  } catch (error) {
    console.error("Error updating links:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
