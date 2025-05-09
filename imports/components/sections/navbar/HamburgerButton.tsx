import React, { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';

interface HamburgerButtonProps {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

const HAMBURGER_VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["30%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "30%"],
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["30%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "30%"],
      left: "calc(50% + 10px)",
    },
  },
};

const HamburgerButton: React.FC<HamburgerButtonProps> = ({ active, setActive, className }) => {
  return (
    <motion.button
      initial={false}
      animate={active ? "open" : "closed"}
      onClick={() => setActive((pv) => !pv)}
      className={`relative group flex items-center justify-center rounded-full h-13 w-14 bg-transparent focus:outline-none focus:ring-2 focus:ring-theme-accent transition-all ${className || ''}`}
      aria-label="Open menu"
      type="button"
    >
      <motion.span
        variants={HAMBURGER_VARIANTS.top}
        className="absolute block h-1.5 w-8 rounded"
        style={{ backgroundColor: "var(--theme-accent)", y: "-50%", left: "50%", x: "-50%" }}
      />
      <motion.span
        variants={HAMBURGER_VARIANTS.middle}
        className="absolute block h-1.5 w-8 rounded"
        style={{ backgroundColor: "var(--theme-accent)", left: "50%", x: "-50%", top: "50%", y: "-50%" }}
      />
      <motion.span
        variants={HAMBURGER_VARIANTS.bottom}
        className="absolute block h-1.5 w-5 rounded"
        style={{ backgroundColor: "var(--theme-accent)", x: "-50%", y: "50%" }}
      />
    </motion.button>
  );
};

export default HamburgerButton; 