import { Button } from "antd";
import { motion } from "framer-motion";
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
      <div className="hidden sm:flex p-4 bg-gradient-to-b from-[#000D1A] to-primary justify-end">
        <a href="#contact">
          <Button className="font-semibold">Get In Touch</Button>
        </a>
      </div>
    </>
  );
}

export default Navbar;
