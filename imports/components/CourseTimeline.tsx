import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { useGSAP } from "@gsap/react";
import '../styles/week-by-week.css';

// Register the ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Define types for course weeks
interface CourseWeek {
  id: string;
  week: string;
  title: string;
  content: string;
  icon?: string;
  highlight?: string;
  founderTip?: string;
  bullets?: string[];
  modules?: string[];
}

// Dropdown component for timeline items
const TimelineDropdown: React.FC<{
  week: CourseWeek;
  weekColor: string;
  isOpen: boolean;
  toggleOpen: () => void;
}> = ({ week, weekColor, isOpen, toggleOpen }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(document.documentElement.clientWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Animation for dropdown content
  useGSAP(() => {
    if (!contentRef.current) return;
    
    // Get theme variables
    const styles = getComputedStyle(document.documentElement);
    const animDuration = isMobile ? 0.2 : parseFloat(styles.getPropertyValue('--theme-anim-duration') || '0.35');
    
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(contentRef.current, { 
        height: 0,
        opacity: 0,
        overflow: 'hidden'
      });
      
      // Toggle animation based on isOpen state
      if (isOpen) {
        gsap.to(contentRef.current, {
          height: 'auto',
          opacity: 1,
          duration: animDuration * 1.0,
          ease: 'power2.out'
        });
        
        // Rotate arrow
        if (arrowRef.current) {
          gsap.to(arrowRef.current, {
            rotation: 180,
            duration: animDuration,
            ease: isMobile ? 'power1.out' : 'back.out(1.7)'
          });
        }
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: animDuration * 0.8,
          ease: 'power2.in'
        });
        
        // Rotate arrow back
        if (arrowRef.current) {
          gsap.to(arrowRef.current, {
            rotation: 0,
            duration: animDuration,
            ease: isMobile ? 'power1.in' : 'back.in(1.7)'
          });
        }
      }
    }, dropdownRef);
    
    return () => ctx.revert();
  }, [isOpen, isMobile]);
  
  // Animation for dropdown underline - only for desktop
  useGSAP(() => {
    if (!underlineRef.current || !dropdownRef.current || isMobile) return;
    
    const ctx = gsap.context(() => {
      // Animate underline on hover
      dropdownRef.current?.addEventListener('mouseenter', () => {
        gsap.to(underlineRef.current, {
          width: '100%',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      dropdownRef.current?.addEventListener('mouseleave', () => {
        if (!isOpen) {
          gsap.to(underlineRef.current, {
            width: '30%',
            opacity: 0.7,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    }, dropdownRef);
    
    return () => ctx.revert();
  }, [isOpen, isMobile]);
  
  return (
    <div ref={dropdownRef} className="timeline-dropdown mb-2">
      {/* Dropdown header with VS Bubbly hover effect */}
      <div 
        onClick={toggleOpen}
        className="timeline-dropdown-header flex items-center gap-3 cursor-pointer transition-all duration-300 hover-bubbly-sm"
      >
        {/* Only highlight text */}
        <div className="flex-1">
          {/* Highlight text (not truncated) */}
          {week.highlight && (
            <p className="text-theme-secondary text-sm md:text-base pr-8">
              {week.highlight}
            </p>
          )}
          
          {/* Orange underline */}
          <div 
            ref={underlineRef}
            className="timeline-dropdown-underline bg-theme-primary h-[2px] mt-1 rounded-full opacity-70"
            style={{ 
              width: isOpen || isMobile ? '100%' : '30%',
              backgroundColor: weekColor 
            }}
          ></div>
        </div>
        
        {/* Dropdown arrow */}
        <div 
          ref={arrowRef}
          className="timeline-dropdown-arrow text-theme-primary text-xl transform transition-transform"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
      
      {/* Dropdown content - collapsed by default */}
      <div 
        ref={contentRef}
        className="timeline-dropdown-content overflow-hidden"
      >
        <div className="pt-2 px-2">
          <div 
            className={`content timeline-card week-${week.id.replace('week', '')}-card rounded-lg p-4 md:p-6 relative overflow-hidden bg-theme-surface shadow-theme-md border-l-[4px]`}
            style={{ borderColor: weekColor }}
          >
            {/* Main content paragraph - not truncated */}
            <p className="text-theme-secondary relative z-10 text-base md:text-lg leading-normal">
              {week.content.split('\n\n')}
            </p>
            
            {/* Bullet points for easy scanning - show all */}
            {week.bullets && week.bullets.length > 0 && (
              <ul className="week-bullets mt-2 pl-4">
                {week.bullets.map((bullet, idx) => (
                  <li key={`${week.id}-bullet-${idx}`} className="text-theme-secondary text-sm md:text-base leading-normal list-disc">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
            
            {/* Founder tips */}
            {week.founderTip && (
              <div className="founder-tip text-theme-secondary text-sm md:text-base italic mt-2">
                {week.founderTip}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const CourseTimeline: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Track open/closed state for dropdowns
  const [openWeeks, setOpenWeeks] = useState<string[]>([]);
  
  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(document.documentElement.clientWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Toggle dropdown function
  const toggleWeekOpen = (weekId: string) => {
    setOpenWeeks(prev => 
      prev.includes(weekId)
        ? prev.filter(id => id !== weekId)
        : [...prev, weekId]
    );
  };
  
  // Define simple color themes for each week (not modules)
  const getWeekColors = (weekId: string): string => {
    const colorMap: Record<string, string> = {
      'week0': 'var(--hud-teal)',
      'week1': 'var(--primary-orange)',
      'week2': 'var(--hud-coral)',
      'week3': 'var(--accent-coral)',
      'week4': 'var(--secondary-teal)',
      'week5': 'var(--accent-pink)',
      'week6': 'var(--accent-yellow)',
      'week7': 'var(--hud-red)',
      'week8': 'var(--secondary-teal-light)',
      'week9-10': 'var(--primary-orange-light)',
      'week10plus': 'var(--hud-orange)',
    };
    
    return colorMap[weekId] || 'var(--primary-orange)';
  };

  const courseWeeks: CourseWeek[] = [
    {
      id: 'week0',
      week: 'Week 0',
      title: 'For the Nerds',
      icon: '🧠',
      highlight: 'Immediate access to our exclusive founder community and all upskiller sections for your team.',
      content: `Once your application has gone through you'll have immediate access to our first week of content: The basic theory plus all three upskiller sections for your team. AND immediate access to our exclusive founder community. We'd recommend you start watching the content as soon as you get access (or getting your team to watch it and summarise it), so you can feel smarter than everyone else in the first group call.`,
      bullets: [
        'Get a head start with the basic theory content',
        'Access upskiller sections for your team',
        'Join the exclusive founder community'
      ]
    },
    {
      id: 'week1',
      week: 'Week 1',
      title: 'Theory',
      icon: '💡',
      highlight: 'Your brain will be 50% bigger with all the key theory, algorithms, and strategies.',
      founderTip: 'Have your team watch the content and summarize the key points for you - this saves valuable founder time while ensuring your team is aligned with your vision.',
      content: 'At the end of this week you\'ll be exhausted, but your brain will probably be 50% bigger. You\'ll have the basic theory down, the dos and don\'ts of short form, how to actually \'hack\' the algorithm. Plus all the knowledge to write a good hook, a good script, feel good on camera, AND you\'ll come away with a unique content strategy personalised to you ready to start posting immediately. We did say it\'s a lot. PLUS. Your team will have access to everything they need in the upskillers to start mastering researching, scripting, filming and editing. At the end of this week we\'ll have our first group call, with the other founders in the community. This week we\'ll focus on introductions, getting to know each other, and help on refining your content strategy. Plus answering the many questions I\'m sure you\'ll have.',
      bullets: [
        'Master the algorithm and short form dos & don\'ts',
        'Learn compelling hook and script writing',
        'Develop your personalized content strategy',
        'Join our first community group call'
      ]
    },
    {
      id: 'week2',
      week: 'Week 2',
      title: 'Authority',
      icon: '👑',
      highlight: 'Learn how to position yourself as the go-to expert in your field through short-form content.',
      content: 'It\'s all well and good making good short form content. But you want more than that - you want to be an authority. At the end of this week you\'ll know all there is to know about building authority on short form, at all levels, specifically as a founder. You\'ll learn how to build authority into your strategy, embed it into your content, and engage with your audience. The group coaching call at the end of this week will focus on how to tailor this authority to your specific niche, business, and personality.',
      bullets: [
        'Build authority-focused content strategy',
        'Learn to embed authority signals in your videos',
        'Master audience engagement techniques',
        'Personalize authority tactics to your niche'
      ]
    },
    {
      id: 'week3',
      week: 'Week 3',
      title: 'Advanced Theory',
      icon: '🚀',
      highlight: 'Take it up a notch with advanced hooking, engagement and storytelling techniques.',
      founderTip: 'The founder paradox is real - your audience wants authenticity but also expertise. This week helps you balance both effectively.',
      content: 'Time to take it up a notch. All that theory you\'ve spent weeks learning? There\'s even more. At the end of this week you\'ll know all the advanced techniques we use for hooking, engagement, storytelling and iteration, to build the best content possible. Plus we\'ll finally address the founder paradox you\'ll definitely be running into… The call at the end of this week will focus on putting all of this theory into practice with a group workshop.',
      bullets: [
        'Master advanced hooking techniques',
        'Learn sophisticated engagement strategies',
        'Understand the founder paradox and how to overcome it',
        'Apply advanced theory in practical workshop'
      ]
    },
    {
      id: 'week4',
      week: 'Week 4',
      title: 'Reading week',
      icon: '📚',
      highlight: 'Take a breather, practice what you\'ve learned, or catch up on missed content.',
      content: 'The first few weeks may be heavy, and we know you\'re busy, so take this week as a breather. You can use it to catch up on theory you may have missed, start practicing everything you\'ve learnt so far with your team, or just go on holiday. But if you do go on holiday, make sure to log on for the group call at the end of the week (no rest for us). This one will be an open Q&A and we promise no question is off the table (no matter how stupid) so everyone feels up to date and confident in the content so far.',
      bullets: [
        'Catch up on any missed content',
        'Begin practicing with your team',
        'Join the week\'s open Q&A session',
        'Ask ANY question (nothing is off limits!)'
      ]
    },
    {
      id: 'week5',
      week: 'Week 5',
      title: 'Delegation',
      icon: '👥',
      highlight: 'Transform your team into an efficient in-house content machine with minimal founder input.',
      founderTip: 'This is where your time investment starts to decrease dramatically. Set up systems this week that will save you hundreds of hours later.',
      content: 'Maybe your team had a nice break last week. Maybe not. Either way it\'s now time to give them more work. At the end of week 5 you\'ll know exactly how to manage your creative team, and turn them into the efficient in-house content machine you\'ve always dreamed of. The week 5 group call will focus on how to efficiently get your team to execute your vision, and create content that represents you, with minimal founder time and input.',
      bullets: [
        'Learn effective creative team management',
        'Build systems for consistent content creation',
        'Create workflows that minimize founder input',
        'Maintain quality while scaling production'
      ]
    },
    {
      id: 'week6',
      week: 'Week 6',
      title: 'Monetisation',
      icon: '💰',
      highlight: 'Everyone\'s favorite part — turn those views into actual revenue.',
      content: 'Views are great. But we all know why you\'re really doing this course. At the end of this week you\'ll know everything we know (so everything there is to know) on lead mags, CTAs, the creator fund, speaking engagements and sponsorship deals. The call at the end of this week will be focussed on which monetisation option is best for you.',
      bullets: [
        'Master lead magnets and effective CTAs',
        'Learn to leverage the creator fund',
        'Secure speaking engagements',
        'Negotiate profitable sponsorship deals',
        'Identify your optimal monetization path'
      ]
    },
    {
      id: 'week7',
      week: 'Week 7',
      title: 'Conversion',
      icon: '🎯',
      highlight: 'Turn views into paying customers with short-form funnels and expert conversion tactics.',
      content: 'By week 7, the views will be coming in, and now it\'s time to convert them into paying customers or leads. After watching this week\'s modules you\'ll learn about every type of short-form funnel, whether its direct to your website, your lead magnet, or another platform — and how to make people actually click on it. This group call will be our last one on course content (congrats you\'ve made it this far) and will centre around the best conversion strategy for your business.',
      bullets: [
        'Master short-form conversion funnels',
        'Drive traffic to websites, lead magnets, and platforms',
        'Increase click-through rates with proven tactics',
        'Develop a tailored conversion strategy for your business'
      ]
    },
    {
      id: 'week8',
      week: 'Week 8',
      title: 'Dark Arts',
      icon: '✨',
      highlight: 'Implement everything you\'ve learned and get hands-on troubleshooting for your content.',
      founderTip: 'This is when most founders see their first viral hit—because you now have all the knowledge but haven\'t overthought implementation yet.',
      content: 'We\'ve taught you everything we know. Now it\'s time to put it all into practice. Be brave and try it out yourself this week, no hand holding… …Well a bit of hand holding. This week\'s call will be an open Q&A where we\'ll troubleshoot, advice and analyse everything you\'ve been through in your first week out in the wild.',
      bullets: [
        'Put everything into practice',
        'Create and publish your first content pieces',
        'Get real-time feedback and analysis',
        'Troubleshoot and optimize on the fly'
      ]
    },
    {
      id: 'week9-10',
      week: 'Week 9-10',
      title: 'Expert Support',
      icon: '🤝',
      highlight: 'Book a personalized 45-minute call with any of our experts for dedicated help.',
      content: 'Yes. But we assume you\'ll still want some help. So in this two week period you and/or your team can book in a personalised 45 minute call with any one of our experts you desire. We\'ll help in any way we can to get your content up and running smoothly.',
      bullets: [
        'Schedule a personalized expert call',
        'Address specific challenges in your content',
        'Get tailored advice for your business',
        'Fine-tune your content creation machine'
      ]
    },
    {
      id: 'week10plus',
      week: 'Week 10+',
      title: 'Alumni Status',
      icon: '🎓',
      highlight: 'Lifetime access to all resources, videos, and our founder community.',
      content: 'But don\'t forgot you\'ll continue to have lifetime access to all the course resources and videos. Plus whether you\'re looking for advice (or just wanting a chat) you\'ll still have direct communication with the founder community and our team of experts. We\'re not going anywhere. Also i\'m in love with you.',
      bullets: [
        'Ongoing access to all course content',
        'Continued founder community participation',
        'Direct access to our team of experts',
        'Stay up-to-date with short-form best practices'
      ]
    }
  ];

  useGSAP(() => {
    if (!timelineRef.current || !titleRef.current || !introRef.current) return;
    
    // Get theme variables for animations
    const styles = getComputedStyle(document.documentElement);
    const animDuration = parseFloat(styles.getPropertyValue('--theme-anim-duration') || '0.35');

    // For mobile - set everything to final state immediately (no animations)
    if (isMobile) {
      // Set title and intro to final state with no animations
      gsap.set(titleRef.current, { opacity: 1, y: 0 });
      gsap.set(introRef.current, { opacity: 1, y: 0 });
      
      // Set all week headers to final state
      sectionRefs.current.forEach((section) => {
        if (!section) return;
        
        const weekTitle = section.querySelector('.week-title');
        const weekNumber = section.querySelector('.week-number');
        const circle = section.querySelector('.timeline-circle');
        
        if (weekTitle) gsap.set(weekTitle, { opacity: 1, x: 0 });
        if (weekNumber) gsap.set(weekNumber, { opacity: 1, y: 0, scale: 1 });
        if (circle) gsap.set(circle, { scale: 1, opacity: 1 });
      });
      
      // Still keep the progress bar animation but with minimal effect
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { height: '0%' },
          {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 20%',
              end: 'bottom 80%',
              scrub: 0.2, // Faster scrub for mobile
              markers: false,
              pinSpacing: false
            }
          }
        );
      }
      
      return;
    }
    
    // Desktop animations remain similar to original
    // Split text into spans for animations - only for desktop
    const splitText = (): void => {
      const elements = document.querySelectorAll('[data-text-split]');
      elements.forEach(element => {
        new SplitType(element as HTMLElement, {
          types: 'words, chars',
          reduceWhiteSpace: false,
          tagName: 'span',
        });
      });
    };
    
    // Create header animations
    const createHeaderAnimations = (): void => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 30
          },
          {
            opacity: 1,
            y: 0,
            duration: animDuration * 2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
            }
          }
        );
      }
      
      if (introRef.current) {
        gsap.fromTo(
          introRef.current,
          {
            opacity: 0,
            y: 20
          },
          {
            opacity: 1,
            y: 0,
            duration: animDuration * 1.5,
            delay: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: introRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    };
    
    // Create timeline line animation with enhanced scrub effect
    const createLineAnimation = (): void => {
      if (progressBarRef.current && timelineRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { height: '0%' },
          {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 20%',
              end: 'bottom 80%',
              scrub: 0.6,
              markers: false,
              pinSpacing: false
            }
          }
        );
      }
    };
    
    // Animate week sections (left side)
    const animateWeekHeaders = (): void => {
      sectionRefs.current.forEach((section) => {
        if (!section) return;
        
        // Animate week title text (primary now)
        const weekTitle = section.querySelector('.week-title');
        if (weekTitle) {
          gsap.fromTo(
            weekTitle,
            {
              opacity: 0.3,
              x: -20
            },
            {
              opacity: 1,
              x: 0,
              duration: animDuration * 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        
        // Animate week number (big thin number above title)
        const weekNumber = section.querySelector('.week-number');
        if (weekNumber) {
          gsap.fromTo(
            weekNumber,
            {
              opacity: 0.2,
              y: -10,
              scale: 0.95
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: animDuration * 1.2,
              ease: 'power2.out',
              delay: 0.05,
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
        
        // Animate timeline circle
        const circle = section.querySelector('.timeline-circle');
        if (circle) {
          gsap.fromTo(
            circle,
            {
              scale: 0.5,
              opacity: 0
            },
            {
              scale: 1,
              opacity: 1,
              duration: animDuration,
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: section,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      });
    };
    
    // Initialize animations for desktop only
    splitText();
    
    // Need a small delay to ensure DOM is fully updated after splitting text
    setTimeout(() => {
      createHeaderAnimations();
      createLineAnimation();
      animateWeekHeaders();
    }, 100);
    
  }, [isMobile]);

  // Save section refs
  const addToRefs = (el: HTMLDivElement | null): void => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <section id="curriculum" className="py-8 md:py-12 relative overflow-visible bg-theme-primary" style={{ background: "var(--theme-bg-primary)" }}>
      {/* Theme-aware floating elements for visual interest - hide on mobile */}
      <div className="absolute top-20 left-10 w-16 h-16 rounded-[40%] rotate-12 
                    opacity-[var(--theme-float-opacity)]
                    bg-[var(--theme-float-bg-primary)]
                    animate-float-slow hidden md:block"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 rounded-[30%] -rotate-6 
                    opacity-[var(--theme-float-opacity)]
                    bg-[var(--theme-float-bg-secondary)]
                    animate-float-medium hidden md:block"></div>
      
      <div className="w-full max-w-[750px] mx-auto px-4 md:px-8 relative z-10 overflow-visible">
        <div className="max-w-4xl mx-auto text-center mb-4 md:mb-6">
          <h2 
            ref={titleRef}
            data-text-split={!isMobile ? "true" : "false"}
            className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-theme-primary"
            style={{ opacity: isMobile ? 1 : undefined }}
          >
            Week by week structure
          </h2>
          <p 
            ref={introRef}
            className="text-lg md:text-xl lg:text-2xl text-theme-secondary max-w-3xl mx-auto"
            style={{ opacity: isMobile ? 1 : undefined }}
          >
            From short form newbie to millions of views in just 8(ish) weeks.
          </p>
        </div>
        
        <div 
          ref={timelineRef}
          className="timeline-container relative mt-4 md:mt-6"
        >
          {/* Timeline progress bar - positioned with absolute placement */}
          <div className="absolute left-8 md:left-14 top-6 bottom-0 w-[2px] md:w-[3px] bg-theme-bg-secondary opacity-30">
            <div 
              ref={progressBarRef}
              className="timeline-progress-bar absolute top-0 left-0 w-full origin-top h-0" 
            ></div>
          </div>
          
          {/* Timeline items */}
          <div className="relative z-10 space-y-2 md:space-y-3 max-w-[650px] mx-auto">
            {courseWeeks.map((week) => (
              <div 
                key={week.id}
                id={week.id}
                ref={addToRefs}
                className="timeline-week relative pl-12 md:pl-20"
              >
                {/* Circle marker on timeline */}
                <div 
                  className={`timeline-circle week-${week.id.replace('week', '')}-circle absolute left-8 md:left-14 top-6 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 shadow-theme-sm z-10 border-theme-surface`}
                  style={{ 
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: getWeekColors(week.id),
                    opacity: isMobile ? 1 : undefined,
                    scale: isMobile ? 1 : undefined
                  }}
                ></div>
                
                {/* Left side information */}
                <div className="flex flex-col items-start mb-1">
                  {/* Week number as big, thin font */}
                  <span 
                    className="week-number text-theme-primary text-lg md:text-xl font-extralight tracking-wider mb-0 opacity-90" 
                    style={{ 
                      opacity: isMobile ? 1 : undefined,
                      letterSpacing: '0.05em',
                      transform: isMobile ? 'none' : undefined
                    }}
                  >
                    {week.id === 'week9-10' 
                      ? '09' 
                      : week.id === 'week10plus' 
                        ? '10+'

                        : week.week.replace('Week ', '').padStart(2, '0')}
                  </span>
                  
                  {/* Week title (PRIMARY) - much smaller size */}
                  <h3 className="week-title vs-text-gradient-orange text-xs md:text-sm font-normal" style={{ opacity: 1 }}>
                    {week.title}
                  </h3>
                </div>
                
                {/* Expandable content section */}
                <TimelineDropdown
                  week={week}
                  weekColor={getWeekColors(week.id)}
                  isOpen={openWeeks.includes(week.id)}
                  toggleOpen={() => toggleWeekOpen(week.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseTimeline;