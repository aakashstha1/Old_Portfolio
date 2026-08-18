import { cloudinary } from "../middleware/multerAsCloudinary.js";
import Intro from "../models/intro.model.js";
import About from "../models/about.model.js";
import Link from "../models/link.model.js";
import Project from "../models/project.model.js";
import Experience from "../models/experience.model.js";
import Achievement from "../models/achievement.model.js";

// Fixed public_id so the delivered URL never changes between regenerations
const SNAPSHOT_PUBLIC_ID = "portfolio/snapshot.json";

export const generateSnapshot = async () => {
  try {
    const [intro, about, links, projects, experiences, achievements] =
      await Promise.all([
        Intro.findOne(),
        About.findOne(),
        Link.findOne(),
        Project.find(),
        Experience.find(),
        Achievement.find(),
      ]);

    const snapshot = {
      intro: intro || null,
      about: about || null,
      links: links || null,
      projects: projects || [],
      experiences: experiences || [],
      achievements: achievements || [],
      generatedAt: new Date().toISOString(),
    };

    const base64Data = Buffer.from(JSON.stringify(snapshot)).toString(
      "base64"
    );
    const dataURI = `data:application/json;base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      public_id: SNAPSHOT_PUBLIC_ID,
      resource_type: "raw",
      overwrite: true,
      invalidate: true,
      // If raw delivery is restricted on your Cloudinary plan and the
      // frontend gets a 401 fetching this file, switch to:
      // resource_type: "image", format: "json"
      // (image delivery is public by default) and update
      // client/src/lib/snapshot.js's SNAPSHOT_URL to use /image/upload/.
    });

    console.log("Snapshot regenerated:", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Failed to generate snapshot:", error.message);
  }
};
