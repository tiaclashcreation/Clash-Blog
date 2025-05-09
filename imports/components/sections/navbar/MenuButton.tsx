import React from 'react';
import { motion } from 'framer-motion';

interface MenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ isOpen, onClick, className = '' }) => {
  // Line animation variants
  const topLineVariants = {
    closed: { 
      rotate: 0, 
      translateY: 0,
      transition: { 
        duration: 0.3,
        ease: [0.5, 0.05, 0.25, 1] 
      }
    },
    open: { 
      rotate: 45, 
      translateY: 7,
      transition: { 
        duration: 0.3,
        ease: [0.5, 0.05, 0.25, 1] 
      }
    }
  };

  const middleLineVariants = {
    closed: { 
      opacity: 1,
      transition: { 
        duration: 0.2,
        ease: [0.5, 0.05, 0.25, 1] 
      }
    },
    open: { 
      opacity: 0,
      transition: { 
        duration: 0.2,
        ease: [0.5, 0.05, 0.25, 1] 
      }
    }
  };

  const bottomLineVariants = {
    closed: { 
      rotate: 0, 
      translateY: 0,
      transition: { 
        duration: 0.3,
        ease: [0.5, 0.05, 0.25, 1] 
      }
    },
    open: { 
      rotate: -45, 
      translateY: -7,
      transition: { 
        duration: 0.3,
        ease: [0.5, 0.05, 0.25, 1] 
      }
    }
  };

  return (
    <button
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      onClick={onClick}
      className={`relative flex flex-col justify-center items-center w-10 h-10 rounded-md bg-transparent hover:bg-theme-accent/80 hover:vs-glow-drop-mix  transition-colors shadow-theme-sm ${className}`}
    >
      <div className="w-6 h-5 flex visible flex-col justify-between">
        <motion.div
          className="w-full h-[2px] bg-cyan-600 rounded-full origin-left"
          variants={topLineVariants}
          animate={isOpen ? "open" : "closed"}
        />
        <motion.div
          className="w-full h-1 bg-cyan-600 rounded-full"
          variants={middleLineVariants}
          animate={isOpen ? "open" : "closed"}
        />
        <motion.div
          className="w-full h-1 bg-cyan-600 rounded-full origin-left"
          variants={bottomLineVariants}
          animate={isOpen ? "open" : "closed"}
        />
      </div>
    </button>
  );
};

export default MenuButton; 