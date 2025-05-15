import React, { useRef, useEffect, useState } from 'react';
import { getTeamMemberHalftone, getTeamImageCollection } from "../../utils/imageMap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);



// Team members data that will be used by both desktop and mobile components
const teamMembers = [
  
  {
    name: "Joden Newman",
    title: "Founder and CEO",
    bio: "Joden Clash Newman is the Founder and CEO at Clash Creation (yes Clash is literally his middle name). He started building content for founders over 3 years ago (and did very, very well). So decided to grow his own platform, reached millions of views and followers in only 3 months, and used that money to start his own company. This one.",
    beliefs: "He strongly believes that creativity, humour and intelligence is the core of all good content, and wants to use short form to educate and hire young creatives struggling in the UK's underfunded and frankly under-appreciated creative economy.",
    likes: "long boring films in a language that doesn't exist (french) grindset influencers, web design — he literally made this entire website himself",
    dislikes: "long walks on the beach, meal deals, people not buying the vertical shortcut",
    quote: "\"his preferred order is 20 spicy wings and a strawberry miranda\" - his local boss man",
    halftoneImage: getTeamMemberHalftone('Joden') || "/assets/main/Meet_The_Team-webp/Joden-Halftone.avif",
    teamImages: getTeamImageCollection('Joden', {
      limit: 4,
      includeShared: false,
      randomize: false
    }) || []
  },
  {
    name: "Alex O'Connor",
    title: "Co-Founder and MD",
    bio: "Alex O'Connor is the Co-Founder and Managing Director at Clash Creation. He is the king of startups, with years of experience in organic marketing and management that he uses to keep us all getting paid. Plus he's got the gift of the gab which he uses to schmooz new clients and distract everyone in the office.",
    beliefs: "",
    likes: "Networking, Networthing, Gut health",
    dislikes: "ketchup, fizzy drinks and you (unless you buy the vertical shortcut)",
    quote: "\"he's actually pretty sound\" - his number one opp",
    halftoneImage: getTeamMemberHalftone('Alex') || "/assets/main/Meet_The_Team-webp/Alex/Alex-Halftone.avif",
    teamImages: getTeamImageCollection('Alex', {
      limit: 4,
      includeShared: false,
      randomize: false
    }) || []
  },
  {
    name: "Tia Warner",
    title: "Strategist, Writer and Researcher",
    bio: "Tia is the content strategist, writer and researcher at Clash Creation. She has a masters in AI, and uses it to criticise people who use it to write lazy copy. Her experience in newsletters make her a research and writing master. But her addiction to TikTok is probably what actually makes her good at writing short form.",
    beliefs: "",
    likes: "cooking 10/10 dinners, eating said 10/10 dinners and 'writing' her sci-fi book",
    dislikes: "people asking how the book is going, people who don't buy the vertical shortcut",
    quote: "\"A veritable genius\" - an anonymous source close to Tia",
    halftoneImage: getTeamMemberHalftone('Tia') || "/assets/main/Meet_The_Team-webp/Tia/Tia-Halftone.avif",
    teamImages: getTeamImageCollection('Tia', {
      limit: 4,
      includeShared: false,
      randomize: false
    }) || []
  },
  {
    name: "Aydan Banks",
    title: "Video Producer",
    bio: "Aydan Banks is the Video Producer at Clash Creation. His career as a writer and producer in TV made him an expert at producing 10/10 videos. It also taught him that TV is a dying industry, and that short form is the most exciting and innovative space for young creatives to work in. He has his own successful TikTok account that focusses on high-brow political critique and low-brow comedy.",
    beliefs: "",
    likes: "stand up (when it goes well), small hats, lime bikes",
    dislikes: "standup (when it goes badly), matt hancock, when people don't by the vertical short cut",
    quote: "\"he knows all the secrets of the london underground\" - a high level TV exec (did you know he used to work in TV)",
    halftoneImage: getTeamMemberHalftone('Aydan') || "/assets/main/Meet_The_Team-webp/Aydan/Aydan-Halftone.avif",
    teamImages: getTeamImageCollection('Aydan', {
      limit: 4,
      includeShared: false,
      randomize: false
    }) || []
  }
];

// Mobile-specific Team Carousel component
const MobileTeamCarousel = () => {
  const carouselRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedBios, setExpandedBios] = useState<{ [key: string]: boolean }>({});
  
  // Custom rendering for team member bio in mobile view
  const getMobileBio = (member: typeof teamMembers[0]) => {
    // For Joden, remove the specific part about creativity, etc.
    if (member.name === "Joden Newman") {
      return "Joden Clash Newman is the Founder and CEO at Clash Creation (yes Clash is literally his middle name). He started building content for founders over 3 years ago (and did very, very well). So decided to grow his own platform, reached millions of views and followers in only 3 months, and used that money to start his own company. This one.";
    }
    // For others, use the original bio
    return member.bio;
  };
  
  // Handle slide animation with GSAP
  useGSAP(() => {
    const ctx = gsap.context(() => {
      // Get all slides
      const slides = document.querySelectorAll('.mobile-team-slide');
      
      // Reset all slides first
      gsap.set(slides, {
        opacity: 0,
        x: (i) => {
          const idx = parseInt(slides[i].getAttribute('data-index') || '0');
          return idx < activeIndex ? "-100%" : (idx > activeIndex ? "100%" : "0%");
        }
      });
      
      // Animate the active slide
      gsap.to(
        `.mobile-team-slide[data-index="${activeIndex}"]`,
        { 
          opacity: 1, 
          x: 0,
          duration: 0.6,
          ease: "power2.out"
        }
      );
    }, carouselRef);
    
    return () => ctx.revert();
  }, [activeIndex]);

  return (
    <div id="team-section" className="team-section-mobile pt-12 pb-0 bg-[var(--theme-bg-primary)]" ref={carouselRef}>
      <div className="container-mobile mx-auto px-4">
        {/* Section Header - Always Visible */}
        <div className="text-center mb-10">
          <h2 className="text-[var(--theme-text-primary)] text-3xl font-bold mb-4">
            So who are we?
          </h2>
          <h3 className="text-[var(--theme-text-primary)] text-xl font-medium mb-4">
            Why trust us?
          </h3>
          <p className="text-[var(--theme-text-secondary)] text-base">
            We're not just a guy in a room. We're a team of creatives, who just happen to be f*cking great at making content. 
            It's why we're the number one short form agency in the world, and luckily for you we specialise in getting founders like yourself, millions of views.
          </p>
        </div>
        
        {/* Custom Carousel Implementation */}
        <div className="relative min-h-[955px] overflow-hidden mt-10 pb-0">
          <div className="carousel-container relative">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                data-index={index}
                className={`mobile-team-slide absolute top-0 left-0 w-full transition-all duration-300 ${
                  index === activeIndex 
                    ? 'opacity-100 z-10 translate-x-0' 
                    : index < activeIndex 
                      ? 'opacity-0 z-0 -translate-x-full' 
                      : 'opacity-0 z-0 translate-x-full'
                }`}
                style={{
                  pointerEvents: index === activeIndex ? 'auto' : 'none',
                  position: 'absolute',
                  height: '100%'
                }}
              >
                <div className="flex flex-col items-center px-1">
                  {/* Member Image */}
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <img 
                      src={member.halftoneImage} 
                      alt={member.name}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  </div>
                  
                  {/* Member Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-[var(--theme-text-primary)] text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-[var(--theme-primary)] text-lg font-medium">{member.title}</p>
                  </div>
                  
                  {/* Bio */}
                  <div className="bg-[var(--theme-bg-surface)]/50 backdrop-blur-md p-4 rounded-lg border border-[var(--theme-border-light)] mb-4">
                    <div className="relative">
                      <p className={`text-[var(--theme-text-primary)] text-xs leading-relaxed transition-all duration-300 ${!expandedBios[member.name] ? 'line-clamp-4' : ''}`}>
                        {getMobileBio(member)}
                      </p>
                      {!expandedBios[member.name] && (
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[var(--theme-bg-surface)]/50 to-transparent" />
                      )}
                      <button 
                        onClick={() => setExpandedBios(prev => ({ ...prev, [member.name]: !prev[member.name] }))}
                        className="text-[var(--theme-accent-secondary)] text-xs font-medium mt-2 hover:underline relative z-10"
                      >
                        {expandedBios[member.name] ? 'Show less' : 'Read more'}
                      </button>
                    </div>
                    {/* Only show beliefs for non-Joden team members */}
                    {member.beliefs && member.name !== "Joden Newman" && (
                      <p className="text-[var(--theme-text-primary)] text-xs leading-relaxed mt-3">{member.beliefs}</p>
                    )}
                  </div>
                  
                  {/* Likes & Dislikes - Side-by-side version */}
                  <div className="grid grid-cols-2 gap-3 w-full mb-2">
                    <div className="member-detail rounded-lg bg-[var(--theme-bg-surface)]/60 backdrop-blur-md p-4 border border-[var(--theme-border-light)] shadow-sm">
                      <span className="text-[var(--theme-accent-secondary)] font-semibold block mb-2 text-base">Likes:</span> 
                      <span className="text-[var(--theme-text-primary)] text-sm leading-relaxed">{member.likes}</span>
                    </div>
                    <div className="member-detail rounded-lg bg-[var(--theme-bg-surface)]/60 backdrop-blur-md p-4 border border-[var(--theme-border-light)] shadow-sm">
                      <span className="text-[var(--theme-accent-secondary)] font-semibold block mb-2 text-base">Dislikes:</span> 
                      <span className="text-[var(--theme-text-primary)] text-sm leading-relaxed">{member.dislikes}</span>
                    </div>
                  </div>
                  
                  {/* Quote */}
                  <div className="w-full mt-0 mb-0">
                    <div className="bg-[var(--theme-bg-card)] bg-opacity-90 backdrop-blur-md p-3 rounded-lg shadow-[var(--theme-shadow-md)] border border-[var(--theme-border-light)]">
                      <p className="text-[var(--theme-text-primary)] italic text-sm">{member.quote}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Carousel Navigation */}
          <div className="flex justify-center items-center space-x-3 mt-16 mb-4">
            {teamMembers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-4 h-4 rounded-full transition-all ${
                  idx === activeIndex 
                    ? 'bg-[var(--theme-primary)] scale-125' 
                    : 'bg-[var(--theme-text-subtle)] scale-100'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          
          {/* Previous/Next Buttons */}
          <div className="absolute top-[260px] left-0 right-0 flex justify-between items-center px-3 z-20 pointer-events-none">
            <button 
              onClick={() => setActiveIndex(prev => (prev === 0 ? teamMembers.length - 1 : prev - 1))}
              className="bg-[var(--theme-bg-surface)]/80 backdrop-blur-sm text-[var(--theme-text-primary)] h-11 w-11 rounded-full flex items-center justify-center shadow-lg pointer-events-auto"
              aria-label="Previous team member"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            <button 
              onClick={() => setActiveIndex(prev => (prev === teamMembers.length - 1 ? 0 : prev + 1))}
              className="bg-[var(--theme-bg-surface)]/80 backdrop-blur-sm text-[var(--theme-text-primary)] h-11 w-11 rounded-full flex items-center justify-center shadow-lg pointer-events-auto"
              aria-label="Next team member"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          
          {/* No name indicators at bottom - removed */}
        </div>
      </div>
    </div>
  );
};

// Original Desktop Team Section Component with Parallax
const DesktopTeamParallaxSection = () => {
  // Main container ref
  const containerRef = useRef<HTMLDivElement>(null);
  
  // GSAP ScrollTrigger parallax - smooth and optimized
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Store all ScrollTrigger instances for cleanup
    const triggers = [];
    
    // Create separate context for our animations to prevent conflicts
    const teamParallaxContext = gsap.context(() => {
      // Apply parallax to each team member section
      document.querySelectorAll('.team-member-section').forEach((section, sectionIndex) => {
        // Create a timeline for this section
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom", // Start when top of section reaches bottom of viewport
            end: "bottom top",   // End when bottom of section leaves top of viewport
            scrub: 0.5,          // Smooth scrubbing effect (0.5 second lag)
            // markers: true,    // For debugging - remove in production
            id: `section-${sectionIndex}`,
            invalidateOnRefresh: true,
          }
        });
        
        // Store the trigger for cleanup
        triggers.push(ScrollTrigger.getById(`section-${sectionIndex}`));
        
        // Find all parallax elements in this section with data-speed
        const parallaxElements = section.querySelectorAll('[data-speed]');
        
        // Add each element to the timeline with its own speed
        parallaxElements.forEach(element => {
          const speed = parseFloat(element.dataset.speed || '0.85');
          const direction = element.classList.contains('halftone-image') ? -1 : 1;
          
          // If this is a floating team image, apply enhanced movement for falling effect
          if (element.classList.contains('floating-team-image')) {
            // Get custom speed and create more pronounced vertical movement
            // Higher speed = faster falling
            const verticalMovement = (speed * 80) * direction; // Much more vertical movement
            const horizontalMovement = ((Math.random() * 20) - 10); // Small random horizontal drift

            // Add to timeline - animate based on scroll position
            tl.to(element, {
              y: verticalMovement,
              x: horizontalMovement,
              ease: "none",
            }, 0);
          } else {
            // Regular parallax for other elements (like halftone)
            const yPercent = (1 - speed) * 50 * direction;

            // Add to timeline - animate based on scroll position
            tl.to(element, {
              yPercent: yPercent,
              ease: "none",
            }, 0); // Start at the beginning of the timeline
          }
        });
        
        // Additional animations for floating images
        section.querySelectorAll('.floating-team-image').forEach((img, index) => {
          // Extract rotation from data attribute
          const rotation = img.dataset.rotate || (index % 2 === 0 ? 5 : -5);
          
          // Create a unique ID for this trigger
          const triggerId = `floating-${sectionIndex}-${index}`;
          
          // Add subtle rotation and movement that's independent of the main parallax
          gsap.to(img, {
            rotation: rotation,
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.7,  // Even smoother scrub for subtle effect
              id: triggerId,
              invalidateOnRefresh: true,
            }
          });
          
          // Store the trigger for cleanup
          triggers.push(ScrollTrigger.getById(triggerId));
        });
      });
    });
    
    // Cleanup function
    return () => {
      // Kill all ScrollTriggers we created
      triggers.forEach(trigger => {
        if (trigger) trigger.kill(false);
      });

      // Clear the GSAP context
      teamParallaxContext.revert();
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* Custom styles for team section */
        .floating-element {
          animation: float 8s ease-in-out infinite;
        }
        
        .floating-team-image {
          transition: transform 0.3s ease-out, box-shadow 0.3s ease-out, opacity 0.3s ease-out, z-index 0s;
        }
        
        /* Enhanced hover effect - brings images into focus */
        .floating-team-image:hover {
          transform: scale(1.1) rotate(0deg) !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
          z-index: 50 !important; /* Ensure hovered image is on top */
          opacity: 1 !important; /* Full opacity on hover */
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(var(--rotation, 0deg)); }
          50% { transform: translateY(-15px) rotate(var(--rotation, 0deg)); }
          100% { transform: translateY(0px) rotate(var(--rotation, 0deg)); }
        }
        
        /* Add a subtle transition to parallax elements for smoother movement */
        .halftone-image, .floating-team-image {
          will-change: transform;
          transition: transform 0.2s ease-out, opacity 0.2s ease-out;
          filter: brightness(0.95); /* Slightly dimmed by default */
        }
        
        /* Brighten on hover */
        .floating-team-image:hover img {
          filter: brightness(1.1) contrast(1.05); /* Pop effect on hover */
        }
      `}</style>
      
      <div className="team-section-container relative" ref={containerRef}>
      
        {/* Header section */}
        <section className="team-section-heading text-center pt-0 pb-6 min-h-[50vh] flex flex-col justify-center bg-[var(--theme-bg-primary)]" id='team-section'>
          {/* Floating background elements */}
          <div className="absolute top-20 left-1/4 w-20 h-20 rounded-[40%] rotate-12 opacity-5
                      bg-[var(--theme-float-bg-primary)] floating-element hidden md:block dark:hidden"></div>
          <div className="absolute bottom-10 right-1/3 w-24 h-24 rounded-[30%] -rotate-6 opacity-8 
                      bg-[var(--theme-float-bg-secondary)] floating-element hidden md:block dark:hidden"></div>
          
          {/* Dark mode floating elements */}
          <div className="absolute top-20 left-1/4 w-20 h-20 rounded-[40%] rotate-12 opacity-10
                      bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-primary-hover)]
                      floating-element hidden md:dark:block"></div>
          <div className="absolute bottom-10 right-1/3 w-24 h-24 rounded-[30%] -rotate-6 opacity-15
                      bg-gradient-to-r from-[var(--theme-accent-secondary)] to-[var(--theme-accent-secondary-hover)]
                      floating-element hidden md:dark:block"></div>
                  
          <h2 className="intro-heading text-[var(--theme-text-primary)] text-4xl md:text-5xl font-bold mb-4 relative z-10">
            So who are we?
          </h2>
          <div className="max-w-5xl mx-auto px-1">
            <h3 className="intro-heading text-[var(--theme-text-primary)] text-2xl md:text-3xl font-medium mb-4 relative z-10">
              Why trust us?
            </h3>
            <p className="intro-text text-[var(--theme-text-secondary)] text-lg md:text-xl lg:text-xl mb-6 relative z-10">
              We're not just a guy in a room. We're a team of creatives, who just happen to be f*cking great at making content. 
              It's why we're the number one short form agency in the world, and luckily for you we specialise in getting founders like yourself, millions of views.
            </p>
          </div>
        </section>
      
        {/* Team member sections - each is a full viewport height */}
        {teamMembers.map((member, index) => (
          <section 
            key={member.name}
            id={`team-member-${index}`}
            className={`team-member-section min-h-screen flex items-center py-10 relative overflow-hidden
                      ${index % 2 === 0 ? 'bg-[var(--theme-bg-primary)]' : 'bg-[var(--theme-bg-secondary)]'}`}
          >
            {/* Background floating elements */}
            {[...Array(6)].map((_, i) => (
              <div 
                key={`float-${i}`}
                className="absolute floating-element rounded-full opacity-5 dark:opacity-10"
                style={{
                  width: `${(i + 2) * 2}rem`,
                  height: `${(i + 2) * 2}rem`,
                  top: `${(i * 10) + 15}%`,
                  left: i % 2 === 0 ? `${(i * 10) + 15}%` : `${70 - (i * 8)}%`,
                  transform: `rotate(${i * 4}deg)`,
                  background: i % 3 === 0 
                    ? 'var(--theme-float-bg-primary)' 
                    : i % 3 === 1 
                      ? 'var(--theme-float-bg-secondary)' 
                      : 'var(--theme-accent-secondary)'
                }}
              />
            ))}
            
            {/* Floating team images - larger and with parallax data attributes */}
            <div className="team-images-wrapper absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
              {/* Render all dynamically loaded team images */}
              {member.teamImages.map((img, imgIndex) => (
                <div
                  key={`team-img-${imgIndex}`}
                  className="absolute floating-team-image shadow-[var(--theme-shadow-md)] overflow-hidden hover:z-20 pointer-events-auto"
                  style={{
                    width: `${180 + (img.scale * 120)}px`, // Varied sizes based on scale
                    // Let height be determined by aspect ratio
                    opacity: img.opacity, // Use strategic opacity from our imageMap adjustments
                    borderRadius: `${20 + (Math.random() * 8)}px`, // Slight variation in corners
                    top: `${img.position.top}%`,
                    left: `${img.position.left}%`,
                    transform: `rotate(${img.position.rotate/50}deg)`, // Use full rotation for more dynamic feel
                    transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out, z-index 0s',
                    zIndex: img.zIndex,
                  }}
                  data-rotate={img.position.rotate} // Full rotation for dynamic effect
                  data-speed={img.speed} // Use calculated speed from imageMap for varying "falling" speeds
                  data-direction={img.direction}
                >
                  <img 
                    src={img.url || `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/main/Meet_The_Team-webp/${member.name.split(' ')[0]}/default.webp`} 
                    alt={`${member.name} team moment ${imgIndex + 1}`}
                    className="w-full object-contain" // Use object-contain to preserve aspect ratio
                    style={{ maxHeight: `${320 + (img.scale * 80)}px` }} // Control max height for aspect ratio
                    loading="lazy"
                    onError={(e) => {
                      // Fallback if image fails to load
                      const fallbackImage = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/main/Meet_The_Team-webp/${member.name.split(' ')[0]}/${member.name.split(' ')[0]}-main-full.avif`;
                      if (e.currentTarget.src !== fallbackImage) {
                        e.currentTarget.src = fallbackImage;
                      } else {
                        // If that fails too, use a default
                        e.currentTarget.src = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/main/DataBaseThumbs/default.webp`;
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Content container */}
            <div className="container mx-auto px-4">
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                {/* Image container */}
                <div className={`member-image-container relative ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative min-h-[350px] lg:min-h-[450px] flex justify-center ">
                    {/* Halftone image that peeks from the bottom of the section */}
                    <div className="absolute bottom-[-25%] w-full h-[160%] flex items-end justify-center overflow-visible">
                      <img 
                        src={member.halftoneImage} 
                        alt={member.name} 
                        className="halftone-image h-full w-auto max-w-none object-contain drop-shadow-2xl"
                        style={{
                          filter: 'drop-shadow(0 20px 15px rgba(0, 0, 0, 0.3))',
                          zIndex: 5,
                          transform: 'scale(1.2)'
                        }}
                        data-speed="0.9"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const fallbackImage = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/main/Meet_The_Team-webp/${member.name.split(' ')[0]}-Halftone.avif`;
                          if (e.currentTarget.src !== fallbackImage) {
                            e.currentTarget.src = fallbackImage;
                          } else {
                            // If that fails too, use a default
                            e.currentTarget.src = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/assets/main/DataBaseThumbs/default.webp`;
                          }
                        }}
                      />
                    </div>
                    
                    {/* Quote overlay */}
                    <div 
                      className={`member-quote absolute z-30 ${
                        index % 2 === 0 
                          ? 'bottom-10 right-6 lg:bottom-12 lg:right-8' 
                          : 'bottom-10 left-6 lg:bottom-12 lg:left-8'
                      } max-w-[85%] lg:max-w-[65%]`}
                    >
                      <div className="bg-[var(--theme-bg-card)] bg-opacity-90 backdrop-blur-md p-6 rounded-lg shadow-[var(--theme-shadow-md)] border border-[var(--theme-border-light)]">
                        <p className="text-[var(--theme-text-primary)] italic text-base">{member.quote}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content - has z-index of 30, higher than all images */}
                <div className={`member-content space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''} relative z-30`}>
                  <h3 className="text-[var(--theme-text-primary)] text-4xl font-bold">{member.name}</h3>
                  <p className="text-[var(--theme-primary)] text-xl font-medium">{member.title}</p>
                  <div className="space-y-6">
                    <div className="bg-[var(--theme-bg-surface)]/50 backdrop-blur-md p-5 rounded-lg border border-[var(--theme-border-light)]">
                      <p className="text-[var(--theme-text-primary)] text-lg leading-relaxed">{member.bio}</p>
                      {member.beliefs && (
                        <p className="text-[var(--theme-text-primary)] text-lg leading-relaxed mt-4">{member.beliefs}</p>
                      )}
                    </div>
                    
                    <div className="pt-4 space-y-5">
                      <div className="member-detail rounded-lg bg-[var(--theme-bg-surface)]/60 backdrop-blur-md p-5 border border-[var(--theme-border-light)] shadow-sm">
                        <span className="text-[var(--theme-accent-secondary)] font-semibold block mb-2 text-lg">Likes:</span> 
                        <span className="text-[var(--theme-text-primary)]">{member.likes}</span>
                      </div>
                      <div className="member-detail rounded-lg bg-[var(--theme-bg-surface)]/60 backdrop-blur-md p-5 border border-[var(--theme-border-light)] shadow-sm">
                        <span className="text-[var(--theme-accent-secondary)] font-semibold block mb-2 text-lg">Dislikes:</span> 
                        <span className="text-[var(--theme-text-primary)]">{member.dislikes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
};

// Main component that switches between desktop and mobile based on screen size
export default function TeamSection() {
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(document.documentElement.clientWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Render mobile or desktop component based on screen size
  return isMobile ? <MobileTeamCarousel /> : <DesktopTeamParallaxSection />;
}