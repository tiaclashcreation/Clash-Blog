import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

interface NavSmallProps {
  onApplyClick: () => void;
}

export const NavSmall = ({ onApplyClick }: NavSmallProps) => {
  return <ResponsiveNav onApplyClick={onApplyClick} />;
};

interface ResponsiveNavProps {
  onApplyClick: () => void;
}

const ResponsiveNav = ({ onApplyClick }: ResponsiveNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    {
      label: "Products",
      dropdownItems: ["Vertical Shortcut", "Agency Services", "Consulting"],
    },
    {
      label: "Resources",
      dropdownItems: ["Blog", "Case Studies", "Documentation"],
    },
    { label: "About" },
    { label: "Contact" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "py-2 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800"
          : "py-4 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className="flex items-center space-x-1 text-neutral-300 hover:text-white transition-colors"
                >
                  <span>{item.label}</span>
                  {item.dropdownItems && (
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  )}
                </button>

                {/* Desktop Dropdown */}
                {item.dropdownItems && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-48 rounded-md shadow-lg bg-neutral-900 ring-1 ring-neutral-700 overflow-hidden">
                    <div className="py-1">
                      {item.dropdownItems.map((dropdownItem, idx) => (
                        <a
                          key={idx}
                          href="#"
                          className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
                        >
                          {dropdownItem}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* CTA Button */}
            <JoinButton onClick={onApplyClick} />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-neutral-300 hover:text-white transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-neutral-900"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navItems.map((item, index) => (
                <div key={index} className="py-2">
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.label ? null : item.label
                      )
                    }
                    className="w-full flex justify-between items-center text-neutral-300 hover:text-white transition-colors"
                  >
                    <span>{item.label}</span>
                    {item.dropdownItems && (
                      <ChevronDown
                        className={`w-4 h-4 opacity-50 transform transition-transform ${
                          activeDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Mobile Dropdown */}
                  {item.dropdownItems && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-2 pl-4 space-y-2"
                    >
                      {item.dropdownItems.map((dropdownItem, idx) => (
                        <a
                          key={idx}
                          href="#"
                          className="block py-2 text-sm text-neutral-300 hover:text-white transition-colors"
                        >
                          {dropdownItem}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
              <div className="pt-4">
                <JoinButton onClick={onApplyClick} className="w-full" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <svg
        width="32"
        height="32"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-neutral-50"
      >
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
          stopColor="#000000"
        />
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
          stopColor="#000000"
        />
      </svg>
      <span className="text-neutral-50 font-medium text-xl">Clash</span>
    </div>
  );
};

interface JoinButtonProps {
  onClick: () => void;
  className?: string;
}

const JoinButton = ({ onClick, className = "" }: JoinButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative z-0 flex items-center justify-center gap-2 overflow-hidden 
        whitespace-nowrap rounded-lg border-[1px] border-neutral-700 
        px-4 py-2 font-medium text-neutral-300 transition-all duration-300
        
        before:absolute before:inset-0 before:-z-10 before:translate-y-[200%]
        before:scale-[2.5] before:rounded-[100%] before:bg-neutral-50
        before:transition-transform before:duration-1000 before:content-[""]

        hover:scale-105 hover:border-neutral-50 hover:text-neutral-900
        hover:before:translate-y-[0%]
        active:scale-100
        ${className}
      `}
    >
      Join waitlist
    </button>
  );
};