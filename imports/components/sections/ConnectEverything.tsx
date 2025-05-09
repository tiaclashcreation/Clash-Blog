import React, { useRef, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { appIconImages } from "@/utils/importImages";

interface ConnectEverythingProps {
  className?: string;
  id?: string;
}

export const ConnectEverything: React.FC<ConnectEverythingProps> = ({ className = "", id = 'connect-everything' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Resolve icons via appIconImages with graceful fallback
  const resolveIcon = (key: string): string => {
    return (appIconImages[key as keyof typeof appIconImages] as string) ?? '';
  };

  const appIcons = {
    creatorHud: resolveIcon('Hud'),
    scranAr: resolveIcon('Scran-ar'),
    spitt: resolveIcon('Scranar-prPRO extension'),
  };

  // Check if any required images are missing
  const missingImages = Object.entries(appIcons).filter(([, value]) => !value);
  if (missingImages.length > 0) {
    console.warn('Missing required images:', missingImages.map(([key]) => key));
  }

  // Simplified GSAP animations to reduce lag
  // Set up click handlers for tool cards
  useEffect(() => {
    // Get all tool cards and details sections
    const toolCards = document.querySelectorAll('.tool-card');
    
    // Add click event to each card
    toolCards.forEach(card => {
      const details = card.querySelector('.tool-details');
      const closeBtn = card.querySelector('.close-details');
      
      // Toggle details visibility when card is clicked
      card.addEventListener('click', () => {
        if (details) {
          // If already visible, hide it
          if (!details.classList.contains('hidden')) {
            gsap.to(details, {
              opacity: 0,
              y: 10,
              duration: 0.2,
              ease: "power2.in",
              onComplete: () => details.classList.add('hidden')
            });
          } else {
            // Show the details
            details.classList.remove('hidden');
            gsap.fromTo(details,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" }
            );
          }
        }
      });
      
      // Close details when close button is clicked
      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent triggering card click
          if (details) {
            gsap.to(details, {
              opacity: 0,
              y: 10,
              duration: 0.2,
              ease: "power2.in",
              onComplete: () => details.classList.add('hidden')
            });
          }
        });
      }
    });
    
    // Cleanup event listeners on unmount
    return () => {
      toolCards.forEach(card => {
        card.replaceWith(card.cloneNode(true));
      });
    };
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Only do minimal icon animations
      gsap.utils.toArray<Element>('.app-icon').forEach((icon, index) => {
        // Simple floating animation
        gsap.to(icon, {
          y: -10,
          duration: 2 + index * 0.3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });

        // Simple hover effect with reduced motion preference check
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          icon.addEventListener('mouseenter', () => {
            gsap.to(icon, {
              scale: 1.05,
              duration: 0.3
            });
          });

          icon.addEventListener('mouseleave', () => {
            gsap.to(icon, {
              scale: 1,
              duration: 0.3
            });
          });
        }
      });

      // Simplified glow effect with reduced motion check
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.utils.toArray<Element>('.app-icon-glow').forEach((glow, i) => {
          gsap.to(glow, {
            opacity: 0.6,
            scale: 1.1,
            duration: 2,
            repeat: -1,
            yoyo: true,
            delay: i * 0.5
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`w-full md:max-w-7xl lg:max-w-full px-2 md:px-4 lg:px-6 xl:px-8 pt-12 md:pt-16 lg:pt-24 pb-0 bg-[var(--theme-bg-primary)] dark:bg-[var(--theme-bg-primary)] flex flex-col justify-center items-center gap-12 md:gap-16 lg:gap-24 overflow-hidden relative ${className}`}
    >
      {/* Theme-aware floating elements */}
      <div className="absolute top-20 left-5 w-16 h-16 rounded-[40%] rotate-12 opacity-[var(--theme-float-opacity)] 
                    bg-[var(--theme-float-bg-primary)]
                    animate-float-slow"></div>
      <div className="absolute bottom-40 right-10 w-24 h-24 rounded-[30%] -rotate-6 opacity-[var(--theme-float-opacity)] 
                    bg-[var(--theme-float-bg-secondary)]
                    animate-float-medium"></div>
      <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-[35%] rotate-45 opacity-[var(--theme-float-opacity)] 
                    bg-[var(--theme-float-bg-accent)]
                    animate-float-fast"></div>
                      
      <div className="flex flex-col justify-center items-center gap-6 md:gap-8 lg:gap-12 w-full max-w-5xl relative z-10">
        <div className="text-center">
          <span className="text-[var(--theme-text-primary)] text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold">Connect </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-[var(--theme-accent)] to-[var(--theme-accent-secondary)] text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold">Everything</span>
        </div>
        <div className="text-center text-[var(--theme-text-primary)] text-lg md:text-xl lg:text-2xl">
          <span className="text-[var(--theme-accent-secondary)] font-semibold">The first problem with content creation</span> is knowing what content to make (and how to make it) - which of course, our course solves.
        </div>
        <div className="text-center text-[var(--theme-text-primary)] text-lg md:text-xl lg:text-2xl">
          <span className="text-[var(--theme-accent-secondary)] font-semibold">The second problem with content creation</span> is managing to keep your content going out, every single. day. for years. In an efficient way that doesn't drain your team's energy, and your bank account.
        </div>
        <div className="text-center text-[var(--theme-text-primary)] text-lg md:text-xl lg:text-2xl">
          It was the main problem we've struggled with an agency. So we solved it.
        </div>
        <div className="text-center text-[var(--theme-text-primary)] text-lg md:text-xl lg:text-2xl">
          The Vertical Shortcut includes our <span className="font-semibold">custom in house-solution</span>: the utilities, apps and extensions, needed to run an efficient content machine. These tools made our team 4x more efficient, and increased the quality of our output too.
        </div>
        <div className="text-center text-[var(--theme-accent)] text-xl md:text-2xl font-semibold">
          And you're getting them all for free.
        </div>
      </div>
      
      {/* Horizontal tools section with expandable details */}
      <div className="w-full max-w-5xl flex flex-col justify-center items-center gap-8 md:gap-12 relative z-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Creator HUD */}
          <div className="tool-card flex flex-col items-center bg-[var(--theme-surface)]/20 backdrop-blur-sm rounded-xl p-6 shadow-[var(--theme-shadow-sm)] hover:shadow-[var(--theme-shadow-xl)] hover:scale-[1.02] transition-all duration-300 cursor-pointer group hover:bg-[var(--theme-surface)]/40 relative">
            {/* Outer glow effect that appears on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
              <div className="absolute inset-[-20px] bg-[var(--theme-accent-secondary)]/20 blur-2xl"></div>
            </div>
            <div className="relative flex items-center justify-center w-36 h-36 md:w-40 md:h-40">
              <div className="absolute inset-0 bg-[var(--theme-radial-glow)] opacity-50 blur-md rounded-full group-hover:opacity-80 group-hover:blur-xl group-hover:scale-125 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-[var(--theme-accent-secondary)]/30 rounded-full opacity-0 group-hover:opacity-60 group-hover:blur-xl group-hover:scale-150 animate-pulse transition-all duration-500"></div>
              <img className="app-icon w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-xl relative z-10 transition-transform duration-300 group-hover:scale-110" src={appIcons.creatorHud} alt="Creator HUD" />
            </div>
            <h3 className="text-[var(--theme-accent-secondary)] text-2xl md:text-3xl font-normal mt-4 mb-1 text-center group-hover:scale-105 transition-transform duration-300 relative z-10">Creator HUD</h3>
            <p className="text-[var(--theme-text-primary)] text-base md:text-lg mb-2 text-center relative z-10">for Notion</p>
            <span className="text-[var(--theme-accent)] text-sm font-medium mt-2 opacity-80 group-hover:opacity-100 group-hover:font-semibold transition-all duration-300 px-3 py-1 rounded-full group-hover:bg-[var(--theme-accent)]/20 group-hover:shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.4)] relative z-10">Click for details</span>
            
            {/* Enhanced popup that appears over the card */}
            <div className="tool-details hidden absolute top-0 left-0 right-0 bottom-0 bg-[var(--theme-bg-primary)] dark:bg-[var(--theme-bg-primary)] rounded-xl p-6 z-20 overflow-auto shadow-lg border border-gray-100/30 dark:border-gray-800/30">
              <button className="close-details absolute top-3 right-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-1.5 rounded-full text-gray-500 dark:text-gray-300 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="mb-4">
                <h3 className="text-[var(--theme-accent-secondary)] text-xl font-semibold">Creator HUD</h3>
              </div>
              
              <p className="text-[var(--theme-text-primary)] text-sm mb-3 leading-relaxed">
                A custom Notion Template that works with Premiere Pro to <strong>remove ALL manual effort</strong> after filming.
              </p>
              <p className="text-[var(--theme-text-primary)] text-sm leading-relaxed">
                It matches videos to scripts and creates editable timelines automatically.
              </p>
            </div>
          </div>
          
          {/* Scran.ar */}
          <div className="tool-card flex flex-col items-center bg-[var(--theme-surface)]/20 backdrop-blur-sm rounded-xl p-6 shadow-[var(--theme-shadow-sm)] hover:shadow-[var(--theme-shadow-xl)] hover:scale-[1.02] transition-all duration-300 cursor-pointer group hover:bg-[var(--theme-surface)]/40 relative">
            {/* Outer glow effect that appears on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
              <div className="absolute inset-[-20px] bg-[var(--theme-accent-secondary)]/20 blur-2xl"></div>
            </div>
            <div className="relative flex items-center justify-center w-36 h-36 md:w-40 md:h-40">
              <div className="absolute inset-0 bg-[var(--theme-radial-glow)] opacity-50 blur-md rounded-full group-hover:opacity-80 group-hover:blur-xl group-hover:scale-125 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-[var(--theme-accent-secondary)]/30 rounded-full opacity-0 group-hover:opacity-60 group-hover:blur-xl group-hover:scale-150 animate-pulse transition-all duration-500"></div>
              <img className="app-icon w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-xl relative z-10 transition-transform duration-300 group-hover:scale-110" src={appIcons.scranAr} alt="Scran.ar" />
            </div>
            <h3 className="text-[var(--theme-accent-secondary)] text-2xl md:text-3xl font-normal mt-4 mb-1 text-center group-hover:scale-105 transition-transform duration-300 relative z-10">Scran.ar</h3>
            <p className="text-[var(--theme-text-primary)] text-base md:text-lg mb-2 text-center relative z-10">(beta)</p>
            <span className="text-[var(--theme-accent)] text-sm font-medium mt-2 opacity-80 group-hover:opacity-100 group-hover:font-semibold transition-all duration-300 px-3 py-1 rounded-full group-hover:bg-[var(--theme-accent)]/20 group-hover:shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.4)] relative z-10">Click for details</span>
            
            {/* Enhanced popup that appears over the card */}
            <div className="tool-details hidden absolute top-0 left-0 right-0 bottom-0 bg-[var(--theme-bg-primary)] dark:bg-[var(--theme-bg-primary)] rounded-xl p-6 z-20 overflow-auto shadow-lg border border-gray-100/30 dark:border-gray-800/30">
              <button className="close-details absolute top-3 right-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-1.5 rounded-full text-gray-500 dark:text-gray-300 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="mb-4">
                <h3 className="text-[var(--theme-accent-secondary)] text-xl font-semibold">Scran.ar</h3>
              </div>
              
              <p className="text-[var(--theme-text-primary)] text-sm mb-3 leading-relaxed">
                A powerful video ingest application for editing buckets of shorts <strong>quickly</strong>.
              </p>
              <p className="text-[var(--theme-text-primary)] text-sm leading-relaxed">
                This tool knows everything about your raw footage before even you do (not in a scary AI way).
              </p>
            </div>
          </div>
          
          {/* Splitt */}
          <div className="tool-card flex flex-col items-center bg-[var(--theme-surface)]/20 backdrop-blur-sm rounded-xl p-6 shadow-[var(--theme-shadow-sm)] hover:shadow-[var(--theme-shadow-xl)] hover:scale-[1.02] transition-all duration-300 cursor-pointer group hover:bg-[var(--theme-surface)]/40 relative">
            {/* Outer glow effect that appears on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
              <div className="absolute inset-[-20px] bg-[var(--theme-accent-secondary)]/20 blur-2xl"></div>
            </div>
            <div className="relative flex items-center justify-center w-36 h-36 md:w-40 md:h-40">
              <div className="absolute inset-0 bg-[var(--theme-radial-glow)] opacity-50 blur-md rounded-full group-hover:opacity-80 group-hover:blur-xl group-hover:scale-125 transition-all duration-300"></div>
              <div className="absolute inset-0 bg-[var(--theme-accent-secondary)]/30 rounded-full opacity-0 group-hover:opacity-60 group-hover:blur-xl group-hover:scale-150 animate-pulse transition-all duration-500"></div>
              <img className="app-icon w-28 h-28 md:w-32 md:h-32 object-contain drop-shadow-xl relative z-10 transition-transform duration-300 group-hover:scale-110" src={appIcons.spitt} alt="Spitt.ar" />
            </div>
            <h3 className="text-[var(--theme-accent-secondary)] text-2xl md:text-3xl font-normal mt-4 mb-1 text-center group-hover:scale-105 transition-transform duration-300 relative z-10">Spitt.ar</h3>
            <p className="text-[var(--theme-text-primary)] text-base md:text-lg mb-2 text-center relative z-10">Premiere Pro extension</p>
            <span className="text-[var(--theme-accent)] text-sm font-medium mt-2 opacity-80 group-hover:opacity-100 group-hover:font-semibold transition-all duration-300 px-3 py-1 rounded-full group-hover:bg-[var(--theme-accent)]/20 group-hover:shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.4)] relative z-10">Click for details</span>
            
            {/* Enhanced popup that appears over the card */}
            <div className="tool-details hidden absolute top-0 left-0 right-0 bottom-0 bg-[var(--theme-bg-primary)] dark:bg-[var(--theme-bg-primary)] rounded-xl p-6 z-20 overflow-auto shadow-lg border border-gray-100/30 dark:border-gray-800/30">
              <button className="close-details absolute top-3 right-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-1.5 rounded-full text-gray-500 dark:text-gray-300 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="mb-4">
                <h3 className="text-[var(--theme-accent-secondary)] text-xl font-semibold">Spitt.ar</h3>
              </div>
              
              <p className="text-[var(--theme-text-primary)] text-sm mb-3 leading-relaxed">
                Video editing can be cruel, whether you're the one doing it or not.
              </p>
              <p className="text-[var(--theme-text-primary)] text-sm leading-relaxed">
                Creates aptly named timelines from your notion data and populates them with footage in a single click.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-4xl flex flex-col justify-center items-center gap-6 md:gap-8 relative z-10">
        <div className="text-center text-[var(--theme-text-primary)] text-xl md:text-2xl lg:text-3xl font-normal">
          The best part is, all of these developments are seamlessly integrated, meaning:
        </div>
        <div className="text-center text-[var(--theme-accent)] text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold">
          They speak to each other
        </div>
        <div className="text-center text-[var(--theme-text-primary)] text-lg md:text-xl lg:text-2xl">
          All 'busy work' is eliminated.
        </div>
        <div className="text-center text-[var(--theme-text-primary)] text-lg md:text-xl lg:text-2xl">
          <span className="font-semibold">And we've got more in the works:</span> Custom analytics tools, video editing automators, AI driven 'authentic performance' checkers… and more
        </div>
        <div className="text-center text-[var(--theme-text-primary)] text-lg md:text-xl lg:text-2xl">
          As part of <span className="font-semibold">Vertical Shortcut alpha</span>, you will have permanent access to the entire code suite, as well as early access to all the updates and expansions we make to the course, when we're happy to offer these publicly.
        </div>
      </div>
      
      {/* Subtle pattern background */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--theme-text-primary)/0.03_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 pointer-events-none"></div>
    </div>
  );
};

export default ConnectEverything;