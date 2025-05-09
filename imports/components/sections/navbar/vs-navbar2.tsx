import React, { useState, useRef, Dispatch, SetStateAction, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getClashLogos } from "@/utils/imageMap";
import { AnimatedButton } from "@/components/marble-buttons/AnimatedButton";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { FiArrowRight } from "react-icons/fi";
import { animate, useMotionTemplate, useMotionValue } from "framer-motion";
import { Nav as CornerNav } from "@/Landing-Downloaded-Components/cornernav";
import { createPortal } from "react-dom";

// Register ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

type Position = {
  left: number;
  width: number;
  opacity: number;
};

interface VSNavbarProps {
  onApplyClick?: () => void;
}

// FancyButton adapted from FANCYButton.tsx
const FancyButton = ({ onClick }: { onClick: () => void }) => {
  const turn = useMotionValue(0);

  React.useEffect(() => {
    animate(turn, 1, {
      ease: "linear",
      duration: 5,
      repeat: Infinity,
    });
  }, []);

  const backgroundImage = useMotionTemplate`conic-gradient(from ${turn}turn, transparent 75%, var(--theme-accent) 100%)`;

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative group flex items-center gap-2 rounded-full bg-gradient-to-br from-[var(--theme-accent)] to-[var(--theme-accent-secondary)] px-6 py-2 text-base font-semibold text-white shadow-md transition-transform active:scale-[0.985] overflow-hidden"
      style={{ minWidth: 160 }}
    >
      <span className="z-10">Get Your Plan</span>
      <FiArrowRight className="z-10 -mr-4 opacity-0 transition-all group-hover:-mr-0 group-hover:opacity-100 group-active:-rotate-45" />
      <div className="pointer-events-none absolute inset-0 z-0 rounded-full">
        <motion.div
          style={{ backgroundImage }}
          className="mask-with-browser-support absolute -inset-[1px] rounded-full"
        />
      </div>
    </button>
  );
};

const Tab = ({
  children,
  setPosition,
  onClick,
  isActive,
}: {
  children: string;
  setPosition: Dispatch<SetStateAction<Position>>;
  onClick: (e: React.MouseEvent<HTMLElement>, targetId: string) => void;
  isActive: boolean;
}) => {
  const ref = useRef<null | HTMLLIElement>(null);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      onClick={(e) => onClick(e, children.toLowerCase().replace(' ', '-'))}
      className={`relative z-10 block cursor-pointer px-4 py-2 text-base font-semibold uppercase transition-colors duration-200 rounded-theme-md
        ${isActive ? 'text-[var(--theme-accent)] dark:text-white' : 'text-[var(--theme-text-primary)]'}
        hover:text-[var(--theme-accent)] dark:hover:text-white focus:outline-none`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{
        ...position,
        top: 0,
        height: '100%',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="absolute z-0 w-[var(--cursor-width)] bg-gradient-to-r from-[var(--theme-accent-secondary)] to-[var(--theme-accent-secondary-light)] rounded-theme-xl shadow-md"
      style={{ height: '100%' }}
    />
  );
};

// Define tab data with explicit section ids
const NAV_TABS = [
  { label: 'Case Studies', sectionId: 'case-studies' },
  { label: 'Curriculum', sectionId: 'course-timeline' },
  { label: 'Tech', sectionId: 'connect-everything' },
  { label: 'The Team', sectionId: 'team-section' },
];

export default function VSNavbar({ onApplyClick }: VSNavbarProps) {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [activeSection, setActiveSection] = useState("");
  const clearActiveHighlightTimer = useRef<NodeJS.Timeout | null>(null);

  // Smart sticky/hide navbar logic
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastDirection = useRef<'up' | 'down' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        if (lastDirection.current !== 'down') {
          lastDirection.current = 'down';
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          scrollTimeout.current = setTimeout(() => {
            setShowNavbar(false);
          }, 1500); // 1.5 seconds of scrolling down
        }
      } else {
        // Scrolling up
        if (lastDirection.current !== 'up') {
          lastDirection.current = 'up';
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          setShowNavbar(true);
        }
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLElement>, targetId: string): void => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      setActiveSection(targetId);

      if (clearActiveHighlightTimer.current) {
        clearTimeout(clearActiveHighlightTimer.current);
      }

      clearActiveHighlightTimer.current = setTimeout(() => {
        setActiveSection("");
      }, 1500);

      const offset = 100; // Fixed offset for desktop
      gsap.to(window, {
        duration: 1.2,
        scrollTo: {
          y: targetElement,
          offsetY: offset
        },
        ease: "power3.inOut"
      });
    }
  };

  const handleApplyClick = () => {
    if (typeof onApplyClick === 'function') {
      onApplyClick();
    }
    const event = new CustomEvent('openQualificationModal');
    window.dispatchEvent(event);
  };

  return (
    <>
      <AnimatePresence>
        {showNavbar && (
          <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-[3000]"
          >
            {/* Desktop Navbar */}
            <div className="hidden sm:block">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-5xl max-h-3xl relative mx-auto mt-2 rounded-theme-2xl px-4 py-2 flex items-center justify-between gap-4"
                style={{ boxShadow: '0 4px 32px 0 rgba(0,0,0,0.20)' }}
              >
                {/* Logo and title */}
                <div className="flex items-center gap-3 min-w-[220px]">
                  <img
                    src={(getClashLogos() as any).icon.LogoSm || '/assets/ClashLogo/Logo@1x.webp'}
                    alt="Clash Creation"
                    className="h-10 w-10 rounded-full shadow-theme-logo bg-white"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/ClashLogo/Logo@1x.webp';
                    }}
                  />
                  <span className="vs-text-gradient-nav-title text-2xl font-[350] ml-2 tracking-tight select-none">the vertical shortcut.</span>
                </div>
                {/* Slide Tabs Navigation */}
                <nav className="flex-1 flex justify-center">
                  <ul
                    onMouseLeave={() => {
                      setPosition((pv) => ({
                        ...pv,
                        opacity: 0,
                      }));
                    }}
                    className="relative flex w-fit h-12 rounded-theme-xl bg-[var(--theme-bg-primary)]/80 border border-[var(--theme-accent)] px-2 py-0 shadow-theme-sm items-center"
                    style={{ minWidth: 420 }}
                  >
                    <Cursor position={position} />
                    {NAV_TABS.map(tab => (
                      <Tab
                        key={tab.sectionId}
                        setPosition={setPosition}
                        onClick={(e) => handleNavLinkClick(e, tab.sectionId)}
                        isActive={activeSection === tab.sectionId}
                      >
                        {tab.label}
                      </Tab>
                    ))}
                  </ul>
                </nav>
                {/* CTA Button */}
                <div className="flex items-center min-w-[180  px] justify-end">
                  <FancyButton onClick={handleApplyClick} />
                </div>
              </motion.div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>
      {/* Always render CornerNav on mobile, outside AnimatePresence, using a portal */}
      {typeof window !== 'undefined' && window.innerWidth < 640 && createPortal(
        <div className="flex sm:hidden">
          <CornerNav />
        </div>,
        document.body
      )}
    </>
  );
}
