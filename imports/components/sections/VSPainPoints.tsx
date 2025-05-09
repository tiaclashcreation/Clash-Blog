import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useAnimationFrame } from "framer-motion";
import { useDeviceDetection } from '../../utils/animation-utils'; // Import device detection
import { VSHeading, VSText } from '../ui/vs-text'; // Import theme text components

// Add type definitions for the TextFadeScroll and WordFade components
type TextFadeScrollProps = {
  text: string;
  className?: string;
  wordClassName?: string;
  letterClassName?: string;
}

type WordFadeProps = {
  children: React.ReactNode;
  progress: any; // Using any for MotionValue from Motion
  range: number[];
  className?: string;
}

// TextFadeScroll component for animating text on scroll
const TextFadeScroll = ({ text, className = "", wordClassName = "", letterClassName = "" }: TextFadeScrollProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className={`relative ${className}`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <WordFade 
            key={i} 
            progress={scrollYProgress} 
            range={[start, end]}
            className={wordClassName}
          >
            {word}
          </WordFade>
        );
      })}
    </p>
  );
};

const WordFade = ({ children, progress, range, className = "" }: WordFadeProps) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className={`relative me-2 mt-2 ${className}`}>
      <span className="absolute opacity-10">{children}</span>
      <motion.span style={{ transition: "all .5s", opacity }}>{children}</motion.span>
    </span>
  );
};

// Path animation utility
const MotionPathBlob = ({ index, isMobile }: { index: number, isMobile: boolean }) => {
  const blobRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(index * 0.25);
  
  // Define blob sizes and starting positions
  const sizes = [
    { width: 8, height: 8, opacity: 0.25 },
    { width: 12, height: 12, opacity: 0.2 },
    { width: 10, height: 10, opacity: 0.15 },
    { width: 6, height: 6, opacity: 0.3 }
  ];
  
  const size = sizes[index];
  
  useAnimationFrame((time) => {
    if (isMobile || !blobRef.current) return;
    
    // Create a natural movement along the path
    setProgress((prev) => {
      const newProgress = prev + 0.0005;
      return newProgress > 1 ? 0 : newProgress;
    });
  });
  
  // Create x and y positions based on a circular path
  const x = Math.sin(progress * Math.PI * 2) * 120 + 250;
  const y = Math.cos(progress * Math.PI * 2) * 150 + 400;
  
  // Use different animation configurations for each blob
  const animationConfigs = [
    { 
      scale: [0.8, 1.2, 0.8], 
      opacity: [0.2, 0.35, 0.2],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
    { 
      scale: [1, 0.8, 1], 
      opacity: [0.15, 0.3, 0.15],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
    },
    { 
      scale: [0.9, 1.1, 0.9], 
      opacity: [0.1, 0.25, 0.1],
      transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }
    },
    { 
      scale: [1.1, 0.9, 1.1], 
      opacity: [0.25, 0.4, 0.25],
      transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }
    }
  ];
  
  const config = animationConfigs[index];
  
  return (
    <motion.div 
      ref={blobRef}
      className="floating-blob absolute rounded-full bg-theme-accent"
      style={{
        width: size.width + 'rem',
        height: size.height + 'rem',
        opacity: size.opacity,
        x,
        y
      }}
      animate={config}
    />
  );
};

// Star animation
const MotionStar = ({ index, position, isMobile }: { index: number, position: {top: string, left: string}, isMobile: boolean }) => {
  // Different rotation patterns for each star
  const rotationPatterns = [
    { rotate: [-30, 30, -30], transition: { duration: 7, repeat: Infinity, ease: "easeInOut" } },
    { rotate: [20, -20, 20], transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 } },
    { rotate: [-15, 15, -15], transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 } },
    { rotate: [10, -10, 10], transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 } }
  ];
  
  const pattern = rotationPatterns[index];
  
  return (
    <motion.div 
      className="floating-star absolute w-3 h-3 bg-theme-accent rotate-45 opacity-30"
      style={position}
      animate={pattern}
    />
  );
};

export const VSPainPoints = () => {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const { isMobile } = useDeviceDetection(); // Use the hook
  
  return (
    <div ref={sectionRef} className="painPoints relative overflow-visible pt-4 pb-8 md:pt-8 md:pb-12 bg-theme-bg-primary z-10">
      <div className="container-mobile mx-auto relative z-20">
        
        {/* Static background shapes for mobile */}
        <div className="absolute top-40 left-20 w-24 h-24 rounded-[40%] rotate-12 opacity-[var(--theme-float-opacity)] bg-[var(--theme-float-bg-primary)] -z-10"></div>
        <div className="absolute bottom-60 right-10 w-32 h-32 rounded-[30%] -rotate-6 opacity-[var(--theme-float-opacity)] bg-[var(--theme-float-bg-secondary)] -z-10"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-[35%] rotate-45 opacity-[var(--theme-float-opacity)] bg-[var(--theme-float-bg-accent)] -z-10"></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 rounded-full opacity-[var(--theme-float-opacity)] bg-[var(--theme-accent)]/10 -z-10"></div>
        
        {/* Desktop-only animated elements */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden md:block">
          {!isMobile && (
            <>
              {/* Animated floating blobs that use the improved Motion-based animation */}
              {[0, 1, 2, 3].map((index) => (
                <MotionPathBlob key={`blob-${index}`} index={index} isMobile={isMobile} />
              ))}
              
              {/* Stars with positions */}
              <MotionStar index={0} position={{top: '15%', left: '45%'}} isMobile={isMobile} />
              <MotionStar index={1} position={{top: '35%', left: '55%'}} isMobile={isMobile} />
              <MotionStar index={2} position={{top: '65%', left: '48%'}} isMobile={isMobile} />
              <MotionStar index={3} position={{top: '80%', left: '52%'}} isMobile={isMobile} />
            </>
          )}
        </div>
        
        {/* Path animation - uses Motion's SVG animation */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <svg viewBox="1345.446 -15.854 414.893 1193.282" width="100%" height="100%" 
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              ref={pathRef}
              className="stroke-theme-accent"
              strokeWidth={isMobile ? "4" : "8"}
              strokeLinecap="round"
              fill="none"
              d="M 1467.712 -4.174 C 1467.712 -4.174 1477.168 40.241 1528.79 70.654 C 1584.022 103.194 1597.939 107.628 1632.836 125.496 C 1681.091 150.204 1680.768 170.646 1679.884 200.006 C 1678.584 243.155 1654.521 254.445 1632.334 273.315 C 1596.099 304.132 1546.486 312.088 1501.697 330.741 C 1452.123 351.387 1392.137 379.289 1392.342 428.091 C 1392.641 499.442 1493.594 522.168 1493.594 522.168 C 1493.594 522.168 1583.556 544.658 1618.506 556.312 C 1656.359 568.934 1719.123 596.375 1719.605 640.99 C 1720.076 684.633 1654.42 710.914 1613.839 718.177 C 1558.072 728.157 1494.683 721.122 1447.32 752.209 C 1411.419 775.773 1361.004 795.789 1366.668 853.175 C 1373.681 924.225 1461.839 938.122 1502.568 947.526 C 1579.368 965.259 1639.148 964.298 1649.476 997.67 C 1662.115 1038.51 1582.648 1055.062 1567.258 1082.199 C 1540.529 1129.33 1549.306 1161.304 1549.306 1161.304"
              initial={isMobile ? { pathLength: 1, opacity: 0.6 } : { pathLength: 0, opacity: 1 }}
              {...(!isMobile && {
                viewport: { once: false, amount: "some" },
                animate: { pathLength: 1 },
                transition: { duration: 2, ease: "easeInOut" }
              })}
            />
          </svg>
        </div>
        
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-16 md:h-32 bg-gradient-to-b from-theme-secondary to-transparent z-10 opacity-80 md:opacity-100"></div>
        
        {/* Mobile-optimized spacing with conditional classes */}
        <div className={`component-spacing ${isMobile ? 'mt-10 mb-20' : 'mt-24 mb-60'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 md:gap-y-20 items-center">
            <div className="text-center md:text-right order-1 md:order-1">
              <motion.div
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <VSHeading size={isMobile ? "lg" : "xl"} className="pain-heading text-white font-bold">
                  If you're bored of failing content<span className="text-theme-accent text-3xl md:text-5xl">.</span>
                </VSHeading>
              </motion.div>
            </div>
          </div>
        </div>

        <div className={`component-spacing ${isMobile ? 'mb-20' : 'mb-60'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 md:gap-y-20 items-center">
            <div className="text-center md:col-start-2 md:text-left order-1 md:order-1">
              <motion.div
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <VSHeading size={isMobile ? "lg" : "xl"} className="pain-heading text-white font-bold">
                  You're sick of inconsistent freelancers<span className="text-theme-accent text-3xl md:text-5xl">.</span>
                </VSHeading>
              </motion.div>
            </div>
          </div>
        </div>

        <div className={`component-spacing ${isMobile ? 'mb-20' : 'mb-60'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 md:gap-y-20 items-center">
            <div className="text-center md:text-right order-1 md:order-1">
              <motion.div
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <VSHeading size={isMobile ? "lg" : "xl"} className="pain-heading text-white font-bold">
                  Your social team is stressed (and so are you)<span className="text-theme-accent text-3xl md:text-5xl">.</span>
                </VSHeading>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className={`component-spacing ${isMobile ? 'mb-20' : 'mb-60'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 md:gap-y-20 items-center">
            <div className="text-center md:col-start-2 md:text-left order-1 md:order-1">
              <motion.div
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <VSHeading size={isMobile ? "lg" : "xl"} className="pain-heading text-white font-bold">
                  You're struggling to keep posting every. single. day<span className="text-theme-accent text-3xl md:text-5xl">.</span>
                </VSHeading>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className={`component-spacing ${isMobile ? 'mb-20' : 'mb-60'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 md:gap-y-20 items-center">
            <div className="text-center md:text-right order-1 md:order-1">
              <motion.div
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <VSHeading size={isMobile ? "lg" : "xl"} className="pain-heading text-white font-bold">
                  You want more inbound leads<span className="text-theme-accent text-3xl md:text-5xl">.</span>
                </VSHeading>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className={`component-spacing ${isMobile ? 'mb-20' : 'mb-60'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 md:gap-y-20 items-center">
            <div className="text-center md:col-start-2 md:text-left order-1 md:order-1">
              <motion.div
                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              >
                <VSHeading size={isMobile ? "lg" : "xl"} className="pain-heading text-white font-bold">
                  And you want your content to represent YOU<span className="text-theme-accent text-3xl md:text-5xl">.</span>
                </VSHeading>
              </motion.div>
            </div>
          </div>
        </div>
        
        <div className={`component-spacing text-center ${isMobile ? 'mt-12 mb-6' : 'mt-32 mb-16'}`}>
          <motion.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            whileInView={!isMobile ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <VSHeading size={isMobile ? "lg" : "xl"} className="pain-heading text-theme-primary font-bold mb-10 md:mb-24">
              We've got the solution<span className="text-theme-accent text-3xl md:text-5xl">.</span>
            </VSHeading>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-20 md:h-32 bg-gradient-to-t from-theme-secondary to-transparent z-10 opacity-80 md:opacity-100"></div>
    </div>
  );
};

// Also export as default for lazy loading compatibility
export default VSPainPoints;