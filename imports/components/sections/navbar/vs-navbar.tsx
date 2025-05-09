import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../ui/button";
import {
  Navbar as NavbarComponent,
  NavbarLeft,
  NavbarRight,
} from "../../ui/navbar";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "../../ui/sheet";
import { Menu } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import {getClashLogos} from "@/utils/imageMap";
import MenuButton from "./MenuButton";
import MobileMenuPortal from "./MobileMenuPortal";

// Register ScrollToPlugin
gsap.registerPlugin(ScrollToPlugin);

// Define the expected return type for getClashLogos
interface ClashLogos {
  wordmark: {
    light: string;
    dark: string;
  };
  oneLine: {
    light: string;
    dark: string;
  };
  icon: {
    LogoSm: string;
    LogoMd: string;
    LogoLg: string;
    LogoXl: string;
  };
}

interface VSNavbarProps {
  // Add onApplyClick prop
  onApplyClick?: () => void;
}

export default function VSNavbar({ onApplyClick }: VSNavbarProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  // Check viewport size on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(document.documentElement.clientWidth < 760);
    };

    // Initial check
    checkMobile();

    // Add event listener for resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check for hash in URL on mount - only scroll if hash exists
  useEffect(() => {
    // Get the hash from the URL (e.g., #benefits, #pricing)
    const hash = window.location.hash.substring(1);

    if (hash) {
      // If hash exists, handle scrolling to the section after a delay
      const timer = setTimeout(() => {
        const targetElement = document.getElementById(hash);
        if (targetElement) {
          console.log(`Found target section from URL hash: ${hash}`);
          setActiveSection(hash);

          // Scroll to the section
          const offset = isMobile ? 70 : 100;
          gsap.to(window, {
            duration: 1.2,
            scrollTo: {
              y: targetElement,
              offsetY: offset
            },
            ease: "power3.inOut"
          });
        }
      }, 500);
      // Cleanup timer if component unmounts before timeout
      return () => clearTimeout(timer);
    }
    // Only handle hash-based scrolling, don't force scroll to top
    // This allows the SimpleHero to remain visible when loading the page
  }, [isMobile]);

  // GSAP animation for the navbar
  useGSAP(() => {
    const ctx = gsap.context(() => {
      if (isVisible) {
        gsap.to(navbarRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(navbarRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.3,
          ease: "power1.in"
        });
      }
    }, navbarRef);

    return () => ctx.revert();
  }, [isVisible]);

  // Timer for clearing active section highlight
  const clearActiveHighlightTimer = useRef<NodeJS.Timeout | null>(null);

  // Handle scroll for navbar visibility only (not for active section detection)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Only show navbar at the very top of the page (0-10px)
      if (currentScrollY <= 10) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Immediately hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY) {
        // Scrolling down - hide immediately
        setIsVisible(false);
      } else {
        // Scrolling up - show immediately
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);

      // Clear the active section timer on unmount
      if (clearActiveHighlightTimer.current) {
        clearTimeout(clearActiveHighlightTimer.current);
      }
    };
  }, [lastScrollY]);

  // Smooth scroll function for nav links - now clears highlight after delay
  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, targetId: string): void => {
    e.preventDefault();
    console.log(`Navigating to section: ${targetId}`);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      console.log(`Found target element with id: ${targetId}`);

      // Set active section for temporary styling
      setActiveSection(targetId);

      // Clear any existing timers
      if (clearActiveHighlightTimer.current) {
        clearTimeout(clearActiveHighlightTimer.current);
      }

      // Set timer to clear active section after 1.5 seconds
      clearActiveHighlightTimer.current = setTimeout(() => {
        setActiveSection("");
      }, 1500);

      // Use GSAP for smooth scrolling with adaptive offset based on screen size
      const offset = isMobile ? 70 : 100;

      gsap.to(window, {
        duration: 1.2,
        scrollTo: {
          y: targetElement,
          offsetY: offset
        },
        ease: "power3.inOut"
      });
    } else {
      console.error(`Target element with id "${targetId}" not found. Check that the section has the correct ID.`);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    // When opening menu, prevent body scrolling
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Handle "Get Your Plan" button click with qualification modal
  const handleApplyClick = () => {
    // Close mobile menu if open
    closeMobileMenu();

    // If onApplyClick prop is provided, call it directly
    if (typeof onApplyClick === 'function') {
      onApplyClick();
    }

    // Also dispatch the event for compatibility with other components
    const event = new CustomEvent('openQualificationModal');
    window.dispatchEvent(event);
  };

  return (
    <header
      ref={navbarRef}
      className="fixed top-0 w-8/10 z-[3000] px-0 sm:px-4 md:px-6 py-2 sm:py-3 left-1/2 -translate-x-1/2"
    >
      <div className="w-full bg-theme-primary sm:bg-theme-primary backdrop-blur-sm sm:backdrop-blur-md border border-theme-accent sm:border-theme-accent relative mx-auto rounded-theme-xl sm:rounded-theme-2xl p-0 sm:p-2 py-1 sm:py-2.5 px-0 sm:px-4 md:px-6 shadow-md hover:shadow-lg overflow-hidden">
        {/* Desktop navbar */}
        <div className="hidden sm:block">
          <NavbarComponent className="py-1">
            <NavbarLeft className="gap-1 sm:gap-2">
              <img
                src={(getClashLogos() as ClashLogos).icon.LogoSm || '/assets/ClashLogo/Logo@1x.webp'}
                alt="Clash Creation"
                className="h-10 md:h-15 shadow-theme-logo"
                onError={(e) => {
                  e.currentTarget.src = '/assets/ClashLogo/Logo@1x.webp';
                }}
              />
              <div className="w-70 h-10 md:h-10 bg-transparent flex overflow-visible flex-nowrap items-center justify-center">
                <span className="vs-text-gradient-nav-title flex-nowrap text-nowrap w-max md:text-3xl lg:text-4xl font-[350] ml-5">the vertical shortcut.</span>
              </div>
            </NavbarLeft>

            <nav className="hidden md:flex ml-4 w-max-[1240]:gap-4 lg:ml-8 lg:gap-6">
              <button
                onClick={(e) => handleNavLinkClick(e, "case-studies")}
                className={`px-3 lg:px-6 py-2 lg:py-3 rounded-theme-lg text-theme-primary border border-theme-accent hover:bg-theme-secondary text-sm lg:text-md font-medium transition-theme-bounce duration-300 ${activeSection === "case-studies" ? "bg-theme-secondary shadow-theme-btn" : ""}`}
              >
                Case Studies
              </button>
              <button
                onClick={(e) => handleNavLinkClick(e, "course-timeline")}
                className={`px-3 lg:px-6 py-2 lg:py-3 rounded-theme-lg text-theme-primary border border-theme-accent hover:bg-theme-secondary/30 text-xs lg:text-sm font-medium transition-all duration-300 ${activeSection === "course-timeline" ? "bg-theme-secondary shadow-theme-btn" : ""}`}
              >
                Curriculum
              </button>
              <button
                onClick={(e) => handleNavLinkClick(e, "connect-everything")}
                className={`px-3 lg:px-6 py-2 lg:py-3 rounded-theme-lg text-theme-primary border border-theme-accent hover:bg-theme-secondary/30 text-xs lg:text-sm font-medium transition-all duration-300 ${activeSection === "connect-everything" ? "bg-theme-secondary shadow-theme-btn" : ""}`}
              >
                Tech
              </button>
              <button
                onClick={(e) => handleNavLinkClick(e, "team-section")}
                className={`px-3 lg:px-6 py-2 lg:py-3 rounded-theme-lg text-theme-primary border border-theme-accent hover:bg-theme-secondary/30 text-xs lg:text-sm font-medium transition-all duration-300 ${activeSection === "team-section" ? "bg-theme-secondary shadow-theme-btn" : ""}`}
              >
                The Team
              </button>

              {/*
              <button 
                onClick={(e) => handleNavLinkClick(e, "testimonials")}
                className={`px-3 lg:px-6 py-2 lg:py-3 rounded-theme-lg text-theme-primary border border-theme-accent hover:bg-theme-secondary/30 text-xs lg:text-sm font-medium transition-all duration-[--transition-bounce] ${activeSection === "testimonials" ? "bg-theme-secondary shadow-theme-btn" : ""}`}
              >
                Success Stories
              </button>

              <button
                onClick={(e) => handleNavLinkClick(e, "pricing")}
                className={`px-3 lg:px-6 py-2 lg:py-3 rounded-theme-lg text-theme-primary border border-theme-accent hover:bg-theme-secondary text-xs lg:text-sm font-medium transition-all hover:shadow-theme-btn ${activeSection === "pricing" ? "bg-theme-secondary shadow-theme-btn" : ""}`}
              >
                Pricing
              </button>

              */}
            </nav>

            <NavbarRight className="gap-2">
              <Button
                variant="default"
                className="vs-btn-secondary-gradient py-2.5 md:py-3 px-3 md:px-4 text-md shadow-theme-sm glow-theme-secondary transition-theme-bounce hover:shadow-theme-md"
                onClick={handleApplyClick}
              >
                Get Your Plan
              </Button>
            </NavbarRight>
          </NavbarComponent>
        </div>

        {/* Mobile navbar with simplified two-column layout - SMALLER SIZE */}
        <div className="flex sm:hidden w-full justify-between px-4 py-1">
          {/* Left side: Logo + Title */}
          <div className="flex items-center gap-2">
            <img
              src={(getClashLogos() as ClashLogos).icon.LogoSm || '/assets/ClashLogo/Logo@1x.webp'}
              alt="Clash Creation"
              className="h-[5svh]"
              onError={(e) => {
                e.currentTarget.src = '/assets/ClashLogo/Logo@1x.webp';
              }}
            />
            <span className=" ml-1 max-h-max text-line vs-text-gradient-nav-title leading-4.5 text-[1.2rem]">the <br />vertical shortcut.</span>
          </div>

          {/* Right side: "Get Plan" button and Hamburger Menu */}
          <div className="flex flex-row items-center">
            <Button
              variant="default"
              className="vs-btn-secondary-gradient-hover py-1 px-4 text-xs shadow-theme-sm transition-theme-bounce mr-2"
              onClick={handleApplyClick}
            >
              <span className="text-sm whitespace-nowrap font-semibold">Go Viral</span>
            </Button>

            {/* New Hamburger Menu Button */}
            <MenuButton 
              isOpen={isMobileMenuOpen} 
              onClick={toggleMobileMenu}
              className={" z-[9999] "}
            />
          </div>
        </div>

        {/* Mobile menu drawer using MobileMenuPortal component */}
        <MobileMenuPortal 
          isOpen={isMobileMenuOpen}
          onClose={closeMobileMenu}
          onNavLinkClick={handleNavLinkClick}
          activeSection={activeSection}
          onApplyClick={handleApplyClick}
        />
      </div>
    </header>
  );
};
