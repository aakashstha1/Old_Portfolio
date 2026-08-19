// import Lottie from "lottie-react";

// import loading from "../assets/lottie/loading.json";

// import { BeatLoader } from "react-spinners";

// function ScreenLoader() {
//   return (
//     <div className="bg-primary h-screen w-full flex flex-col items-center justify-center">
//       <Lottie
//         animationData={loading}
//         loop={true}
//         style={{ width: 160, height: 160 }}
//       />
//       <BeatLoader color="#40E0D0" size={20} />
//     </div>
//   );
// }

// export default ScreenLoader;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Boot-sequence lines — ties the loader to "developer portfolio" instead of
// being a generic spinner. Feel free to tweak the copy to your voice.
const BOOT_LINES = [
  "booting_portfolio.jsx",
  "compiling_ideas()",
  "loading_experience...",
  "rendering_ui →",
];

const TYPE_SPEED = 55; // ms per character while typing
const DELETE_SPEED = 28; // ms per character while deleting
const HOLD_DURATION = 700; // pause after a line finishes typing

function ScreenLoader() {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentLine = BOOT_LINES[lineIndex];
    const speed = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        const next = currentLine.slice(0, displayedText.length + 1);
        setDisplayedText(next);
        if (next === currentLine) {
          setTimeout(() => setIsDeleting(true), HOLD_DURATION);
        }
      } else {
        const next = currentLine.slice(0, displayedText.length - 1);
        setDisplayedText(next);
        if (next === "") {
          setIsDeleting(false);
          setLineIndex((prev) => (prev + 1) % BOOT_LINES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, lineIndex]);

  return (
    <div className="bg-primary h-screen w-full flex flex-col items-center justify-center gap-8 overflow-hidden relative">
      {/* Ambient glow — kept subtle so it doesn't compete with the ring */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-secondary opacity-10 blur-[120px] pointer-events-none" />

      {/* Signature element: dual counter-rotating rings around a pulsing code glyph */}
      <div className="relative w-28 h-28">
        <div className="absolute inset-0 rounded-full border-2 border-secondary/15" />
        <motion.div
          className="absolute inset-0 rounded-full border-t-2 border-secondary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-b-2 border-tertiary"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-secondary text-2xl font-bold font-mono">
            {"</>"}
          </span>
        </motion.div>
      </div>

      {/* Terminal-style boot text */}
      <div className="font-mono text-sm text-silver flex items-center gap-1 min-h-[20px]">
        <span className="text-tertiary">$</span>
        <span>{displayedText}</span>
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="text-secondary"
        >
          ▍
        </motion.span>
      </div>
    </div>
  );
}

export default ScreenLoader;