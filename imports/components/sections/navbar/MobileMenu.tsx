import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import NavLink from './NavLink';

interface MobileMenuProps {
  onClose: () => void;
  isOpen: boolean;
  onNavLinkClick: (e: React.MouseEvent<HTMLButtonElement>, targetId: string) => void;
  activeSection: string;
  onApplyClick: () => void;
}

const navLinks = [
  { id: "case-studies", label: "Case Studies" },
  { id: "course-timeline", label: "Curriculum" },
  { id: "connect-everything", label: "Tech" },
  { id: "team-section", label: "The Team" }
];

// Animation variants for the menu container
const menuVariants = {
  closed: {
    opacity: 0,
    x: "100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  open: {
    opacity: 1,
    x: "0%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

// Animation variants for each menu item
const itemVariants = {
  closed: {
    opacity: 0,
    y: 20,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

// Animation for the background blur
const backdropVariants = {
  closed: {
    opacity: 0,
    transition: {
      delay: 0.2
    }
  },
  open: {
    opacity: 1
  }
};

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  onClose, 
  isOpen, 
  onNavLinkClick, 
  activeSection,
  onApplyClick
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />
          
          {/* Menu Container */}
          <motion.div
            className="fixed top-[60px] right-[5%] h-auto max-h-[80vh] w-[90vw] max-w-sm rounded-xl bg-theme-primary shadow-lg z-[9999] flex flex-col overflow-hidden"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <motion.div 
              className="flex justify-between items-center px-4 py-3 border-b border-theme-accent/20"
              variants={itemVariants}
            >
              <div className="text-theme-primary text-lg font-semibold">Menu</div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-theme-secondary/20 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-theme-primary" />
              </button>
            </motion.div>
            
            {/* Navigation Links */}
            <motion.div className="flex-1 overflow-y-auto p-4">
              <motion.nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.id}
                    targetId={link.id}
                    activeSection={activeSection}
                    onClick={(e, id) => {
                      onNavLinkClick(e, id);
                      onClose();
                    }}
                    className="w-full text-left"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </motion.nav>
            </motion.div>
            
            {/* Actions/Footer - Removed top margin to reduce gap */}
            <motion.div 
              className="p-4 border-t border-theme-accent/20 mt-0"
              variants={itemVariants}
            >
              <motion.button
                className="w-full py-3 px-4 rounded-lg text-white font-medium vs-btn-vibrant-gradient shadow-theme-sm"
                onClick={() => {
                  onApplyClick();
                  onClose();
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Your Plan
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu; 