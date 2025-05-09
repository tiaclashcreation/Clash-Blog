import React, { useEffect } from 'react';
import { motion, useAnimationControls } from 'motion/react';
import './AnimatedLogo.css';

interface AnimatedLogoProps {
  className?: string;
  onAnimationComplete?: () => void;
  skipAnimation?: boolean;
}

const AnimatedLogoMotion: React.FC<AnimatedLogoProps> = ({
  className = "",
  onAnimationComplete,
  skipAnimation = false
}) => {
  // Motion animation controls for sequenced animations
  const containerControls = useAnimationControls();
  const dashedPathControls = useAnimationControls();
  const dashLineControls = useAnimationControls();
  const lettersControls = useAnimationControls();
  const accentDropControls = useAnimationControls();
  const accentInnerControls = useAnimationControls();
  const decorativeControls = useAnimationControls();

  useEffect(() => {
    // If skipAnimation is true, make all elements immediately visible without animation
    if (skipAnimation) {
      const showAll = async () => {
        await containerControls.start({ opacity: 1, scale: 1 });
        await Promise.all([
          dashedPathControls.start({ opacity: 1, pathLength: 1 }),
          dashLineControls.start({ opacity: 1, pathLength: 1 }),
          lettersControls.start({ opacity: 1, pathLength: 1 }),
          accentDropControls.start({ opacity: 1, scale: 1 }),
          accentInnerControls.start({ opacity: 1, scale: 1 }),
          decorativeControls.start({ opacity: 0.36 })
        ]);
        if (onAnimationComplete) onAnimationComplete();
      };
      showAll();
      return;
    }

    // Animation sequence
    const animateSequence = async () => {
      // 1. Initial scale animation
      await containerControls.start({
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.5,
          ease: "backOut"
        }
      });

      // 2. Begin line animations
      dashedPathControls.start({
        opacity: 1,
        pathLength: 1,
        transition: {
          opacity: { duration: 0.05 },
          pathLength: { duration: 0.6, ease: "easeInOut" },
          staggerChildren: 0.03
        }
      });

      // Short delay before diagonal line
      await new Promise(resolve => setTimeout(resolve, 200));

      // 3. Diagonal line animation
      dashLineControls.start({
        opacity: 1,
        pathLength: 1,
        transition: {
          opacity: { duration: 0.05 },
          pathLength: { duration: 0.5, ease: "easeOut" }
        }
      });

      // Short delay before letters
      await new Promise(resolve => setTimeout(resolve, 100));

      // 4. VS letters animation
      await lettersControls.start({
        opacity: 1,
        pathLength: 1,
        transition: {
          opacity: { duration: 0.05 },
          pathLength: { duration: 0.4, ease: "easeInOut" },
          staggerChildren: 0.1
        }
      });

      // 5. Letters pulse effect
      lettersControls.start({
        scale: [1, 1.06, 1],
        filter: ["brightness(1)", "brightness(1.4)", "brightness(1)"],
        transition: {
          duration: 0.5,
          ease: "easeInOut"
        }
      });

      // 6. Accent drop animation
      accentDropControls.start({
        opacity: 1,
        scale: 1.1,
        transition: {
          duration: 0.4,
          ease: "backOut"
        }
      });

      // Short delay for inner circle
      await new Promise(resolve => setTimeout(resolve, 150));

      // 7. Inner circle animation
      accentInnerControls.start({
        opacity: 1,
        scale: 1.15,
        transition: {
          duration: 0.3,
          ease: "backOut"
        }
      });

      // 8. Drop wiggle animation
      accentDropControls.start({
        rotate: [0, 5, 0, -3, 0],
        transition: {
          duration: 0.6,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1]
        }
      });

      // 9. Decorative elements fade in
      decorativeControls.start({
        opacity: 0.36,
        transition: {
          duration: 0.4,
          delay: 0.1
        }
      });

      // Call onAnimationComplete if provided
      if (onAnimationComplete) {
        // Small delay to ensure all animations have completed
        setTimeout(onAnimationComplete, 500);
      }
    };

    animateSequence();
  }, [
    containerControls, 
    dashedPathControls, 
    dashLineControls, 
    lettersControls, 
    accentDropControls, 
    accentInnerControls, 
    decorativeControls, 
    onAnimationComplete, 
    skipAnimation
  ]);

  return (
    <div className={`relative ${className}`}>
      <motion.svg 
        width="1340" 
        height="1780" 
        viewBox="0 0 670 890" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full -z-20 h-auto"
        initial={{ scale: 1.25, opacity: 0 }}
        animate={containerControls}
      >
        {/* Outer dashed lines */}
        <motion.path 
          className="dashed-path text-theme-accent vs-logo-clip"
          d="M68.1099 725.193C68.1841 725.459 68.46 725.614 68.726 725.54L73.0612 724.33C73.3272 724.256 73.4827 723.98 73.4084 723.714C73.3342 723.448 73.0584 723.293 72.7924 723.367L68.9389 724.442L67.8639 720.59C67.7896 720.324 67.5138 720.169 67.2478 720.243C66.9818 720.318 66.8263 720.593 66.9005 720.859L68.1099 725.193ZM459.207 33.0228C459.133 32.7569 458.857 32.6015 458.591 32.6757L454.256 33.8856C453.99 33.9598 453.835 34.2356 453.909 34.5015C453.983 34.7675 454.259 34.9229 454.525 34.8486L458.378 33.7732L459.453 37.6252C459.528 37.8912 459.803 38.0466 460.069 37.9723C460.335 37.8981 460.491 37.6223 460.417 37.3564L459.207 33.0228Z"
          fill="[var(--secondary-200)]"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={dashedPathControls}
        />
        
        <motion.path
          className="dashed-path text-theme-accent vs-logo-clip"
          d="M216.918 120.271C217.113 120.076 217.113 119.759 216.918 119.564L213.736 116.382C213.541 116.187 213.224 116.187 213.029 116.382C212.834 116.577 212.834 116.894 213.029 117.089L215.857 119.917L213.029 122.746C212.834 122.941 212.834 123.258 213.029 123.453C213.224 123.648 213.541 123.648 213.736 123.453L216.918 120.271ZM216.564 119.417H214.575V120.417H216.564V119.417ZM206.618 119.417H202.639V120.417H206.618V119.417ZM194.682 119.417H190.703V120.417H194.682V119.417Z"
          fill="[var(--secondary-200)]"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={dashedPathControls}
        />
        
        <motion.path 
          className="dashed-path text-theme-accent vs-logo-clip opacity-30"
          d="M112.906 73.1757C112.711 72.9805 112.394 72.9805 112.199 73.1757L109.017 76.3577C108.821 76.553 108.821 76.8696 109.017 77.0648C109.212 77.2601 109.529 77.2601 109.724 77.0648L112.552 74.2364L115.381 77.0648C115.576 77.2601 115.893 77.2601 116.088 77.0648C116.283 76.8696 116.283 76.553 116.088 76.3577L112.906 73.1757ZM112.052 73.5293L112.052 75.4706L113.052 75.4706L113.052 73.5293L112.052 73.5293Z"
          fill="[var(--secondary-200)]"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={dashedPathControls}
        />
        
        <motion.path
          className="dashed-path vs-logo-clip text-theme-accent max-sm:hidden sm:visible sm:opacity-40 md:opacity-50 lg:opacity 80"
          d="M157.082 625.887C156.887 626.082 156.887 626.399 157.082 626.594L160.264 629.776C160.459 629.971 160.776 629.971 160.971 629.776C161.167 629.581 161.167 629.264 160.971 629.069L158.143 626.24L160.971 623.412C161.167 623.217 161.167 622.9 160.971 622.705C160.776 622.509 160.459 622.509 160.264 622.705L157.082 625.887ZM550.214 625.74H548.168V626.74H550.214V625.74ZM539.985 625.74H535.894V626.74H539.985V625.74Z"
          fill="theme-accent-secondary"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={dashedPathControls}
        />
        
        {/* The main diagonal line */}
        <motion.path 
          className="dash-line vs-logo-clip"
          d="M153.28 574.277L161.155 572.075L158.96 564.223L151.084 566.426L153.28 574.277ZM392.914 150.134L382.96 156.016L393.03 161.665L392.914 150.134ZM156.992 569.739L275.389 360.181L273.645 359.203L155.248 568.761L156.992 569.739ZM275.389 360.181L389.359 158.459L387.615 157.481L273.645 359.203L275.389 360.181Z"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={dashLineControls}
        />
        
        {/* VS letters */}
        <motion.path 
          className="vs-logo-clip"
          d="M121.401 143.415L154.636 231.936L138.756 231.936L113.852 159.161L113.504 159.161L88.5132 231.936L72.807 231.936L105.955 143.415L121.401 143.415Z"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={lettersControls}
        />
        
        <motion.path
          className="vs-logo-clip"
          d="M381.518 541.306C307.247 541.306 251.322 505.281 296.463 476.261L246.845 465.156H263.259L313.091 476.261C267.949 496.833 317.266 526.945 381.305 526.945C419.462 526.945 445.469 508.15 445.469 480.907V480.696C445.469 457.254 431.613 445.217 396.013 436.98L365.104 429.8C322.896 420.086 303.498 402.98 303.498 374.259V374.047C303.498 339.202 335.047 314.493 378.96 314.493C424.365 314.493 453.995 340.469 458.472 379.538L458.685 381.439H442.697L442.484 379.961C438.221 349.128 414.346 328.854 378.96 328.854C344.426 328.854 320.125 347.649 320.125 373.836V374.047C320.125 394.955 334.407 407.203 370.007 415.44L400.916 422.62C444.403 432.757 462.309 449.44 462.309 479.851V480.062C462.309 516.175 428.628 541.306 381.518 541.306Z"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={lettersControls}
        />
        
        <motion.path
          className="large-v vs-logo-clip"
          d="M174.184 413.911L148.29 243.681L169.631 248.121L189.125 394.987L189.582 395.082L278.461 232.313L299.497 236.689L195.677 418.382L174.184 413.911Z"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={lettersControls}
        />
        
        {/* Accent elements */}
        <motion.path
          className="accent-drop"
          d="M285.875 437.104C285.875 428.366 293.235 421.327 302.371 421.327C311.507 421.327 318.867 428.366 318.867 437.104C318.867 450.833 307.87 464.998 302.371 476.113C296.873 466.483 285.875 450.833 285.875 437.104Z"
          fill="#DE6B5950"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={accentDropControls}
        />
        
        <motion.path 
          className="accent-inner"
          d="M294.124 437.763C294.124 433.211 297.803 429.545 302.371 429.545C306.939 429.545 310.619 433.211 310.619 437.763C310.619 442.314 306.939 445.981 302.371 445.981C297.803 445.981 294.124 442.314 294.124 437.763Z" 
          fill="#FDEBDD"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={accentInnerControls}
        />
        
        {/* Decorative elements */}
        <motion.g 
          className="max-sm:hidden sm:visible sm:opacity-40 md:opacity-50 lg:opacity 80 vs-logo-clip"
          initial={{ opacity: 0 }}
          animate={decorativeControls}
        >
          {/* Triangle overlay */}
          <path 
            className="triangle-overlay" 
            opacity="0.36" 
            d="M540.516 712.655V729.829L320.119 635.649V617.922L540.516 523.742V540.916L337.072 626.785V627.339L540.516 712.655Z"
            fill="#2B6F7A" 
          />
            
          {/* Frame overlay */}
          <path 
            className="frame-overlay" 
            opacity="0.41" 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M28.1025 771.806C28.1025 774.506 28.6956 777.075 29.7648 779.402L29.5527 779.49C28.6166 777.11 28.1025 774.518 28.1025 771.806ZM49.1025 792.806H55.5687V792.306V791.306V790.806H48.1025C45.5168 790.806 43.0458 790.34 40.7773 789.491L40.6383 789.826L40.2552 790.75L40.2182 790.839C42.6316 791.968 45.295 792.651 48.1025 792.782C48.4339 792.798 48.7673 792.806 49.1025 792.806ZM70.501 790.806V791.306V792.306V792.806H85.4333V792.306V791.306V790.806H70.501Z"
            fill="#2B6F7A" 
          />
        </motion.g>
        
        {/* Text elements */}
        <motion.g 
          className="text-elements"
          initial={{ opacity: 0 }}
          animate={decorativeControls}
        >
          <g className="text-bottom">
            <path d="M418.496 814.876V806.636H416.192V805.932C417.045 805.89 417.658 805.73 418.032 805.452C418.416 805.164 418.656 804.631 418.752 803.852H419.536V814.876H418.496ZM425.57 814.204C426.551 814.204 427.293 813.783 427.794 812.94C428.295 812.098 428.546 810.914 428.546 809.388C428.546 807.895 428.285 806.716 427.762 805.852C427.25 804.988 426.519 804.556 425.57 804.556C424.61 804.556 423.869 804.983 423.346 805.836C422.834 806.679 422.578 807.863 422.578 809.388C422.578 810.882 422.834 812.06 423.346 812.924C423.869 813.778 424.61 814.204 425.57 814.204Z"
              fill="#2B6F7A60" 
              className="vs-logo-clip" 
            />
          </g>
          
          <g className="text-right">
            <path d="M595.246 709.788C593.838 707.623 593.134 705.207 593.134 702.54C593.134 700.097 593.838 697.863 595.246 695.836H595.982C594.68 697.905 594.03 700.14 594.03 702.54C594.03 705.228 594.68 707.644 595.982 709.788H595.246ZM599.061 707.9V699.484H596.821V698.924C597.728 698.871 598.341 698.716 598.661 698.46C598.981 698.204 599.189 697.676 599.285 696.876H599.877V707.9H599.061Z" 
              fill="#2B6F7A65" 
              className="vs-logo-clip" 
            />
          </g>
          
          <g className="text-right-2">
            <path d="M490.345 815.419C488.884 813.158 488.153 810.742 488.153 808.171C488.153 805.782 488.884 803.547 490.345 801.467H491.209C489.929 803.569 489.289 805.803 489.289 808.171C489.289 810.806 489.929 813.222 491.209 815.419H490.345Z" 
              fill="#2B6F7A60" 
              className="vs-logo-clip" 
            />
          </g>
          
          <g className="text-bottom-2">
            <path d="M593.39 679.649L593.39 671.409H591.086L591.086 670.705C591.939 670.662 592.553 670.502 592.926 670.225C593.31 669.937 593.55 669.404 593.646 668.625H594.43L594.43 679.649H593.39Z" 
              fill="#2B6F7A65" 
              className="vs-logo-clip" 
            />
          </g>
        </motion.g>
      </motion.svg>
    </div>
  );
};

export default AnimatedLogoMotion;