import axios from "axios";
import Button from "./Button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchSnapshot } from "../lib/snapshot";
import { optimizeCloudinaryUrl } from "../lib/cloudinaryImage";
function Intro() {
  const [introData, setIntroData] = useState({});
  const [imageLoaded, setImageLoaded] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const optimizedImgURL = introData?.imgURL
    ? optimizeCloudinaryUrl(introData.imgURL, {
        width: 600,
        height: 600,
        gravity: "face",
      })
    : null;

  useEffect(() => {
    const fetchData = async () => {
      // 1. Show cached snapshot instantly (works even while backend is cold-starting)
      const snapshot = await fetchSnapshot();
      if (snapshot?.intro) setIntroData(snapshot.intro);

      // 2. Refresh with live data in the background
      try {
        const introRes = await axios.get(`${API_URL}/get-intro`);
        setIntroData(introRes.data.data || {});
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [API_URL]);

  // Preload the photo in the background. The circle (bg + image) only
  // animates in once this resolves, so they appear together instead of
  // the black bg showing first and the photo popping in after.
  useEffect(() => {
    if (!optimizedImgURL) return;
    setImageLoaded(false);
    const img = new Image();
    img.src = optimizedImgURL;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // don't block forever on a failed load
  }, [optimizedImgURL]);

  return (
    <div className="min-h-[90vh] bg-primary flex flex-wrap justify-center items-center gap-6 py-16 sm:h-full sm:py-10">
      <div className="flex-1 basis-[320px] max-w-2xl flex flex-col items-start justify-center gap-4 sm:items-center sm:text-center sm:basis-full">
        <motion.h1
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-white text-xl font-bold"
        >
          {introData.welcomeText}
        </motion.h1>
        <motion.h1
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="text-secondary text-[clamp(2rem,5vw,4.5rem)] font-semibold"
        >
          {introData.firstName} {introData.lastName}
        </motion.h1>
        <motion.h1
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="text-white text-[clamp(1.5rem,3.5vw,3rem)] font-semibold"
        >
          {introData.caption}
        </motion.h1>

        <motion.p
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          className="text-white w-full text-justify leading-6 sm:text-center"
        >
          {introData.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="m-2"
        >
          <Button text="Explore" />
        </motion.div>
      </div>
      <div className="flex-1 basis-[260px] flex items-center justify-center sm:basis-full">
        {introData?.imgURL && imageLoaded && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: [0, -8, 0],
            }}
            transition={{
              scale: {
                type: "spring",
                stiffness: 100,
                damping: 12,
                duration: 0.8,
              },
              opacity: { duration: 0.6 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ rotate: 2, scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative w-full max-w-[420px] aspect-square sm:max-w-[220px] glowing-circle rounded-full bg-[#1A1A1A] overflow-hidden"
          >
            <img
              src={optimizedImgURL}
              alt="profile.png"
              className="w-full h-full object-cover rounded-full transition-transform duration-500"
            />

            {/* Overlay for hover dark effect */}
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition duration-500 rounded-full pointer-events-none"></div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Intro;
