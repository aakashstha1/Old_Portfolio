import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchSnapshot } from "../lib/snapshot";

function SocialMedia() {
  const [links, setLinks] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchLinks = async () => {
    const snapshot = await fetchSnapshot();
    if (snapshot?.links) setLinks(snapshot.links);

    try {
      const res = await axios.get(`${API_URL}/get-links`);
      setLinks(res?.data?.data || {});
    } catch (error) {
      console.error("Failed to fetch intro:", error);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);
  return (
    <div className="fixed left-0 bottom-0 px-10 sm:static">
      <div className="flex flex-col items-center ">
        <div className="flex flex-col gap-4 sm:flex-row sm:mb-5">
          <motion.a
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 1.0 }}
            href={links.fbURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-facebook text-2xl text-silver hover:text-[#1877F2] hover:drop-shadow-[0_0_6px_#1877F2] transition duration-300 cursor-pointer"></i>
          </motion.a>
          <motion.a
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
            href={`mailto:${links.email}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-regular fa-envelope text-2xl text-silver hover:text-[#EA4335] hover:drop-shadow-[0_0_6px_#EA4335] transition duration-300 cursor-pointer"></i>
          </motion.a>
          <motion.a
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            href={links.instaURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-instagram text-2xl text-silver hover:text-[#E4405F] hover:drop-shadow-[0_0_6px_#E4405F] transition duration-300 cursor-pointer"></i>
          </motion.a>
          <motion.a
            initial={{ y: 70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            href={links.linkedinURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-linkedin text-2xl text-silver hover:text-[#0A66C2] hover:drop-shadow-[0_0_6px_#0A66C2] transition duration-300 cursor-pointer"></i>
          </motion.a>
          <motion.a
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            href={links.githubURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-github text-2xl text-silver hover:text-white hover:drop-shadow-[0_0_6px_#ffffff80] transition duration-300 cursor-pointer"></i>
          </motion.a>
        </div>
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0 }}
          className="w-[1px] h-52 bg-slate-600 mt-2 sm:hidden"
        ></motion.div>
      </div>
    </div>
  );
}

export default SocialMedia;
