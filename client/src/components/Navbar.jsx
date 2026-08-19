import { Button } from "antd";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

// Update this to your new portfolio's actual URL
const NEW_PORTFOLIO_URL = "https://www.aakashshrestha1.com.np/";

function Navbar() {
  return (
    <>
      {/* Desktop Nav (≥640px) */}
      <div className="flex sm:hidden p-6 bg-gradient-to-b from-[#000D1A] to-primary justify-end sm:justify-center">
        <ul className="flex flex-row items-center gap-10 text-white pr-5">
          <motion.li
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0 }}
            className="hover:text-secondary"
          >
            <a href="#about">About</a>
          </motion.li>

          <motion.li
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="hover:text-secondary"
          >
            <a href="#experience">Experience</a>
          </motion.li>

          <motion.li
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="hover:text-secondary"
          >
            <a href="#project">Projects</a>
          </motion.li>

          {/* <motion.li
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            className="hover:text-secondary"
          >
            <a href="#achievement">Achievements</a>
          </motion.li> */}

          {/* <motion.li
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
            className="hover:text-secondary"
          ></motion.li> */}

          <motion.a
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            href={NEW_PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="flex items-center gap-2 rounded-full border-secondary text-secondary bg-transparent hover:!bg-secondary hover:!text-primary hover:!border-secondary font-semibold transition-colors duration-300">
              New Portfolio
              <ExternalLink size={16} />
            </Button>
          </motion.a>

          <motion.a
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
            href="#contact"
          >
            <Button className="font-semibold">
              <motion.span
                animate={{
                  rotate: [0, 2, -2, 2, -2, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut",
                }}
                style={{ display: "inline-block" }}
              >
                Get In Touch
              </motion.span>
            </Button>
          </motion.a>
        </ul>
      </div>

      {/* Mobile Nav (<640px) */}
      <div className="hidden sm:flex items-center gap-3 p-4 bg-gradient-to-b from-[#000D1A] to-primary justify-end">
        <a
          href={NEW_PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View new portfolio"
        >
          <Button
            shape="circle"
            icon={<ExternalLink size={16} />}
            className="border-secondary text-secondary bg-transparent"
          />
        </a>
        <a href="#contact">
          <Button className="font-semibold">Get In Touch</Button>
        </a>
      </div>
    </>
  );
}

export default Navbar;
