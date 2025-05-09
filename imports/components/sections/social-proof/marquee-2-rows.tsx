import React, { useState, useEffect } from 'react';
import Marquee from "../../ui/marquee";
import thumbnailService, { SOCIAL_THUMBNAILS } from '../../../utils/thumbnailService';
import { Section } from "../../ui/section";

interface MarqueeTwoRowsProps {
  className?: string;
  sectionTitle?: string;
  sectionDescription?: string;
}

const MarqueeTwoRows: React.FC<MarqueeTwoRowsProps> = ({ 
  sectionTitle = "You may have seen some of our work before:",
  sectionDescription = "These are just some of the videos we've created that have gone viral, reaching hundreds of millions of views across platforms."
}) => {
  const [thumbnails, setThumbnails] = useState<{src: string, alt: string}[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadThumbnails = async () => {
      try {
        // Initialize the thumbnail service
        await thumbnailService.initialize();
        
        // Load all social thumbnails
        const loadedThumbnails = await Promise.all(
          SOCIAL_THUMBNAILS.map(async (key) => {
            const src = await thumbnailService.getViewsThumbnail(key);
            return {
              src,
              alt: key.replace(/-/g, ' ')
            };
          })
        );
        
        setThumbnails(loadedThumbnails);
      } catch (error) {
        console.error('Error loading social thumbnails:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadThumbnails();
  }, []);
  
  // Split thumbnails into two roughly equal groups for the two rows (desktop) 
  const firstRowThumbnails = thumbnails.slice(0, Math.ceil(thumbnails.length / 2));
  const secondRowThumbnails = thumbnails.slice(Math.ceil(thumbnails.length / 2));
  
  // Create rows for mobile with different starting positions for variety
  const mobileRows = [];
  // Create different rows with slightly different starting points
  const baseRepeatedThumbnails = [...thumbnails, ...thumbnails];
  
  // Create rows with different starting positions
  for (let i = 0; i < 3; i++) {
    // Offset each row by a different amount to create visual variety
    const startIndex = i * Math.floor(thumbnails.length / 3);
    const rotatedThumbnails = [
      ...baseRepeatedThumbnails.slice(startIndex),
      ...baseRepeatedThumbnails.slice(0, startIndex)
    ];
    mobileRows.push(rotatedThumbnails);
  }

  return (
    <Section className="w-full overflow-hidden bg-theme-primary py-0 sm:py-4 md:py-24 px-0 pt-4 md:pt-6 pb-4 sm:pb-8 md:pb-4 mt-0 sm:mt-[20px] md:mt-[-80px]">
      <div className="mx-auto flex max-w-container flex-col items-center gap-0 sm:gap-2 text-center md:gap-16">
        <div className="flex flex-col items-center gap-0 sm:gap-2 px-4 sm:gap-4 md:gap-8 mb-0 sm:mb-2 relative z-100">
          <h2 className="max-w-[800px] text-lg xs:text-xl sm:text-2xl md:text-4xl font-bold leading-tight sm:leading-tight mb-1 sm:mb-0">
            {sectionTitle}
          </h2>
          <p className="body-text max-w-[600px] mx-auto md:max-w-none text-xs sm:text-sm md:text-base mb-2 sm:mb-0">
            {sectionDescription}
          </p>
        </div>
        
        {loading ? (
          <div className="w-full py-10 text-center text-theme-primary-500">
            <div className="animate-pulse">Loading thumbnails...</div>
          </div>
        ) : (
          /* Full-width mask with vignette */
          <div className="w-full max-w-full relative">
            {/* Desktop layout - 2 rows, hidden on mobile */}
            <div className="hidden md:block">
              <div className="relative overflow-hidden mb-[-36px]">
                <Marquee pauseOnHover className="[--duration:60s] py-0">
                  {firstRowThumbnails.map((item, index) => (
                    <div 
                      key={`desktop-first-${index}`} 
                      className="-mx-8 -my-5 overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300 shadow-theme-md"
                      style={{ transform: "scale(0.75)" }}
                    >
                      <img 
                        src={item.src} 
                        alt={item.alt} 
                        width={320} 
                        height={180}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </Marquee>
              </div>
              
              <div className="relative overflow-hidden">
                <Marquee reverse pauseOnHover className="[--duration:60s] py-0">
                  {secondRowThumbnails.map((item, index) => (
                    <div 
                      key={`desktop-second-${index}`} 
                      className="-mx-8 -my-5 overflow-hidden rounded-xl hover:scale-105 transition-transform duration-300 shadow-theme-md"
                      style={{ transform: "scale(0.75)" }}
                    >
                      <img 
                        src={item.src} 
                        alt={item.alt} 
                        width={320} 
                        height={180}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </Marquee>
              </div>
            </div>
            
            {/* Mobile layout - 3 rows, hidden on desktop */}
            <div className="block md:hidden">
              <div className="flex flex-col -space-y-0">
                {mobileRows.map((rowThumbnails, rowIndex) => (
                  <div key={`mobile-row-${rowIndex}`} className="relative overflow-hidden">
                    <Marquee 
                      reverse={rowIndex % 2 === 1} 
                      pauseOnHover 
                      className={`[--duration:${30 + (rowIndex * 10)}s]`}
                    >
                      {rowThumbnails.map((item, index) => (
                        <div 
                          key={`mobile-thumb-${rowIndex}-${index}`} 
                          className="-mx-12 -py-1 sm:-mx:0 overflow-hidden rounded-lg shadow-sm"
                          style={{ transform: "scale(0.65)" }}
                        >
                          <img 
                            src={item.src} 
                            alt={item.alt} 
                            width={320} 
                            height={180}
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </Marquee>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Deep side vignettes that fade out thumbnails completely using theme-aware colors */}
            <div 
              className="pointer-events-none absolute inset-y-0 left-0 w-[10%] sm:w-[15%] md:w-[35%] z-10 bg-theme-gradient-overlay-left opacity-90"
            ></div>
            <div 
              className="pointer-events-none absolute inset-y-0 right-0 w-[10%] sm:w-[15%] md:w-[35%] z-10 bg-theme-gradient-overlay-left opacity-90"
              style={{ transform: 'scaleX(-1)' }}
            ></div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default MarqueeTwoRows;