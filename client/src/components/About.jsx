import SectionTitle from "./SectionTitle";
// import Button from "./Button";
import { useEffect, useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import aboutAnimation from "../assets/lottie/about.json";
import { motion } from "framer-motion";
import Button from "./Button";
import { fetchSnapshot } from "../lib/snapshot";
function About() {
  const [aboutData, setAboutData] = useState({});
  const [resumeURL, setResumeURL] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchAbout = async () => {
    const snapshot = await fetchSnapshot();
    if (snapshot?.about) {
      setAboutData(snapshot.about);
      setResumeURL(snapshot.about?.resume || "");
    }

    try {
      const res = await axios.get(`${API_URL}/get-about`);
      setAboutData(res?.data?.data || {});
      setResumeURL(res?.data?.data?.resume || "");
    } catch (error) {
      console.error("Failed to fetch intro:", error);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const handleDownload = async () => {
    if (!resumeURL) return;

    try {
      const response = await fetch(resumeURL);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;

      link.download = "Aakash_Shrestha_CV.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download resume:", error);
    }
  };

  return (
    <div id="about">
      <SectionTitle title="About" />
      <div className="flex w-full items-center sm:flex-col ">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 10,
            duration: 0.8,
          }}
          className="h-[60vh] w-1/2 flex sm:w-full sm:h-full"
        >
          <Lottie animationData={aboutAnimation} loop={true} />
        </motion.div>

        <div className="flex flex-col gap-5 w-1/2 text-white p-5 sm:w-full sm:items-center ">
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-justify"
          >
            {aboutData.description1}
          </motion.p>
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="text-justify "
          >
            {aboutData.description2}
          </motion.p>
          {resumeURL && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.8, ease: "easeOut" }}
              className="m-2"
            >
              <Button text="Download CV" onClick={handleDownload} />
            </motion.div>
          )}
        </div>
      </div>

      <div className="py-10">
        <h1 className="text-silver text-xl mb-4">
          Here are the technologies I&apos;ve been working with:
        </h1>
        <div className="flex flex-wrap gap-10 mt-10 sm:hidden">
          {aboutData?.skills?.map((skill, index) => (
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              key={index}
              className="border border-secondary text-white py-3 px-10 group relative"
            >
              <h1>{skill}</h1>
              <div className="absolute inset-1 blur opacity-75 border "></div>
            </motion.div>
          ))}
        </div>
        <div className="overflow-hidden whitespace-nowrap w-full py-4 sm:block hidden">
          <motion.div
            className="flex gap-10"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 10,
            }}
          >
            {aboutData?.skills?.map((skill, index) => (
              <div
                key={index}
                className="border border-secondary text-white py-3 px-10 group relative"
              >
                <h1>{skill}</h1>
                <div className="absolute inset-1 blur opacity-75 border"></div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default About;
