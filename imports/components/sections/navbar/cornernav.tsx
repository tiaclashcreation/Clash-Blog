import { SiInstagram, SiLinkedin, SiGitter, SiYoutube } from "react-icons/si";
import React, { Dispatch, ReactNode, SetStateAction, useState, useEffect, useRef, createContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiX } from "react-icons/fi";
import { getClashLogos } from "@/utils/imageMap";

// NavContext to allow close from LinksOverlay
const NavContext = createContext<{ setActive?: (v: boolean) => void }>({});

// Wrap Nav in NavContext.Provider
export const Nav = () => {
  const [active, setActive] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastDirection = useRef<'up' | 'down' | null>(null);

  // Smart scroll detection for hiding/showing hamburger
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current) {
        // Scrolling down
        if (lastDirection.current !== 'down') {
          lastDirection.current = 'down';
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          scrollTimeout.current = setTimeout(() => {
            setShowButton(false);
          }, 2000); // 2 seconds of scrolling down
        }
      } else {
        // Scrolling up
        if (lastDirection.current !== 'up') {
          lastDirection.current = 'up';
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
          setShowButton(true);
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

  // Mobile CTA handler
  const handleApplyClick = () => {
    const event = new CustomEvent('openQualificationModal');
    window.dispatchEvent(event);
    setActive(false);
  };

  return (
    <NavContext.Provider value={{ setActive }}>
      {/* Floating Hamburger Button */}
      <AnimatePresence>
        {showButton && !active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed right-4 top-4 z-50"
          >
            <HamburgerButton active={active} setActive={setActive} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Floating Nav Card */}
      <AnimatePresence>
        {active && (
          <LinksOverlay onApplyClick={handleApplyClick} />
        )}
      </AnimatePresence>
    </NavContext.Provider>
  );
};

const LinksOverlay = ({ onApplyClick }: { onApplyClick: () => void }) => {
  const navContext = React.useContext(NavContext);
  const handleClose = () => {
    if (navContext && navContext.setActive) navContext.setActive(false);
  };
  return (
    <nav
      className="fixed right-4 top-4 z-40 w-[min(90vw,260px)] p-4 rounded-xl shadow-lg flex flex-col items-start bg-[var(--theme-bg-primary)] border border-[var(--theme-accent)]"
      style={{ position: 'fixed' }}
    >
      <button
        aria-label="Close menu"
        onClick={handleClose}
        className="absolute top-2 right-2 p-2 rounded-full hover:bg-[var(--theme-accent-secondary)] text-[var(--theme-accent)] hover:text-white transition-colors"
        style={{ fontSize: 22 }}
      >
        <FiX />
      </button>
      <Logo />
      <LinksContainer />
      <FooterCTA onApplyClick={onApplyClick} />
    </nav>
  );
};

const LinksContainer = () => {
  return (
    <motion.div className="space-y-3 w-full flex flex-col items-start mt-2">
      {LINKS.map((l, idx) => {
        return (
          <NavLink key={l.title} href={l.href} idx={idx}>
            {l.title}
          </NavLink>
        );
      })}
    </motion.div>
  );
};

const NavLink = ({
  children,
  href,
  idx,
}: {
  children: ReactNode;
  href: string;
  idx: number;
}) => {
  return (
    <motion.a
      initial={{ opacity: 0, y: -8 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.75 + idx * 0.125,
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
      exit={{ opacity: 0, y: -8 }}
      href={href}
      className="block text-lg font-[350] text-[var(--theme-accent)] transition-colors hover:text-[var(--theme-accent-secondary)] text-left"
      style={{ fontFamily: 'var(--font-sans, sans-serif)' }}
    >
      {children}
    </motion.a>
  );
};

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.5, duration: 0.5, ease: "easeInOut" },
      }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-col items-start justify-center mb-2"
    >
      <img
        src={(getClashLogos() as any).icon.LogoSm || '/assets/ClashLogo/Logo@1x.webp'}
        alt="Clash Creation"
        className="h-10 w-10 rounded-full shadow-theme-logo bg-white mb-1"
        onError={(e) => {
          e.currentTarget.src = '/assets/ClashLogo/Logo@1x.webp';
        }}
      />
      <span className="text-lg font-[350] tracking-tight select-none text-[var(--theme-accent)]" style={{ fontFamily: 'var(--font-sans, sans-serif)' }}>the vertical shortcut.</span>
    </motion.div>
  );
};

const HamburgerButton = ({
  active,
  setActive,
}: {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      initial={false}
      animate={active ? "open" : "closed"}
      onClick={() => setActive((pv) => !pv)}
      className="fixed right-4 top-4 z-50 h-12 w-12 bg-[var(--theme-accent)] rounded-xl shadow-lg hover:bg-[var(--theme-accent-secondary)] transition-all flex items-center justify-center"
      aria-label="Open menu"
      type="button"
    >
      <motion.span
        variants={HAMBURGER_VARIANTS.top}
        className="absolute block h-1 w-7 rounded"
        style={{ backgroundColor: "white", y: "-50%", left: "50%", x: "-50%" }}
      />
      <motion.span
        variants={HAMBURGER_VARIANTS.middle}
        className="absolute block h-1 w-7 rounded"
        style={{ backgroundColor: "white", left: "50%", x: "-50%", top: "50%", y: "-50%" }}
      />
      <motion.span
        variants={HAMBURGER_VARIANTS.bottom}
        className="absolute block h-1 w-4 rounded"
        style={{ backgroundColor: "white", x: "-50%", y: "50%" }}
      />
    </motion.button>
  );
};

const FooterCTA = ({ onApplyClick }: { onApplyClick: () => void }) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 1.125,
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
      exit={{ opacity: 0, y: 8 }}
      className="mt-4 flex items-center gap-2 rounded-full bg-gradient-to-br from-[var(--theme-accent)] to-[var(--theme-accent-secondary)] px-4 py-2 text-base uppercase text-white font-[350] transition-colors hover:bg-[var(--theme-accent-secondary)] hover:text-white"
      onClick={onApplyClick}
      style={{ fontFamily: 'var(--font-sans, sans-serif)' }}
    >
      Get Your Plan <FiArrowRight />
    </motion.button>
  );
};

const LINKS = [
  {
    title: "Case Studies",
    href: "#case-studies",
  },
  {
    title: "Curriculum",
    href: "#course-timeline",
  },
  {
    title: "Tech",
    href: "#connect-everything",
  },
  {
    title: "The Team",
    href: "#team-section",
  },
];

const SOCIAL_CTAS = [
  {
    Component: SiGitter,
    href: "#",
  },
  {
    Component: SiInstagram,
    href: "#",
  },
  {
    Component: SiLinkedin,
    href: "#",
  },
  {
    Component: SiYoutube,
    href: "#",
  },
];

const UNDERLAY_VARIANTS = {
  open: {
    width: "calc(100% - 32px)",
    height: "calc(100vh - 32px)",
    transition: { type: "spring", mass: 3, stiffness: 400, damping: 50 },
  },
  closed: {
    width: "80px",
    height: "80px",
    transition: {
      delay: 0.75,
      type: "spring",
      mass: 3,
      stiffness: 400,
      damping: 50,
    },
  },
};

const HAMBURGER_VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "35%"],
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
      bottom: ["35%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "35%"],
      left: "calc(50% + 10px)",
    },
  },
};