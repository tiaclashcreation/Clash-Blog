import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import VsBadge from '../ui/vs-badge';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);
import AnimatedLogo from '../logos/AnimatedLogo';
import IsometricGridBackground from './IsometricPattern';
import { AnimatedButton } from '../marble-buttons/AnimatedButton';
import ContactModal from '../modals/ContactModal';

// Enable GSAP animations globally (fix for animation blocking)
// This runs once on import
gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false,
  units: {left: "%", top: "%", rotation: "rad"}
});

// Ensure GSAP animations are not disabled
if (typeof window !== 'undefined') {
  // Check if animations are disabled by browser settings
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Allow minimal animations even when reduced motion is preferred
    gsap.defaults({
      duration: 0.5,
      ease: "power1.out"
    });
  }
}

interface SimpleHeroProps {
  onCtaClick?: () => void;
  videoUrl?: string;
  videoRef?: React.RefObject<HTMLDivElement>;
}

const SimpleHero = React.forwardRef<HTMLDivElement, SimpleHeroProps>(
  ({ onCtaClick, videoUrl, videoRef }, ref) => {
    // Use initial state of false to control animation sequence properly
    const [logoAnimationStarted, setLogoAnimationStarted] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Internal refs
    const heroRef = React.useRef<HTMLDivElement>(null);
    const videoContainerRef = React.useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);

    // Detect mobile device on mount and window resize
    useEffect(() => {
      const checkIsMobile = () => {
        setIsMobile(document.documentElement.clientWidth < 780);
      };
      // Initial check
      checkIsMobile();

      // Add resize listener
      window.addEventListener('resize', checkIsMobile);

      // Cleanup
      return () => {
        window.removeEventListener('resize', checkIsMobile);
      };
    }, []);

    // Shorter auto-start delay, but keep the sequencing
    useEffect(() => {
      // Keep everything visible initially
      if (heroRef.current) {
        gsap.set(heroRef.current, { visibility: "visible" });
      }

      if (logoRef.current) {
        gsap.set(logoRef.current, { visibility: "visible" });
      }

      // Start with a very small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setLogoAnimationStarted(true);
      }, 100); // Reduced to 100ms for much quicker start

      return () => {
        clearTimeout(timer);
      };
    }, []);

    // Add GSAP animation for content elements
    useGSAP(() => {
      if (!heroRef.current) return;

      // Ensure content is set to visible before animating
      // We're NOT changing opacity here to avoid flickering
      gsap.set(".hero-content", { visibility: "visible" });

      // Set up animation only when ready to avoid flashing
      if (logoAnimationStarted) {
        const ctx = gsap.context(() => {
          // Make logo container visible, but don't change opacity
          if (logoRef.current) {
            gsap.set(logoRef.current, { visibility: "visible" });
          }

          // Animate the badge
          if (badgeRef.current) {
            gsap.fromTo(badgeRef.current,
              { y: -30, opacity: 0, scale: 0.9 },
              { 
                y: 0, 
                opacity: 1, 
                scale: 1, 
                duration: 0.8, 
                ease: "back.out(1.7)",
                delay: 0.3
              }
            );
          }

          // Animate content in, but don't set initial opacity to 0
          // to prevent disappearing content
          gsap.fromTo(".hero-content",
            {
              y: 20,
              scale: 0.95
            },
            {
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.08,
              ease: "back.out",
              overwrite: true // Prevent animation conflicts
            }
          );

          // Only animate text elements that have the hero-text-animate class
          // Don't affect other elements
          const textElements = document.querySelectorAll(".hero-text-animate");
          if (textElements.length > 0) {
            gsap.fromTo(textElements,
              {
                y: 15,
                scale: 0.97,
                opacity: 0.7
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.06,
                ease: "power2.out",
                delay: 0.1,
                overwrite: true // Prevent animation conflicts
              }
            );
          }

          // Eyeball animation
          const eyeball = document.getElementById("eyeballSvg");
          if (eyeball) {
            const isMobileView = document.documentElement.clientWidth < 640;
            gsap.fromTo(eyeball,
              {
                y: isMobileView ? 20 : 50,
                opacity: 0.8,
                rotation: -1
              },
              {
                y: isMobileView ? 0 : -10,
                opacity: 1,
                rotation: 0,
                duration: 1,
                ease: "power2.out",
                overwrite: true // Prevent animation conflicts
              }
            );
          }
        }, heroRef);

        return () => ctx.revert(); // Proper cleanup
      }
    }, [logoAnimationStarted, videoUrl, isMobile]);

    // Force modals to work by handling click events directly
    const handleContactModalClick = () => {
      document.body.style.overflow = 'hidden'; // Prevent body scrolling
      setIsContactModalOpen(true);
    };

    const handleCloseModal = () => {
      document.body.style.overflow = ''; // Restore body scrolling
      setIsContactModalOpen(false);
    };

    return (
      <section
        ref={ref}
        className="vs-section-light overflow-hidden relative h-[100vh] sm:h-[100vh] w-full shadow-theme-md -z-10 pt-6 sm:pt-0 pb-0"
      >
        {/* Radial gradient vignette overlay */}
        <div className="vignette-overlay" />

        {/* Contact Modal */}
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={handleCloseModal}
        />
        {/* Mobile Eyeball - only visible on mobile at bottom left - position adjusted */}
        <div className="block overflow-hidden absolute -bottom-10 -left-18 z-0 -rotate-20 sm:scale-130 sm:-left-3 sm:-bottom-10 md:scale-160 lg:scale-190 lg:left-30 animate-float-gentle">
          <svg
            width="650"
            height="550"
            viewBox="0 0 679 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            id="eyeballSvgMobile"
            className="w-[300px] h-auto -z-[1]"
            aria-hidden="true"
          >
            <circle
              cx="331.484"
              cy="347.484"
              r="231.656"
              transform="rotate(-90 331.484 347.484)"
              fill="var(--theme-eyeball-outer)"
            />
            <ellipse
              cx="387.704"
              cy="307.815"
              rx="143.553"
              ry="143.168"
              transform="rotate(-90 387.704 307.815)"
              fill="var(--theme-eyeball-iris)"
            />
            <path
              d="M324.537 240.611C337.361 218.609 357.976 202.262 382.267 194.834C406.558 187.406 432.737 189.444 455.577 200.541C478.417 211.637 496.239 230.976 505.483 254.697C514.727 278.417 514.714 304.773 505.446 328.503C496.178 352.233 478.337 371.59 455.485 382.711C432.634 393.832 406.453 395.897 382.169 388.495C357.886 381.092 337.287 364.767 324.486 342.778C311.684 320.789 307.622 294.755 313.109 269.872L411.566 291.649L324.537 240.611Z"
              fill="var(--theme-eyeball-pupil)"
            />
          </svg>
        </div>
        <IsometricGridBackground />
        {/* Theme-aware floating elements for visual interest */}
        <div className="absolute top-12 sm:top-40 left:8% sm:left-[15%] w-28 h-28 rounded-[40%] rotate-12
                       opacity-[15%]
                       bg-[var(--theme-float-bg-primary)]
                       animate-float-slow md:block"></div>
        <div className="absolute scale-250 bottom-20 sm:bottom-40 right-[10%] w-36 h-36 rounded-[30%] -rotate-6
                       opacity-[10%]
                       bg-[var(--theme-float-bg-secondary)]
                       animate-float-medium md:block"></div>

        {/* Award Badge - Moved to main area, positioned absolutely */}
          {/* Desktop Eyeball - only visible on larger screens */}
          <div className="hidden z-30 sm:row-[5_/_7]
                      md:col-[1_/_4] md:row-[5_/_7]"
               data-speed="0.9"
          >
              <svg
                  width="679"
                  height="600"
                  viewBox="0 0 679 600"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  id="eyeballSvgDesktop"
                  className="
                sm:w-[350px] md:w-[420px] lg:w-[500px] xl:w-[567px]
                absolute
                sm:bottom-[-20vh] sm:left-[10%]
                md:bottom-[-25vh] md:left-[5%]
                lg:bottom-[-30vh] lg:left-[5%]
                opacity-100
                transition-all duration-500
                animate-float-gentle
                z-20
                hidden
              "
                  aria-hidden="true"
              >
                  <circle
                      cx="331.484"
                      cy="347.484"
                      r="231.656"
                      transform="rotate(-90 331.484 347.484)"
                      fill="var(--theme-eyeball-outer)"
                  />
                  <ellipse
                      cx="387.704"
                      cy="307.815"
                      rx="143.553"
                      ry="143.168"
                      transform="rotate(-90 387.704 307.815)"
                      fill="var(--theme-eyeball-iris)"
                  />
                  <path
                      d="M324.537 240.611C337.361 218.609 357.976 202.262 382.267 194.834C406.558 187.406 432.737 189.444 455.577 200.541C478.417 211.637 496.239 230.976 505.483 254.697C514.727 278.417 514.714 304.773 505.446 328.503C496.178 352.233 478.337 371.59 455.485 382.711C432.634 393.832 406.453 395.897 382.169 388.495C357.886 381.092 337.287 364.767 324.486 342.778C311.684 320.789 307.622 294.755 313.109 269.872L411.566 291.649L324.537 240.611Z"
                      fill="var(--theme-eyeball-pupil)"
                  />
              </svg>
          </div>
        {/* Video container - REMOVED as it's now a static section below */}
        {/* Grid Layout */}
        <div
          ref={heroRef}
          className="w-full h-full relative"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.618fr) minmax(0, 1fr) minmax(0, 1.618fr) minmax(0, 2.618fr) minmax(0, 4.237fr) minmax(0, 2.618fr) minmax(0, 1.618fr) minmax(0, 1fr) minmax(0, 1.618fr)',
            gridTemplateRows: 'minmax(0, 1.618fr) minmax(0, 1fr) minmax(0, 1.618fr) minmax(0, 2.618fr) minmax(0, 4.237fr) minmax(0, 2.618fr) minmax(0, 1.618fr) minmax(0, 1fr) minmax(0, 1.618fr)',
            visibility: 'visible' // Force visibility at the container level
          }}
        >
          <VsBadge ref={badgeRef} />
          {/* Color blocks positioned in grid */}
          <div style={{ gridColumn: '5 / 6', gridRow: '1 / 3' }} className="w-full rounded-s-sm shadow-theme-btn-secondary opacity-70 h-full -translate-y-7 sm:-translate-y-0 vs-btn-secondary-gradient z-10" /> {/* Teal block */}
          <div style={{ gridColumn: '6 / 8', gridRow: '1 / 4' }} className="w-full  rounded-s-sm shadow-theme-btn-primary h-full -translate-y-10 sm:-translate-y-0 vs-btn-vibrant-gradient z-10" /> {/* Orange block */}
          <div style={{ gridColumn: '8 / 10', gridRow: '1 / 5' }} className="w-full rounded-s-sm shadow-theme-btn-secondary opacity-70 h-full -translate-y-20 sm:-translate-y-0 vs-btn-destructive-gradient z-10" /> {/* Red block */}

          {/* Animated VS Logo with immediate visibility */}
          <div 
            className="flex items-center justify-center -z-50 scale-140
                      col-[3_/_5] row-[1_/_4]
                      sm:col-[2_/_5] sm:row-[2_/_5]
                      md:col-[2_/_5] md:row-[2_/_5]
                      lg:col-[2_/_5] lg:row-[2_/_7]"
            data-speed="0.86"
          >
            <div className="relative flex items-center justify-center
                          -translate-x-[5%] sm:translate-x-0
                          translate-y-[5%] sm:translate-y-0">
              {/* Logo wrapper with forced visibility and no opacity transition */}
              <div 
                ref={logoRef}
                className="
                  relative 
                  w-[150px] h-[150px]
                  sm:w-[450px] sm:h-[450px]
                  md:w-[550px] md:h-[550px]
                  lg:w-[600px] lg:h-[600px]
                  xl:w-[650px] xl:h-[650px]
                  2xl:w-[750px] 2xl:h-[750px]
                  opacity-70 transition-all duration-200"
                style={{ 
                  visibility: 'visible', 
                  opacity: 1 
                }}
              >
                <AnimatedLogo 
                  className="w-full h-full opacity-70 object-contain z-40 saturate-120 bg-clip-content"
                  skipAnimation={true}
                  onAnimationComplete={() => console.log('Logo animation completed')}
                />
              </div>
            </div>
          </div>



          {/* HeroHeadline with attached subheading */}
          <div
            className="flex flex-col z-20 scale-110 translate-y-10 align-items-middle align-content-middle items-center
                     col-[1_/_10] row-[3_/_6]
                     sm:col-[5_/_9] sm:row-[4_/_6] 
                     md:col-[5_/_9] md:row-[4_/_6]
                     lg:col-[5_/_9] lg:row-[4_/_6]
                     px-4 sm:px-0 transition-all duration-500 
                     mt-[40px] sm:mt-0
                     w-full sm:w-auto md:w-auto lg:w-auto
                     sm:ml-2"
            data-speed="0.95"
          >

              <div className="w-full px-4 sm:px-6 md:px-6 lg:px-8 xl:px-10 pt-6 sm:pt-0 relative">
                <div className="w-full overflow-visible pl-4 sm:pl-0">
                  <h1 className="hero-content text-center sm:text-left mb-6 text-theme-primary transition-theme-fast duration-500 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.08)]">
                    <div className="whitespace-nowrap">
                      <span className="inline font-semibold vs-text-gradient-hero-red text-[3.25rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-theme-accent-tertiary drop-shadow-[2px_2px_3px_rgba(0,0,0,0.12)]" data-speed="0.95">
                        Billions
                      </span>
                      <span className= "inline-block ml-2 sm:ml-3 lg:ml-4 font-light text-[2.5rem] sm:text-3xl md:text-4xl lg:text-6xl xl:text-6xl drop-shadow-[1.5px_1.5px_2px_rgba(0,0,0,0.1)]" data-speed="0.99">
                        of Views.
                      </span>
                    </div>
                    <span className=" block font-normal text-[2.25rem] sm:text-4xl sm:font-light md:text-4xl lg:text-5xl xl:text-6xl transition-all duration-500 mt-2 drop-shadow-[1.5px_1.5px_2px_rgba(0,0,0,0.1)]" data-speed="0.97">
                      Built for Founders.
                    </span>
                  </h1>

                  <div className="h-4 sm:h-8 md:h-9 lg:h-10 w-full"></div>

                  <p className="hero-text-animate hero-claim mb-4 sm:mb-6 text-theme-primary text-center sm:text-left drop-shadow-[1px_1px_1.5px_rgba(0,0,0,0.07)]"
                     style={{
                       fontSize: "clamp(1.15rem, 2vw, 2.25rem)",
                       fontWeight: 300,
                       lineHeight: 1.4,
                       maxWidth: "100%",
                       marginBottom: "1rem",
                       paddingRight: "1rem",
                       width: "100%"
                     }}
                     data-speed="0.99">
                    We've used vertical video to get founders and execs just like you, billions of views — in fact we're the top-performing agency in the world at doing exactly that.
                  </p>

                </div>
              </div>


              {/* Animated Buttons with responsive sizes - moved up */}
              <div className="hero-content relative max-w-9/10 sm:w-full mt-6 sm:mt-10 md:mt-12 lg:mt-16" style={{paddingLeft: 0}}>
                <div className="flex justify-center sm:justify-start hover:transition-theme-bounce sm:absolute sm:left-0 flex-row items-center mobile-button-container
                               transform -translate-y-3.5 sm:translate-x-5 origin-center sm:origin-left">
                  <AnimatedButton
                    text="Get Your Plan"
                    variant="start"
                    disabled={false}
                    saturation="normal"
                    size="lg"
                    onClick={onCtaClick}
                    className="w-auto text-nowrap drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] vs-btn-vibrant-gradient shadow-theme-btn-primary hover:vs-btn-destructive-gradient shadow-theme-btn-secondary text-base sm:text-base md:text-lg lg:text-xl scale-95 sm:scale-100 mr-1"
                  />
                  <div className="flex mx-0 items-center h-full w-max px-0.5 text-theme-primary/40 mx-0 sm:mx-1">|</div>
                  <AnimatedButton
                      text="Get in Touch"
                      variant="docs"
                      saturation="normal"
                      size="lg"
                      onClick={handleContactModalClick}
                      className="w-auto text-nowrap w-1/2 drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] shadow-theme-btn-secondary text-base sm:text-base md:text-lg lg:text-xl scale-95 sm:scale-100 mr-1 hover:underline"
                  />
                  <div className="flex text-nowrap items-center h-full px-0.5 text-theme-primary/40 mx-0 sm:mx-1">|</div>
                </div>
              </div>

              {/* Additional spacing div to prevent overlap on mobile only */}
              <div className="block sm:hidden w-full h-24 mt-10"></div>
            </div>
          </div>
      </section>
    );
  }
);

SimpleHero.displayName = 'SimpleHero';

export default SimpleHero;
