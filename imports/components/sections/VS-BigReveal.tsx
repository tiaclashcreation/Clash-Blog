import React, { useRef, useState } from 'react';
import { useGSAP } from "@gsap/react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CheckCircle, ArrowRightCircle, Mail, MapPin, Star, Users, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import AnimatedLogo from '../../components/logos/AnimatedLogo';
import IsometricGridBackground from '../hero/IsometricPattern';
import { VSText, VSHeading, VSGradientText } from '../ui/vs-text';
import { VSCard, VSSection } from '../ui/vs-background';
import { useDeviceDetection } from '../../utils/animation-utils';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Program details data
const programDetails = [
  { label: "Duration", value: "8 Weeks" },
  { label: "Commitment", value: "4 Hours a week" },
  { label: "Format", value: "Online + Live Sessions" },
  { label: "Next Cohort", value: "Late Spring 2025", highlight: true },
  { label: "Class Size", value: "limited to 12 students" }
];

// Key features data from the copy
const keyFeatures = [
  { 
    title: "No more guesswork", 
    description: "Stop wondering why some videos work and others flop. We'll teach you exactly what drives success in the algorithm - and how to game it.",
    icon: <CheckCircle className="h-5 w-5 text-theme-accent" />
  },
  { 
    title: "Weekly live coaching", 
    description: "You'll have direct access to our team of experts — who've generated over 1 billion views — on weekly live coaching calls with you and some of the best founders and executives in the world, offering you personalised feedback and advice on your content.",
    icon: <CheckCircle className="h-5 w-5 text-theme-accent" />
  },
  { 
    title: "Creative Team Building", 
    description: "Knowing who to hire, where to hire them, and how to train them can seem impossible. And then trusting them to run your brand? … we know how hard it is. That's why we've included everything we've learnt on training, delegating, hiring and managing creative teams to manage short form content for founders and execs.",
    icon: <CheckCircle className="h-5 w-5 text-theme-accent" />
  },
  { 
    title: "All tools & resources", 
    description: "Everything you need to create short form: from basic theory, to advanced editing and monetisation. Taught through hundreds of video modules, PDFs and workshops. No bullsh*t templates or hack sheets.",
    icon: <CheckCircle className="h-5 w-5 text-theme-accent" />
  },
  { 
    title: "Exclusive community", 
    description: "You'll get access to our exclusive community of founders and executives also wanting to grow on short form, who can help with collaboration, feedback, and accountability. (Plus its a great networking opportunity, schmoozers we see you)",
    icon: <CheckCircle className="h-5 w-5 text-theme-accent" />
  },
  { 
    title: "Creator tools suite", 
    description: "Plus custom in-house tools: CreatorHUD, Scran.ar and Splitt.ar, needed to run an efficient content machine. These tools made our team 4x more efficient, and increased the quality of our output too. And you're getting them for free.",
    icon: <CheckCircle className="h-5 w-5 text-theme-accent" />
  }
];

interface VSBigRevealProps {
  onApplyClick?: () => void;
}

type BlockProps = {
  className?: string;
} & React.ComponentProps<typeof motion.div>;

const Block = ({ className, ...rest }: BlockProps) => {
  return (
    <motion.div
      variants={{
        initial: {
          opacity: 0,
        },
        animate: {
          opacity: 1,
        },
      }}
      transition={{
        duration: 0.3,
      }}
      className={twMerge(
        "rounded-xl border border-theme-accent/10 bg-theme-surface/80 p-4",
        className
      )}
      {...rest}
    />
  );
};

const VSBigReveal = ({ onApplyClick }: VSBigRevealProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useDeviceDetection();
  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(new Set());
  
  const toggleFeature = (index: number) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  useGSAP(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      if (isMobile) {
        gsap.from(".feature-card", {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          y: 20,
          duration: 0.3,
          stagger: 0.1,
        });
        return;
      }
      
      // Desktop animations
      const styles = getComputedStyle(document.documentElement);
      const animDistance = styles.getPropertyValue('--theme-anim-distance') || '-4px';
      const animDuration = styles.getPropertyValue('--theme-anim-duration') || '0.35';
      
      // Logo animation
      const logoTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
          scrub: true,
          id: 'reveal-logo-desktop'
        }
      });
      
      logoTl.fromTo(".vs-logo-wrapper", 
        { x: 400, y: 100, opacity: 0, rotation: 10 },
        { x: -100, y: -40, opacity: 1, rotation: -3, ease: "power1.inOut" }
      );
      
      // Heading and tagline timeline
      const introTl = gsap.timeline({ 
        scrollTrigger: { 
          trigger: headingRef.current, 
          start: "top 75%", 
          toggleActions: "play none none reverse", 
          once: true,
          id: 'reveal-intro-desktop' 
        } 
      });
      
      introTl.from(headingRef.current, { 
        y: 30, opacity: 0, duration: parseFloat(animDuration) * 1.5, ease: "power2.out", clearProps: "all" 
      });
      
      introTl.from(taglineRef.current, { 
        y: 25, opacity: 0, duration: parseFloat(animDuration) * 1.2, ease: "power2.out", clearProps: "all" 
      }, "-=0.5");
      
      // Card and feature details timeline
      const tl = gsap.timeline({ 
        scrollTrigger: { 
          trigger: detailsRef.current, 
          start: "top 70%", 
          toggleActions: "play none none reverse", 
          once: true,
          id: 'reveal-details-desktop' 
        } 
      });
      
      tl.from(".feature-card", { 
        y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", clearProps: "all" 
      });
      
      tl.from(".program-details", { 
        y: 20, opacity: 0, duration: 0.5, ease: "power2.out", clearProps: "all" 
      }, "-=0.2");
      
      // Feature item animations
      gsap.from(".feature-item", {
        scrollTrigger: { 
          trigger: ".feature-list", 
          start: "top 80%", 
          toggleActions: "play none none none",
          once: true,
          id: 'reveal-items-desktop' 
        },
        y: parseFloat(animDistance) * -4,
        opacity: 0, 
        duration: 0.5, 
        stagger: 0.08,
        ease: "power2.out",
        clearProps: "all"
      });
      
      // CTA button animation
      gsap.from(".cta-button", {
        scrollTrigger: { 
          trigger: ".program-details", 
          start: "top 70%", 
          toggleActions: "play none none none",
          once: true,
          id: 'reveal-cta-desktop' 
        },
        scale: 0.95,
        y: 10,
        opacity: 0, 
        duration: 0.6, 
        ease: "back.out(1.5)",
        clearProps: "all"
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, [isMobile]);
  
  if (isMobile) {
    return (
      <VSSection 
        ref={sectionRef} 
        className="min-h-screen bg-theme-primary px-4 py-8 text-theme-primary"
      >
        <div className="container mx-auto px-4 relative">
          <div className="text-center mt-2 mb-6 max-w-[700px] mx-auto relative z-10 overflow-visible">
            <p ref={headingRef} className="!font-extralight mb-3 text-theme-primary text-center lowercase tracking-wide"
              style={{ 
                fontWeight: 200,
                fontSize: "clamp(2rem, 5vw, 7rem)"
              }}
            >
              the vertical shortcut<span className="text-theme-accent">.</span>
            </p>
            
            <div ref={taglineRef} className="text-center">
              <VSGradientText
                as="h2"
                size="lg"
                className="font-bold mb-3 mx-auto max-w-[95%]"
              >
                The Vertical Shortcut is the proven system for content creation that's guaranteed millions of views
              </VSGradientText>
              
              <p className="body-text mb-3 mx-auto max-w-[95%] text-sm">
                We've combined everything we know: All the knowledge, systems and tools that we use on a daily basis to get our clients billions of views — so you can do it all yourself.
              </p>
              
              <p className="body-text mb-4 mx-auto max-w-[95%] text-xs">
                Built with founders and execs in mind.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="flex flex-col items-center p-3 bg-theme-surface/50 rounded-lg">
              <Users className="text-xl text-theme-accent mb-1" />
              <span className="text-lg font-bold">12</span>
              <span className="text-xs text-theme-primary/60">Students</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-theme-surface/50 rounded-lg">
              <Clock className="text-xl text-theme-accent mb-1" />
              <span className="text-lg font-bold">8</span>
              <span className="text-xs text-theme-primary/60">Weeks</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-theme-surface/50 rounded-lg">
              <Calendar className="text-xl text-theme-accent mb-1" />
              <span className="text-lg font-bold">4</span>
              <span className="text-xs text-theme-primary/60">Hours/Week</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-theme-surface/50 rounded-lg">
              <Star className="text-xl text-theme-accent mb-1" />
              <span className="text-lg font-bold">1B+</span>
              <span className="text-xs text-theme-primary/60">Views</span>
            </div>
          </div>

          {/* Key Features - Compact Design */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-theme-accent mb-2">Key Features</h3>
            <div className="grid grid-cols-1 gap-2">
              {keyFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="feature-card p-2 bg-theme-surface rounded-lg cursor-pointer hover:bg-theme-surface/60 transition-colors"
                  onClick={() => toggleFeature(index)}
                >
                  <div className="flex items-start gap-2 mb-1">
                    <div className="p-1.5 bg-theme-accent/10 rounded-lg flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xs font-medium text-theme-accent mb-0.5">
                        {feature.title}
                      </h3>
                      <p className={`text-xs text-theme-primary/80 ${expandedFeatures.has(index) ? '' : 'line-clamp-2'}`}>
                        {feature.description}
                      </p>
                      {!expandedFeatures.has(index) && (
                        <button className="text-[10px] text-theme-accent mt-0.5 hover:underline">
                          Read more
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Contact */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 p-3 bg-theme-surface/50 rounded-lg w-full">
              <MapPin className="text-xl text-theme-accent" />
              <div>
                <h3 className="text-sm font-medium text-theme-accent">Online Program</h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-theme-primary/80">Join from anywhere</p>
                  <span className="text-xs text-theme-accent">•</span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-theme-primary/80" />
                    <p className="text-xs text-theme-primary/80">Starts May 12, 2025</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={onApplyClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-theme-accent text-theme-primary rounded-lg text-sm font-medium"
            >
              Apply Now
              <ArrowRightCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </VSSection>
    );
  }

  // Desktop version
  return (
    <VSSection 
      ref={sectionRef} 
      className="big-reveal-section pt-12 pb-8 sm:pt-16 sm:pb-12 overflow-hidden relative bg-theme-primary"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 z-10">
          <IsometricGridBackground skipAnimation={false} />
        </div>
        <div className="absolute top-20 left-10 w-60 h-60 rounded-[40%] rotate-12 opacity-theme-float bg-theme-float-primary animate-float-slow"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 rounded-[30%] -rotate-6 opacity-theme-float bg-theme-float-secondary animate-float-medium"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-[35%] rotate-45 opacity-theme-float bg-theme-float-accent animate-float-fast"></div>
        <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full opacity-theme-float bg-theme-accent/10 animate-float-medium"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 border-4 rounded-full border-theme-accent/20 opacity-theme-float animate-spin-slow"></div>
        <div className="absolute bottom-1/4 right-10 w-16 h-16 border-8 rounded-full border-theme-primary/15 opacity-theme-float animate-float-medium"></div>
      </div>
      
      <div 
        ref={logoRef} 
        className="vs-logo-wrapper absolute top-[350px] right-[-120vw] md:right-[-100vw] lg:right-[-80vw] xl:right-[-70vw] w-[200vw] max-w-[none] min-w-[1200px] opacity-[40%] z-0 transform-gpu pointer-events-none scale-[3]"
      >
        <AnimatedLogo 
          onAnimationComplete={() => {}} 
          skipAnimation={true}
        />
        <div className="absolute inset-0 -z-10 blur-3xl">
          <div className="w-full h-full rounded-full bg-theme-radial-glow opacity-0"></div>
        </div>
      </div>
        
      <div className="container mx-auto px-4 relative">
        <div className="text-center md:text-left mt-2 sm:mt-[20px] mb-6 sm:mb-12 max-w-[700px] mx-auto md:mx-0 relative z-10 overflow-visible">
          <p ref={headingRef} className="font-[200] !font-extralight mb-3 sm:mb-4 text-theme-primary text-center lowercase tracking-wide"
            style={{ 
              fontWeight: 200,
              fontSize: "clamp(2rem, 5vw, 7rem)"
            }}
          >
            the vertical shortcut<span className="text-theme-accent">.</span>
          </p>
          
          <div ref={taglineRef} className="text-center md:text-left md:pl-8">
            <VSGradientText
              as="h2"
              size="lg"
              className="font-bold mb-3 sm:mb-4 mx-auto md:mx-0 max-w-[95%] md:max-w-none"
            >
              The Vertical Shortcut is the proven system for content creation that's guaranteed millions of views
            </VSGradientText>
            
            <p className="body-text mb-3 sm:mb-5 mx-auto md:mx-0 max-w-[95%] md:max-w-none text-sm md:text-base">
              We've combined everything we know: All the knowledge, systems and tools that we use on a daily basis to get our clients billions of views — so you can do it all yourself.
            </p>
            
            <p className="body-text mb-4 sm:mb-6 mx-auto md:mx-0 max-w-[95%] md:max-w-none text-xs md:text-sm">
              Built with founders and execs in mind.
            </p>
          </div>
        </div>
        
        <div ref={detailsRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-4 md:pl-0 md:pr-6 lg:pr-4">
          <div className="feature-card md:col-span-3 bg-theme-surface/80 p-3 md:p-4 rounded-xl shadow-theme-sm md:-ml-4">
            <p className="text-center font-semibold text-sm sm:text-base md:text-lg text-theme-primary uppercase tracking-wider mb-4">
              Key Features
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 md:justify-start feature-list">
              {keyFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="feature-item p-3 md:p-4 pt-3 rounded-md bg-theme-surface/50 flex flex-col"
                >
                  <h4 className="font-semibold text-xs sm:text-sm uppercase text-theme-accent mb-2 w-full flex items-start">
                    <span className="mr-2 mt-0.5 flex-shrink-0">{feature.icon}</span>
                    <span className="leading-tight">{feature.title}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-theme-primary leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="program-details mt-4 md:mt-0 relative z-20">
            <div className="bg-theme-surface/30 p-3 rounded-xl shadow-theme-sm">
              <p className="text-center font-semibold text-sm sm:text-base md:text-lg text-theme-primary uppercase tracking-wider mb-4">
                Program Details
              </p>
              
              <div className="space-y-2 sm:space-y-3 mb-5">
                {programDetails.map((detail, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center justify-center p-2 transition rounded-lg text-center bg-theme-surface/20"
                  >
                    <div className="mb-1">
                      <div className="text-xs font-medium sm:text-sm uppercase tracking-wider">
                        {detail.label}
                      </div>
                    </div>
                    {detail.highlight ? (
                      <div className="inline-block px-2 py-1 rounded-full bg-theme-accent/20">
                        <VSText color="theme-accent" className="text-md sm:text-base font-bold">
                          {detail.value}
                        </VSText>
                      </div>
                    ) : (
                      <VSText color="theme-primary" className="text-sm sm:text-base font-bold">
                        {detail.value}
                      </VSText>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="cta-button mt-4 relative z-30">
                <button 
                  className="bg-theme-gradient-primary text-white w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold text-sm shadow-theme-sm hover-bubbly"
                  onClick={onApplyClick}
                >
                  <span>Get Your Plan</span>
                  <ArrowRightCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VSSection>
  );
};

export default VSBigReveal;