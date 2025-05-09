import React, { useRef } from 'react';
import { motion, useInView, AnimatePresence, Transition } from 'motion/react';
import { useDeviceOptimizedAnimations, useDevice, useScrollAnimation } from '../../utils/motion-utils';

/**
 * Component for fade in animation triggered by scroll/view
 */
export const FadeInView = ({ 
  children, 
  threshold = 0.2,
  delay = 0,
  duration = 0.5,
  y = 20,
  once = true,
  className = "",
  ...props 
}: React.PropsWithChildren<{
  threshold?: number;
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
  className?: string;
}> & React.HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once,
    amount: threshold 
  });
  
  const { shouldReduceMotion } = useDeviceOptimizedAnimations();
  const actualY = shouldReduceMotion ? y * 0.7 : y;
  const actualDuration = shouldReduceMotion ? duration * 0.8 : duration;
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: actualY }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: actualDuration, 
        delay,
        ease: "easeOut" 
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Component for revealing staggered children on scroll
 */
export const StaggeredReveal = ({ 
  children, 
  threshold = 0.2,
  delay = 0,
  staggerDelay = 0.08,
  once = true,
  className = "",
  as = "div",
  ...props 
}: React.PropsWithChildren<{
  threshold?: number;
  delay?: number;
  staggerDelay?: number;
  once?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}> & React.HTMLAttributes<HTMLElement>) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once,
    amount: threshold 
  });
  
  const { shouldReduceMotion } = useDeviceOptimizedAnimations();
  const actualStaggerDelay = shouldReduceMotion ? staggerDelay * 0.7 : staggerDelay;
  
  const Component = motion[as as keyof typeof motion] || motion.div;
  
  return (
    <Component
      ref={ref}
      variants={{
        hidden: {},
        visible: { 
          transition: { 
            staggerChildren: actualStaggerDelay,
            delayChildren: delay
          }
        }
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
      {...props}
    >
      {children}
    </Component>
  );
};

/**
 * Animated item to be used inside StaggeredReveal
 */
export const StaggerItem = ({
  children,
  y = 20,
  x = 0,
  className = "",
  ...props
}: React.PropsWithChildren<{
  y?: number;
  x?: number;
  className?: string;
}> & React.HTMLAttributes<HTMLDivElement>) => {
  const { shouldReduceMotion } = useDeviceOptimizedAnimations();
  const actualY = shouldReduceMotion ? y * 0.7 : y;
  const actualX = shouldReduceMotion ? x * 0.7 : x;
  
  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          y: actualY,
          x: actualX
        },
        visible: { 
          opacity: 1, 
          y: 0,
          x: 0,
          transition: {
            duration: shouldReduceMotion ? 0.4 : 0.5,
            ease: "easeOut"
          }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Component for fade transition (modal-like)
 */
export const FadeTransition = ({ 
  isVisible, 
  children,
  duration = 0.3,
  ...props
}: React.PropsWithChildren<{
  isVisible: boolean;
  duration?: number;
}> & React.HTMLAttributes<HTMLDivElement>) => {
  const { optimizeTransition } = useDeviceOptimizedAnimations();
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={optimizeTransition({ duration })}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Component for parallax scroll effect
 */
export const ParallaxScroll = ({ 
  children, 
  speed = 0.5,
  direction = "y",
  className = "",
  ...props 
}: React.PropsWithChildren<{
  speed?: number;
  direction?: "x" | "y";
  className?: string;
}> & React.HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScrollAnimation(ref);
  
  const { shouldReduceMotion } = useDeviceOptimizedAnimations();
  const actualSpeed = shouldReduceMotion ? speed * 0.5 : speed;
  
  const transformStyle = {
    [direction]: scrollYProgress.map(v => v * -actualSpeed * 100)
  };
  
  return (
    <motion.div
      ref={ref}
      style={transformStyle}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Component for float animation
 */
export const FloatingElement = ({
  children,
  amplitude = 15,
  duration = 5,
  className = "",
  ...props
}: React.PropsWithChildren<{
  amplitude?: number;
  duration?: number;
  className?: string;
}> & React.HTMLAttributes<HTMLDivElement>) => {
  const { shouldReduceMotion } = useDeviceOptimizedAnimations();
  const actualAmplitude = shouldReduceMotion ? amplitude * 0.6 : amplitude;
  const actualDuration = shouldReduceMotion ? duration * 1.2 : duration;
  
  return (
    <motion.div
      animate={{ 
        y: [0, -actualAmplitude, 0],
        transition: {
          duration: actualDuration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut"
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Component for gentle hover animation
 */
export const HoverAnimation = ({
  children,
  scale = 1.05,
  className = "",
  ...props
}: React.PropsWithChildren<{
  scale?: number;
  className?: string;
}> & React.HTMLAttributes<HTMLDivElement>) => {
  const { shouldReduceMotion } = useDeviceOptimizedAnimations();
  const actualScale = shouldReduceMotion ? 1 + ((scale - 1) * 0.7) : scale;
  
  return (
    <motion.div
      whileHover={{ scale: actualScale }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Component for scroll-triggered counter animation
 */
export const CounterAnimation = ({
  value,
  duration = 2,
  prefix = "",
  suffix = "",
  className = "",
  ...props
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const { shouldReduceMotion } = useDeviceOptimizedAnimations();
  const [displayValue, setDisplayValue] = React.useState(0);
  
  React.useEffect(() => {
    if (!isInView) return;
    
    const actualDuration = shouldReduceMotion ? duration * 0.7 : duration;
    const steps = 30;
    const stepDuration = (actualDuration * 1000) / steps;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      setDisplayValue(Math.round(value * easeProgress));
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setDisplayValue(value);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, [isInView, value, duration, shouldReduceMotion]);
  
  return (
    <div
      ref={ref}
      className={className}
      {...props}
    >
      {prefix}{displayValue.toLocaleString()}{suffix}
    </div>
  );
};

/**
 * Component for scroll-triggered progress bar
 */
export const ProgressBar = ({
  progress = 0,
  duration = 1,
  height = "8px",
  backgroundColor = "bg-gray-200",
  barColor = "bg-blue-600",
  className = "",
  ...props
}: {
  progress: number;
  duration?: number;
  height?: string;
  backgroundColor?: string;
  barColor?: string;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const { optimizeTransition } = useDeviceOptimizedAnimations();
  
  return (
    <div 
      ref={ref}
      className={`w-full ${backgroundColor} overflow-hidden ${className}`}
      style={{ height }}
      {...props}
    >
      <motion.div
        className={`h-full ${barColor}`}
        initial={{ width: 0 }}
        animate={{ width: isInView ? `${progress}%` : 0 }}
        transition={optimizeTransition({ duration })}
      />
    </div>
  );
};

/**
 * Component for text reveal line by line
 */
export const TextReveal = ({
  children,
  staggerDelay = 0.1,
  lineHeight = "leading-normal",
  className = "",
  ...props
}: React.PropsWithChildren<{
  staggerDelay?: number;
  lineHeight?: string;
  className?: string;
}> & React.HTMLAttributes<HTMLDivElement>) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const { optimizeTransition } = useDeviceOptimizedAnimations();
  
  // Split text into lines by children
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div
      ref={ref}
      className={`overflow-hidden ${className}`}
      {...props}
    >
      {childrenArray.map((child, index) => (
        <div key={index} className="overflow-hidden">
          <motion.div
            className={lineHeight}
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={optimizeTransition({
              duration: 0.6,
              delay: index * staggerDelay,
              ease: [0.33, 1, 0.68, 1] // Cubic bezier for smoother text reveal
            })}
          >
            {child}
          </motion.div>
        </div>
      ))}
    </div>
  );
};