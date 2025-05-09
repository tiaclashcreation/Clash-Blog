import React from 'react';
import { motion } from 'framer-motion';

interface VsBadgeProps {
  className?: string;
}

const VsBadge = React.forwardRef<HTMLDivElement, VsBadgeProps>(
  ({ className = '' }, ref) => {
    return (
      <motion.div 
        ref={ref}
        className={`award-badge absolute bottom-6 right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 z-50 ${className}`}
        initial={{ opacity: 0, y: -20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 400,
          damping: 15,
          delay: 0.3
        }}
      >
        <div className="group relative overflow-hidden rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] cursor-pointer hover:shadow-[0_15px_50px_rgba(0,0,0,0.25)] transition-all duration-500">
          {/* Animated gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-accent-coral)] via-[var(--theme-primary)] to-[var(--theme-accent-secondary)] opacity-90 animate-gradient-slow"></div>
          
          {/* Main badge container */}
          <div className="relative flex items-center gap-3 py-2 px-4 md:py-3 md:px-5 rounded-full border border-white/20 backdrop-blur-sm">
            {/* Award icon */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-white/30 blur-md"></div>
              <div className="relative bg-white/20 rounded-full p-1.5 md:p-2 border border-white/30">
                <svg width="22" height="22" viewBox="0 0 370 370" fill="currentColor"
                    className="text-white drop-shadow-sm w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6">
                  <path d="M341.67 314.41s-41.07-70.59-48.44-83.25c8.38-2.56 17.31-4.82 21.02-11.22 6.18-10.67-4.82-28.18-1.93-39.63 2.98-11.78 20.55-21.96 20.55-33.93 0-11.66-18.17-25.28-21.15-36.99-2.91-11.44 8.06-28.97 1.86-39.63-6.2-10.66-26.86-9.79-35.37-17.97-8.75-8.42-8.72-29.03-19.28-34.67-10.6-5.67-27.82 5.78-39.59 3.07C207.71 17.52 197.32 0 185.17 0c-12.33 0-31.94 19.87-35.02 20.58-11.76 2.73-29.01-8.69-39.59-3-10.55 5.66-10.48 26.27-19.22 34.71-8.49 8.2-29.15 7.36-35.34 18.04-6.18 10.67 4.82 28.18 1.93 39.63-2.9 11.48-21.08 23.1-21.08 36.38 0 11.97 17.62 22.13 20.61 33.9 2.91 11.44-8.06 28.97-1.86 39.63 3.38 5.8 11.04 8.19 18.69 10.48.89.27 2.58 1.27 1.44 2.93-5.24 9.04-47.37 81.76-47.37 81.76-3.35 5.78-.63 10.74 6.05 11.02l32.68 1.36c6.68.28 15.05 5.13 18.62 10.79l17.44 27.67c3.56 5.65 9.22 5.55 12.57-.24 0 0 48.8-84.25 48.82-84.27.98-1.14 1.96-.91 2.43-.51 5.34 4.55 12.78 9.08 18.99 9.08 6.09 0 11.73-4.27 17.31-9.03.45-.39 1.56-1.18 2.37.47.01.03 48.76 83.81 48.76 83.81 3.36 5.78 9.02 5.87 12.57.21l17.39-27.71c3.55-5.66 11.92-10.53 18.6-10.82l32.68-1.42c6.67-.3 9.39-5.26 6.03-5.26z"></path>
                  <path d="M230.92 66.1l-.45-.25c-27.46-15.9-62.46-17.06-91.8 0-43.53 25.33-58.35 81.35-33.02 124.88 7.73 13.28 18.32 23.89 30.54 31.5 1.04.66 2.09 1.3 3.16 1.93 43.58 25.25 99.57 10.33 124.81-33.24 25.25-43.58 10.34-99.57-33.24-124.81zm10.9 71.24-15.26 14.87c-4.73 4.61-7.68 13.7-6.56 20.2l3.6 21c1.12 6.51-2.75 9.31-8.59 6.24l-18.86-9.92c-5.84-3.07-15.4-3.07-21.24 0l-18.86 9.92c-5.84 3.07-9.71.26-8.59-6.24l3.6-21c1.12-6.5-1.84-15.6-6.56-20.2l-15.26-14.87c-4.73-4.61-3.25-9.15 3.28-10.1l21.09-3.06c6.53-.95 14.27-6.57 17.19-12.49l9.43-19.11c2.92-5.92 7.7-5.92 10.62 0l9.43 19.11c2.92 5.92 10.65 11.54 17.19 12.49l21.09 3.06c6.53.95 8 5.49 3.28 10.1z"></path>
                </svg>
              </div>
            </div>

            {/* Badge content */}
            <div className="text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.2)]">
              <div className="flex h-max items-baseline gap-1">
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold">#1</span>
                <div className="flex flex-col">
                  <span className="text-xs md:text-sm lg:text-base font-semibold whitespace-nowrap">
                    Short Form Agency
                  </span>
                  <span className="text-[10px] md:text-xs font-light italic">
                    (we're deadly serious)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shine effect animation */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-out"></div>
        </div>
      </motion.div>
    );
  }
);

VsBadge.displayName = 'VsBadge';

export default VsBadge;