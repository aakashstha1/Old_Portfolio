import axios from "axios";
import Button from "./Button";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchSnapshot } from "../lib/snapshot";
function Intro() {
  const [introData, setIntroData] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;
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

  return (
    <div className="h-[90vh] bg-primary flex justify-center gap-6 sm:flex-col sm:items-center sm:h-full sm:pt-10">
      <div className="w-2/3 flex flex-col items-start justify-center gap-4 sm:order-1 sm:w-full sm:items-center sm:text-center">
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
          className="text-secondary text-7xl sm:text-3xl font-semibold"
        >
          {introData.firstName} {introData.lastName}
        </motion.h1>
        <motion.h1
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="text-white text-5xl sm:text-3xl font-semibold"
        >
          {introData.caption}
        </motion.h1>

        <motion.p
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
          className="text-white w-2/3 text-justify leading-6"
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
      <div className="w-1/3 flex items-center justify-center">
        {introData?.imgURL && (
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
            className="relative w-[500px] h-[400px] sm:w-[200px] sm:h-[110px] glowing-circle rounded-full bg-[#1A1A1A] overflow-hidden sm:items-center sm:justify-center"
          >
            <img
              src={introData?.imgURL}
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
