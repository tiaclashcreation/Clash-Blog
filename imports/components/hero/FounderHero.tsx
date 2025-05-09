import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, AnimatePresence, animate } from 'framer-motion';

// Import components for modal functionality
import ContactModal from '../modals/ContactModal';
import { AnimatedButton } from '../marble-buttons/AnimatedButton';

// Stats Counter Component
const StatsCounter = ({ value, label, delay = 0 }: { value: number, label: string, delay?: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  
  useEffect(() => {
    const animation = animate(count, value, { 
      duration: 2.5, 
      delay,
      ease: [0.2, 0.65, 0.3, 0.9]
    });
    return animation.stop;
  }, [count, value, delay]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: delay + 0.2 }}
      className="flex flex-col items-center"
    >
      <div className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent vs-text-gradient-hero-red">
        <motion.span>{rounded}</motion.span>
        {value === 995 && <span>£</span>}
        {value === 10 && <span>x</span>}
        {value === 80 && <span>%</span>}
      </div>
      <span className="text-sm font-medium text-theme-primary/80 mt-1">{label}</span>
    </motion.div>
  );
};

// Interactive Building Block Component
const BuildingBlock = ({ 
  color,
  label,
  index,
  total,
  onHover
}: { 
  color: string;
  label: string;
  index: number;
  total: number;
  onHover: (index: number) => void;
}) => {
  const controls = useAnimation();
  
  const baseDelay = (index / total) * 0.8;
  
  // Initialize the animation when component mounts
  useEffect(() => {
    controls.start({ 
      scale: 1, 
      opacity: 1, 
      rotateZ: 0, 
      y: 0 
    });
  }, [controls]);
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotateZ: -15, y: 40 }}
      animate={controls}
      transition={{ 
        duration: 0.7, 
        delay: baseDelay + 0.2,
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      whileHover={{ 
        scale: 1.08, 
        rotate: 0,
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
      }}
      className={`${color} rounded-xl cursor-pointer p-2 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-center shadow-lg transform`}
      onHoverStart={() => {
        controls.start({ scale: 1.1 });
        onHover(index);
      }}
      onHoverEnd={() => {
        controls.start({ scale: 1 });
      }}
    >
      <span className="text-white font-medium text-sm sm:text-base">{label}</span>
    </motion.div>
  );
};

// Particle animation for dynamic background
const Particles = () => {
  const particleCount = 20;
  const particles = Array.from({ length: particleCount });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const size = Math.random() * 20 + 5;
        const opacity = Math.random() * 0.15 + 0.05;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-theme-accent"
            style={{
              width: size,
              height: size,
              opacity,
              left: `${initialX}%`,
              top: `${initialY}%`,
            }}
            animate={{
              x: [0, Math.random() * 300 - 150],
              y: [0, Math.random() * 200 - 100],
              opacity: [opacity, opacity/2, opacity],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

// Main FounderHero component
interface FounderHeroProps {
  onCtaClick?: () => void;
}

const FounderHero = React.forwardRef<HTMLDivElement, FounderHeroProps>(
  ({ onCtaClick }, ref) => {
    // State
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    
    // Descriptions for each building block
    const blockDescriptions = [
      "Learn the core principles of vertical video that engage viewers",
      "Build a consistent content strategy that aligns with your goals",
      "Grow your audience with proven optimization techniques",
      "Plan content efficiently to maximize your time investment",
      "Create compelling videos with basic equipment you already have",
      "Launch with confidence using our tested templates",
      "Measure performance to understand what works for your audience",
      "Adapt your approach based on real-world feedback",
      "Scale your video presence to drive meaningful growth"
    ];
    
    // Building blocks data
    const blocks = [
      { label: "Learn", color: "vs-btn-vibrant-gradient" },
      { label: "Build", color: "vs-btn-secondary-gradient" },
      { label: "Grow", color: "vs-btn-destructive-gradient" },
      { label: "Plan", color: "vs-btn-secondary-gradient" },
      { label: "Create", color: "vs-btn-destructive-gradient" },
      { label: "Launch", color: "vs-btn-vibrant-gradient" },
      { label: "Measure", color: "vs-btn-destructive-gradient" },
      { label: "Adapt", color: "vs-btn-vibrant-gradient" },
      { label: "Scale", color: "vs-btn-secondary-gradient" }
    ];
    
    // Statistics data
    const stats = [
      { value: 80, label: 'Success Rate' },
      { value: 995, label: 'One-time Cost' },
      { value: 10, label: 'Avg. ROI' }
    ];
    
    // Animations
    const headerControls = useAnimation();
    const titleControls = useAnimation();
    
    // Initialize animations after mount
    useEffect(() => {
      const sequence = async () => {
        // Staggered animation sequence
        await titleControls.start({ 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.8, ease: [0.23, 0.86, 0.39, 0.96] }
        });
        
        await headerControls.start({
          opacity: 1, 
          y: 0,
          transition: { duration: 0.7, ease: [0.23, 0.86, 0.39, 0.96] }
        });
        
        setIsMounted(true);
      };
      
      sequence();
    }, [headerControls, titleControls]);
    
    // Handle modal
    const handleContactModalClick = () => {
      document.body.style.overflow = 'hidden';
      setIsContactModalOpen(true);
    };
    
    const handleCloseModal = () => {
      document.body.style.overflow = '';
      setIsContactModalOpen(false);
    };

    return (
      <section
        ref={ref}
        className="relative overflow-hidden min-h-screen w-full pt-16 bg-gradient-to-b from-theme-surface to-theme-surface-alt"
      >
        {/* Contact Modal */}
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={handleCloseModal}
        />
        
        {/* Animated particles background */}
        <Particles />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-theme-accent/5 via-transparent to-transparent opacity-70" />
        
        <div className="container mx-auto px-4 h-full flex flex-col">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between h-full pt-10 pb-12 md:pb-0 gap-8 md:gap-4">
            {/* Left column: Interactive Building Blocks */}
            <div className="w-full md:w-1/2 h-[400px] md:h-[600px] relative flex items-center justify-center">
              {/* 3D Grid of building blocks */}
              <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px]">
                {/* Grid layout with 3x3 blocks in a pleasing arrangement */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 relative perspective-[1000px] transform-gpu">
                  {blocks.map((block, i) => (
                    <BuildingBlock
                      key={i}
                      color={block.color}
                      label={block.label}
                      index={i}
                      total={blocks.length}
                      onHover={setActiveBlockIndex}
                    />
                  ))}
                </div>
                
                {/* Description popup when hovering */}
                <AnimatePresence>
                  {activeBlockIndex !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-6 bg-theme-surface-alt rounded-xl p-4 shadow-lg border border-theme-border/20 max-w-[300px] z-10"
                    >
                      <p className="text-theme-primary text-sm">
                        {blockDescriptions[activeBlockIndex]}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            {/* Right column: Content */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center bg-theme-accent/10 border border-theme-accent/20 rounded-full px-4 py-1 mb-6"
              >
                <span className="h-2 w-2 rounded-full bg-theme-accent mr-2"></span>
                <span className="text-sm font-medium text-theme-accent">Founder Edition</span>
              </motion.div>
              
              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={titleControls}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight"
              >
                <span className="block text-theme-primary">Build Your Video</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-theme-accent to-theme-accent-tertiary">
                  Presence Today
                </span>
              </motion.h1>
              
              {/* Subheading */}
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                animate={headerControls}
                className="text-lg md:text-xl text-theme-secondary max-w-xl mb-8"
              >
                Start creating high-impact vertical videos without a production team. 
                The essential building blocks to help founders like you stand out.
              </motion.p>
              
              {/* Stats row */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex justify-center md:justify-start space-x-8 sm:space-x-12 mb-8"
              >
                {stats.map((stat, index) => (
                  <StatsCounter
                    key={index}
                    value={stat.value}
                    label={stat.label}
                    delay={0.8 + index * 0.2}
                  />
                ))}
              </motion.div>
              
              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <AnimatedButton
                  text="Get Started £995"
                  variant="start"
                  disabled={false}
                  saturation="normal"
                  size="lg"
                  onClick={onCtaClick}
                  className="w-full sm:w-auto text-nowrap drop-shadow-lg vs-btn-vibrant-gradient shadow-theme-btn-primary hover:vs-btn-destructive-gradient shadow-theme-btn-secondary text-base font-medium"
                />
                
                <AnimatedButton
                  text="Learn More"
                  variant="docs"
                  saturation="normal"
                  size="lg"
                  onClick={handleContactModalClick}
                  className="w-full sm:w-auto text-nowrap drop-shadow-md shadow-theme-btn-secondary text-base font-medium hover:underline"
                />
              </motion.div>
              
              {/* Additional info */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.5 }}
                className="text-xs text-theme-secondary mt-4 max-w-md mx-auto md:mx-0"
              >
                Applied to your upcoming cohort purchase. Get started today and upgrade later.
              </motion.p>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-[50px] md:h-[70px]"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-theme-surface"
            ></path>
          </svg>
        </div>
      </section>
    );
  }
);

FounderHero.displayName = 'FounderHero';

export default FounderHero; 