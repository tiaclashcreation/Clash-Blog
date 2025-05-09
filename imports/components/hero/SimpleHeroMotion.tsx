import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'motion/react';
import VsBadge from '../ui/vs-badge';
import AnimatedLogo from '../logos/AnimatedLogo';
import IsometricGridBackground from './IsometricPattern';
import { AnimatedButton } from '../marble-buttons/AnimatedButton';
import ContactModal from '../modals/ContactModal';
import { useDeviceDetection } from '../../utils/motion-utils';
import { FloatingElement } from '../ui/motion-components';

interface SimpleHeroProps {
  onCtaClick?: () => void;
  videoUrl?: string;
  videoRef?: React.RefObject<HTMLDivElement>;
}

const SimpleHeroMotion = React.forwardRef<HTMLDivElement, SimpleHeroProps>(
  ({ onCtaClick, videoUrl, videoRef }, ref) => {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const { isMobile } = useDeviceDetection();
    
    // Animation controls for sequenced animations
    const badgeControls = useAnimationControls();
    const logoControls = useAnimationControls();
    const contentControls = useAnimationControls();
    const textControls = useAnimationControls();
    
    // Internal refs
    const heroRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    
    // Sequence the animations on mount
    useEffect(() => {
      const animateSequence = async () => {
        // Start with the logo animation
        await logoControls.start({
          scale: 1,
          opacity: 0.7,
          transition: { 
            duration: 0.5, 
            ease: [0.34, 1.56, 0.64, 1] // equivalent to back.out
          }
        });
        
        // Animate the badge with a slight delay
        await badgeControls.start({
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.8,
            delay: 0.2,
            ease: [0.34, 1.56, 0.64, 1]
          }
        });
        
        // Animate the main content
        await contentControls.start({
          y: 0,
          scale: 1,
          transition: {
            duration: 0.8,
            stagger: 0.08,
            ease: [0.34, 1.56, 0.64, 1]
          }
        });
        
        // Animate the text elements
        await textControls.start({
          y: 0,
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.6,
            stagger: 0.06,
            ease: "easeOut",
            delay: 0.1
          }
        });
      };
      
      // Start the animation sequence
      animateSequence();
    }, [badgeControls, logoControls, contentControls, textControls]);
    
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
        {/* Contact Modal */}
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={handleCloseModal}
        />
        
        {/* Mobile Eyeball - only visible on mobile at bottom left - position adjusted */}
        <FloatingElement
          className="block overflow-hidden absolute -bottom-10 -left-18 z-0 -rotate-20 sm:scale-130 sm:-left-3 sm:-bottom-10 md:scale-160 lg:scale-190 lg:left-30"
          amplitude={10}
          duration={9}
        >
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
        </FloatingElement>
        
        <IsometricGridBackground />
        
        {/* Theme-aware floating elements for visual interest */}
        <FloatingElement
          className="absolute top-12 sm:top-40 left:8% sm:left-[15%] w-28 h-28 rounded-[40%] rotate-12
                    opacity-[15%]
                    bg-[var(--theme-float-bg-primary)]
                    md:block"
          amplitude={15}
          duration={6}
        />
        
        <FloatingElement
          className="absolute scale-250 bottom-20 sm:bottom-40 right-[10%] w-36 h-36 rounded-[30%] -rotate-6
                    opacity-[10%]
                    bg-[var(--theme-float-bg-secondary)]
                    md:block"
          amplitude={12}
          duration={5}
        />
        
        {/* Desktop Eyeball - only visible on larger screens */}
        <FloatingElement
          className="hidden z-30 sm:row-[5_/_7]
                    md:col-[1_/_4] md:row-[5_/_7]"
          data-speed="0.9"
          amplitude={8}
          duration={9}
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
        </FloatingElement>
        
        {/* Grid Layout */}
        <div
          ref={heroRef}
          className="w-full h-full relative"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.618fr) minmax(0, 1fr) minmax(0, 1.618fr) minmax(0, 2.618fr) minmax(0, 4.237fr) minmax(0, 2.618fr) minmax(0, 1.618fr) minmax(0, 1fr) minmax(0, 1.618fr)',
            gridTemplateRows: 'minmax(0, 1.618fr) minmax(0, 1fr) minmax(0, 1.618fr) minmax(0, 2.618fr) minmax(0, 4.237fr) minmax(0, 2.618fr) minmax(0, 1.618fr) minmax(0, 1fr) minmax(0, 1.618fr)'
          }}
        >
          {/* Badge with Motion animation */}
          <motion.div
            initial={{ y: -30, opacity: 0, scale: 0.9 }}
            animate={badgeControls}
          >
            <VsBadge />
          </motion.div>
          
          {/* Color blocks positioned in grid with Motion animations */}
          <motion.div 
            style={{ gridColumn: '5 / 6', gridRow: '1 / 3' }} 
            className="w-full rounded-s-sm shadow-theme-btn-secondary opacity-70 h-full -translate-y-7 sm:-translate-y-0 vs-btn-secondary-gradient z-10"
            initial={{ opacity: 0, y: isMobile ? -7 : -20 }}
            animate={{ opacity: 0.7, y: isMobile ? -7 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          
          <motion.div 
            style={{ gridColumn: '6 / 8', gridRow: '1 / 4' }} 
            className="w-full rounded-s-sm shadow-theme-btn-primary h-full -translate-y-10 sm:-translate-y-0 vs-btn-vibrant-gradient z-10"
            initial={{ opacity: 0, y: isMobile ? -10 : -30 }}
            animate={{ opacity: 1, y: isMobile ? -10 : 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          
          <motion.div 
            style={{ gridColumn: '8 / 10', gridRow: '1 / 5' }} 
            className="w-full rounded-s-sm shadow-theme-btn-secondary opacity-70 h-full -translate-y-20 sm:-translate-y-0 vs-btn-destructive-gradient z-10"
            initial={{ opacity: 0, y: isMobile ? -20 : -40 }}
            animate={{ opacity: 0.7, y: isMobile ? -20 : 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
          {/* Animated VS Logo with Motion animations */}
          <motion.div 
            className="flex items-center justify-center -z-50 scale-140
                      col-[3_/_5] row-[1_/_4]
                      sm:col-[2_/_5] sm:row-[2_/_5]
                      md:col-[2_/_5] md:row-[2_/_5]
                      lg:col-[2_/_5] lg:row-[2_/_7]"
            data-speed="0.86"
            initial={{ x: '5%', y: '5%' }}
            animate={{ x: 0, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="relative flex items-center justify-center
                      -translate-x-[5%] sm:translate-x-0
                      translate-y-[5%] sm:translate-y-0"
            >
              <motion.div 
                ref={logoRef}
                className="
                  relative 
                  w-[150px] h-[150px]
                  sm:w-[450px] sm:h-[450px]
                  md:w-[550px] md:h-[550px]
                  lg:w-[600px] lg:h-[600px]
                  xl:w-[650px] xl:h-[650px]
                  2xl:w-[750px] 2xl:h-[750px]
                  opacity-0 transition-all duration-200"
                initial={{ scale: 1.25, opacity: 0 }}
                animate={logoControls}
              >
                <AnimatedLogo 
                  className="w-full h-full opacity-70 object-contain z-40 saturate-120 bg-clip-content"
                  skipAnimation={true}
                  onAnimationComplete={() => console.log('Logo animation completed')}
                />
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* HeroHeadline with attached subheading */}
          <motion.div
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
            <motion.div 
              className="w-full px-4 sm:px-6 md:px-6 lg:px-8 xl:px-10 pt-6 sm:pt-0 relative"
              initial={{ y: 20, scale: 0.95 }}
              animate={contentControls}
            >
              <div className="w-full overflow-visible pl-4 sm:pl-0">
                <h1 className="text-center sm:text-left mb-6 text-theme-primary transition-theme-fast duration-500 drop-shadow-[1px_1px_2px_rgba(0,0,0,0.08)]">
                  <div className="whitespace-nowrap">
                    <motion.span 
                      className="inline font-semibold vs-text-gradient-hero-red text-[3.25rem] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-theme-accent-tertiary drop-shadow-[2px_2px_3px_rgba(0,0,0,0.12)]" 
                      data-speed="0.95"
                    >
                      Billions
                    </motion.span>
                    <motion.span 
                      className="inline-block ml-2 sm:ml-3 lg:ml-4 font-light text-[2.5rem] sm:text-3xl md:text-4xl lg:text-6xl xl:text-6xl drop-shadow-[1.5px_1.5px_2px_rgba(0,0,0,0.1)]" 
                      data-speed="0.99"
                    >
                      of Views.
                    </motion.span>
                  </div>
                  <motion.span 
                    className="block font-normal text-[2.25rem] sm:text-4xl sm:font-light md:text-4xl lg:text-5xl xl:text-6xl transition-all duration-500 mt-2 drop-shadow-[1.5px_1.5px_2px_rgba(0,0,0,0.1)]" 
                    data-speed="0.97"
                  >
                    Built for Founders.
                  </motion.span>
                </h1>
                
                <div className="h-4 sm:h-8 md:h-9 lg:h-10 w-full"></div>
                
                <motion.p 
                  className="mb-4 sm:mb-6 text-theme-primary text-center sm:text-left drop-shadow-[1px_1px_1.5px_rgba(0,0,0,0.07)]"
                  style={{
                    fontSize: "clamp(1.15rem, 2vw, 2.25rem)",
                    fontWeight: 300,
                    lineHeight: 1.4,
                    maxWidth: "100%",
                    marginBottom: "1rem",
                    paddingRight: "1rem",
                    width: "100%"
                  }}
                  data-speed="0.99"
                  initial={{ y: 15, scale: 0.97, opacity: 0.7 }}
                  animate={textControls}
                >
                  We've used vertical video to get founders and execs just like you, billions of views — in fact we're the top-performing agency in the world at doing exactly that.
                </motion.p>
              </div>
            </motion.div>
            
            {/* Animated Buttons with responsive sizes */}
            <motion.div 
              className="relative max-w-9/10 sm:w-full mt-6 sm:mt-10 md:mt-12 lg:mt-16" 
              style={{paddingLeft: 0}}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
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
            </motion.div>
            
            {/* Additional spacing div to prevent overlap on mobile only */}
            <div className="block sm:hidden w-full h-24 mt-10"></div>
          </motion.div>
        </div>
      </section>
    );
  }
);

SimpleHeroMotion.displayName = 'SimpleHeroMotion';

export default SimpleHeroMotion;