import React, { useState, useRef, FC } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JSX } from 'react/jsx-runtime';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Import only common Hero Icons
import { 
  UserIcon, 
  VideoCameraIcon, 
  PencilIcon, 
  DocumentIcon,
  ClockIcon,
  CogIcon, 
  CheckCircleIcon,
  BookOpenIcon,
  ChartBarIcon,
  StarIcon,
  BeakerIcon,
  CubeIcon,
  CurrencyPoundIcon
} from '@heroicons/react/24/solid';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Type definitions
interface Track {
  name: string;
  color: string;
  icon: JSX.Element;
}

interface Resource {
  type: 'PDF' | 'Workshop' | 'Test' | 'Video' | 'Template' | 'Worksheet' | 'Code' | 'System' | 'Framework';
  name: string;
}

interface ResourceColors {
  [key: string]: string;
}

interface Submodule {
  title: string;
  duration: string;
  resources: Resource[];
}

interface Module {
  id: string;
  title: string;
  track: Track;
  submodules: Submodule[];
  description?: string;
  difficulty?: string;
  durationHours?: number;
}

const ContentOverwhelmer: FC = () => {
  // State for expanded/collapsed view
  const [isExpanded, setIsExpanded] = useState(false);
  
  // State for active track and expanded module
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  
  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pathTween = useRef<gsap.core.Tween | null>(null);
  const animationsRef = useRef<(gsap.core.Timeline | gsap.core.Tween)[]>([]);
  const scrollTriggersRef = useRef<ScrollTrigger[]>([]);

  // Define tracks with their respective colors and Hero Icons
  const tracks: Track[] = [
    { name: "FOUNDER", color: "var(--theme-primary)", icon: <UserIcon className="w-5 h-5" /> },
    { name: "CREATOR", color: "var(--theme-primary-hover)", icon: <VideoCameraIcon className="w-5 h-5" /> },
    { name: "WRITER", color: "var(--theme-accent-secondary)", icon: <PencilIcon className="w-5 h-5" /> },
    { name: "EDITOR", color: "var(--theme-accent-secondary-light)", icon: <BeakerIcon className="w-5 h-5" /> },
    { name: "VIDEOGRAPHER", color: "var(--theme-accent-tertiary)", icon: <VideoCameraIcon className="w-5 h-5" /> },
  ];

  // Generate sample modules for display
  const generateSampleModules = (): Module[] => {
    return [
      {
        id: "1",
        title: "Short Form Video Strategy",
        track: tracks[0],
        description: "Learn the fundamentals of short-form video strategy",
        difficulty: "Beginner",
        durationHours: 2,
        submodules: [
          {
            title: "Platform Selection",
            duration: "25 min",
            resources: [{ type: "PDF", name: "Platform Comparison Guide" }]
          },
          {
            title: "Content Planning",
            duration: "30 min",
            resources: [{ type: "Template", name: "Content Calendar" }]
          }
        ]
      },
      {
        id: "2",
        title: "Camera Confidence",
        track: tracks[1],
        description: "Overcome camera anxiety and present with confidence",
        difficulty: "Intermediate",
        durationHours: 3,
        submodules: [
          {
            title: "Overcoming Camera Anxiety",
            duration: "20 min",
            resources: [{ type: "Video", name: "Practice Exercises" }]
          }
        ]
      }
    ];
  };

  // Sample modules
  const sampleModules = generateSampleModules();
  
  // Filtered modules based on active track
  const filteredModules = activeTrack 
    ? sampleModules.filter(module => module.track.name === activeTrack)
    : sampleModules;

  // Replace your animation setup with this
  useGSAP(() => {
    // Clear previous animations first
    if (animationsRef.current.length > 0) {
      animationsRef.current.forEach(anim => anim.kill());
      animationsRef.current = [];
    }
    
    if (scrollTriggersRef.current.length > 0) {
      scrollTriggersRef.current.forEach(st => st.kill());
      scrollTriggersRef.current = [];
    }
    
    // Use unique IDs for all scroll triggers
    const pathTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      end: "bottom 20%",
      id: "content-overwhelmer-path", // Unique ID
      onUpdate: (self) => {
        // Only create path animation if it doesn't exist
        if (!pathTween.current && pathRef.current) {
          const path = pathRef.current;
          const pathLength = path.getTotalLength();
          
          gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
          });
          
          pathTween.current = gsap.to(path, {
            strokeDashoffset: 0,
            duration: 3,
            ease: "power2.inOut",
            paused: true
          });
        }
        
        // Update animation progress
        if (pathTween.current) {
          pathTween.current.progress(self.progress);
        }
      }
    });
    
    scrollTriggersRef.current.push(pathTrigger);
    
    // Use lower stagger values and shorter durations
    const moduleElements = document.querySelectorAll('.module');
    if (moduleElements.length) {
      gsap.set(moduleElements, { opacity: 0, y: 20 });
      
      const modulesTl = gsap.to(moduleElements, {
        opacity: 1,
        y: 0,
        stagger: 0.005, // Reduced stagger value
        duration: 0.15, // Shorter duration
        ease: "power1.out",
        onComplete: () => {
          // Animate resource cards with much lighter animations
          animateResourceCards();
        }
      });
      
      animationsRef.current.push(modulesTl);
    }
    
    // Much lighter floating animations for resources
    function animateResourceCards() {
      const resourceCards = document.querySelectorAll('.resource-card');
      resourceCards.forEach(card => {
        // Skip animation for off-screen cards
        if (!isElementInViewport(card)) return;
        
        const tl = gsap.to(card, {
          // Extremely subtle movement
          y: () => Math.random() * 1 - 0.5,
          x: () => Math.random() * 0.7 - 0.35,
          rotation: () => Math.random() * 0.5 - 0.25,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
        animationsRef.current.push(tl);
      });
    }
    
    // Helper function to only animate visible elements
    function isElementInViewport(el: Element) {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (document.documentElement.clientWidth || document.documentElement.clientHeight) &&
        rect.right <= (document.documentElement.clientWidth || document.documentElement.clientWidth)
      );
    }
  }, { scope: containerRef });

  // Toggle expanded/collapsed view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Filter modules by track
  const filterByTrack = (trackName: string | null) => {
    setActiveTrack(trackName);
  };

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    setExpandedModuleId(prevId => prevId === moduleId ? null : moduleId);
  };

  // Helper function to get resource color
  const getResourceColor = (type: string): string => {
    const colors: ResourceColors = {
      'PDF': 'var(--theme-primary)',
      'Workshop': 'var(--theme-primary-hover)',
      'Test': 'var(--theme-accent-secondary)',
      'Video': 'var(--theme-accent-secondary-light)',
      'Template': 'var(--theme-accent-tertiary)',
      'Worksheet': 'var(--theme-accent-quaternary)',
      'Code': 'var(--theme-bg-primary)',
      'System': 'var(--theme-bg-secondary)',
      'Framework': 'var(--theme-text-secondary)'
    };
    return colors[type as keyof ResourceColors] || 'var(--theme-primary)';
  };
  
  // Helper function to get resource icon
  const getResourceIcon = (type: string): JSX.Element => {
    switch(type) {
      case 'PDF': return <DocumentIcon className="w-4 h-4" />;
      case 'Workshop': return <UserIcon className="w-4 h-4" />;
      case 'Test': return <CheckCircleIcon className="w-4 h-4" />;
      case 'Video': return <VideoCameraIcon className="w-4 h-4" />;
      case 'Template': return <DocumentIcon className="w-4 h-4" />;
      case 'Worksheet': return <DocumentIcon className="w-4 h-4" />;
      case 'Code': return <CogIcon className="w-4 h-4" />;
      case 'System': return <CogIcon className="w-4 h-4" />;
      case 'Framework': return <CubeIcon className="w-4 h-4" />;
      default: return <DocumentIcon className="w-4 h-4" />;
    }
  };

  return (
    <section className="bg-theme-gradient py-24 border-t border-theme-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-6 bg-theme-primary/10 backdrop-blur-sm px-4 py-2 rounded-full max-w-max border border-theme-primary/20 mx-auto transition-all transition-theme-normal">
            <span className="text-theme-primary font-semibold transition-colors transition-theme-normal">Comprehensive Curriculum</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative">
            <span className="text-theme-secondary font-bold transition-colors transition-theme-normal">
              Content That Overwhelms
            </span>
          </h2>
          <p className="text-xl text-theme-secondary/70 max-w-3xl mx-auto transition-colors transition-theme-normal">
            See exactly what you'll learn in each module of the program.
          </p>
        </div>

        <div className={`transition-all duration-500 ${isExpanded ? 'max-h-[2000px]' : 'max-h-[500px] overflow-hidden relative'}`}>
          <div className="bg-theme-content text-theme-primary py-14 w-full overflow-hidden relative transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">
            {/* Floating background elements to create visual overwhelm */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-lg opacity-10 transition-all duration-[500ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-150 hover:opacity-20"
                  style={{
                    width: 20 + Math.random() * 100,
                    height: 20 + Math.random() * 100,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    backgroundColor: tracks[i % tracks.length].color,
                    transform: `rotate(${Math.random() * 360}deg)`,
                    boxShadow: `0 0 20px ${tracks[i % tracks.length].color}40`,
                  }}
                />
              ))}
            </div>
            
            <div className="max-w-full mx-auto px-6 relative z-10">
              {/* Headline */}
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-4 relative inline-block">
                  <span className="text-theme-primary-light transition-colors transition-theme-normal">INSANE AMOUNT OF CONTENT</span>
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-theme-primary transform transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"></span>
                </h2>
                <p className="text-xl md:text-2xl max-w-4xl mx-auto text-theme-secondary mb-6 transition-colors transition-theme-normal">
                  No fluff. <span className="font-bold bg-theme-gradient-primary text-transparent bg-clip-text inline-block hover:scale-110 transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">178+ modules</span>, <span className="font-bold bg-theme-gradient-primary text-transparent bg-clip-text inline-block hover:scale-110 transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">450+ resources</span>, and <span className="font-bold bg-theme-gradient-primary text-transparent bg-clip-text inline-block hover:scale-110 transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]">1000+ hours</span> of content creation expertise.
                </p>
                
                {/* Resource types preview - overwhelming amount of resources */}
                <div className="flex justify-center flex-wrap gap-2 max-w-4xl mx-auto mb-8">
                  {[
                    {name: 'Workshops', icon: <BookOpenIcon className="w-4 h-4" />},
                    {name: 'PDFs', icon: <DocumentIcon className="w-4 h-4" />},
                    {name: 'Templates', icon: <DocumentIcon className="w-4 h-4" />},
                    {name: 'Frameworks', icon: <CubeIcon className="w-4 h-4" />},
                    {name: 'Systems', icon: <CogIcon className="w-4 h-4" />},
                    {name: 'Code Snippets', icon: <CogIcon className="w-4 h-4" />},
                    {name: 'Worksheets', icon: <CheckCircleIcon className="w-4 h-4" />},
                    {name: 'Swipe Files', icon: <DocumentIcon className="w-4 h-4" />},
                    {name: 'Checklists', icon: <CheckCircleIcon className="w-4 h-4" />},
                    {name: 'Video Tutorials', icon: <VideoCameraIcon className="w-4 h-4" />}
                  ].map((resource, i) => (
                    <div 
                      key={resource.name}
                      className="text-sm px-3 py-1.5 rounded-full flex items-center transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:translate-y-[-3px] hover:scale-[1.05] hover:shadow-md"
                      style={{ 
                        backgroundColor: `${tracks[i % tracks.length].color}30`,
                        borderLeft: `3px solid ${tracks[i % tracks.length].color}`,
                        boxShadow: `0 3px 10px ${tracks[i % tracks.length].color}20`
                      }}
                    >
                      <span className="mr-1.5">{resource.icon}</span>
                      {resource.name}
                    </div>
                  ))}
                </div>
                
                {/* Track Buttons */}
                <div className="flex justify-center flex-wrap mb-8 max-w-4xl mx-auto">
                  {tracks.map((track) => (
                    <button 
                      key={track.name}
                      onClick={() => filterByTrack(track.name)}
                      className={`group m-1.5 px-5 py-2.5 rounded-full border-2 transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center ${
                        activeTrack === track.name ? 'scale-105 shadow-xl translate-y-[-4px]' : 'hover:scale-105 hover:translate-y-[-4px] hover:shadow-lg'
                      }`}
                      style={{ 
                        borderColor: track.color, 
                        backgroundColor: activeTrack === track.name ? track.color : `${track.color}20`,
                        boxShadow: activeTrack === track.name ? `0 8px 20px ${track.color}40` : `0 4px 10px ${track.color}20`
                      }}
                    >
                      <span className="mr-2 text-theme-on-primary">{track.icon}</span>
                      <span className={`font-bold text-base ${activeTrack === track.name ? 'text-theme-on-primary' : ''}`}>{track.name}</span>
                      <span className={`ml-2 text-sm px-2 py-0.5 rounded-full ${
                        activeTrack === track.name ? 'bg-theme-on-primary/20 text-theme-on-primary' : 'bg-theme-on-primary/10 text-theme-on-primary'
                      }`}>TRACK</span>
                    </button>
                  ))}
                  
                  {activeTrack && (
                    <button 
                      onClick={() => filterByTrack(null)}
                      className="m-1.5 px-5 py-2.5 rounded-full border-2 border-theme-on-primary/30 transition-all hover:border-theme-on-primary/60"
                    >
                      <span className="font-bold text-base">SHOW ALL</span>
                    </button>
                  )}
                </div>
                
                {/* Filtered Results Count */}
                {activeTrack && (
                  <div className="text-theme-secondary text-lg mb-6 transition-colors transition-theme-normal">
                    Showing {filteredModules.length} modules for the {activeTrack} track
                  </div>
                )}
              </div>
              
              {/* Module visualization - larger 3 column grid */}
              <div ref={containerRef} className="relative pb-10 max-w-7xl mx-auto">
                {/* Connecting path */}
                <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 1 }}>
                  <path
                    ref={pathRef}
                    d="M50,50 C150,100 250,150 350,100 S450,50 550,100 S650,150 750,100 S850,50 950,100"
                    fill="none"
                    stroke="var(--theme-primary)" 
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="5,5"
                    className="path-animation"
                  />
                </svg>
                
                {/* "Value Explosion" elements - scattered content indicators */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const size = 30 + Math.random() * 60;
                    return (
                      <div
                        key={`value-${i}`}
                        className="absolute rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          width: size,
                          height: size,
                          top: `${10 + Math.random() * 80}%`,
                          left: `${Math.random() * 100}%`,
                          backgroundColor: `${tracks[i % tracks.length].color}20`,
                          border: `1px solid ${tracks[i % tracks.length].color}`,
                          opacity: 0.7,
                        }}
                      >
                        {i % 6 === 0 && <DocumentIcon className="w-5 h-5" />}
                        {i % 6 === 1 && <BookOpenIcon className="w-5 h-5" />}
                        {i % 6 === 2 && <StarIcon className="w-5 h-5" />}
                        {i % 6 === 3 && <CogIcon className="w-5 h-5" />}
                        {i % 6 === 4 && <CogIcon className="w-5 h-5" />}
                        {i % 6 === 5 && <StarIcon className="w-5 h-5" />}
                      </div>
                    );
                  })}
                </div>
                
                {/* Module grid - 3 columns with larger modules */}
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6">
                  {filteredModules.map((module) => (
                    <div 
                      key={module.id}
                      id={`module-${module.id}`}
                      onClick={() => toggleModule(module.id)}
                      className={`module p-5 rounded-lg backdrop-blur-sm bg-black/30 border transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer group ${
                        expandedModuleId === module.id 
                          ? 'border-theme-primary-light shadow-lg shadow-theme-primary/20 translate-y-[-8px] scale-[1.03] rotate-[0.5deg]'
                          : 'border-theme-accent-secondary/50 hover:border-theme-accent-secondary hover:translate-y-[-6px] hover:scale-[1.03] hover:shadow-lg hover:shadow-theme-primary/10 hover:rotate-[0.5deg]'
                      }`}
                      style={{
                        transform: `rotate(${Math.random() * 0.6 - 0.3}deg)`,
                        boxShadow: expandedModuleId === module.id ? `0 10px 30px rgba(254, 172, 109, 0.2)` : `0 4px 15px rgba(0, 0, 0, 0.3)`
                      }}
                    >
                      <div className="flex items-center mb-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mr-3 shadow-md transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125 group-hover:rotate-[5deg] group-hover:shadow-lg"
                          style={{ 
                            background: `linear-gradient(135deg, ${tracks[parseInt(module.id) % tracks.length].color} 0%, ${tracks[(parseInt(module.id) + 1) % tracks.length].color} 100%)`,
                            boxShadow: `0 4px 12px ${tracks[parseInt(module.id) % tracks.length].color}40`
                          }}
                        >
                          {parseInt(module.id) + 1}
                        </div>
                        <h3 className={`text-lg font-bold group-hover:text-theme-primary-light transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                          expandedModuleId === module.id ? 'text-theme-primary-light' : ''
                        }`}>
                          {module.title}
                        </h3>
                      </div>
                      
                      {/* Category tag */}
                      <div className="ml-12 mb-3">
                        <span className="text-sm px-2.5 py-1 rounded bg-theme-bg-secondary/30 text-theme-secondary transition-colors transition-theme-normal">
                          {module.track.name}
                        </span>
                      </div>
                      
                      {/* Track indicators */}
                      <div className="ml-12 flex mb-3">
                        {module.track.name.split(',').map((trackName, idx) => {
                          const track = tracks.find(t => t.name === trackName);
                          return track ? (
                            <div 
                              key={idx}
                              className="flex items-center mr-2 px-2 py-1 rounded-full text-sm" 
                              style={{ backgroundColor: `${track.color}40` }}
                              title={track.name}
                            >
                              <span className="mr-1.5 text-theme-on-primary">{track.icon}</span>
                              <span>{track.name.substring(0, 1)}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                      
                      {/* Resources - stacked with overlap for overwhelming effect */}
                      <div className="ml-10 flex flex-wrap relative">
                        {module.submodules.map((submodule, i) => (
                          <div 
                            key={i}
                            className="resource-card px-2.5 py-1 text-sm rounded mr-1.5 mb-1.5 flex items-center transition-transform hover:scale-105 hover:z-10 shadow-sm"
                            style={{ 
                              backgroundColor: getResourceColor(submodule.resources[0].type),
                              transform: `translateX(${i * -3}px) translateY(${i % 2 === 0 ? -2 : 2}px)`,
                              zIndex: module.submodules.length - i,
                            }}
                          >
                            {getResourceIcon(submodule.resources[0].type)}
                            <span className="ml-1.5">{submodule.resources[0].name.split(' ').slice(0, 2).join(' ')}</span>
                          </div>
                        ))}
                        
                        {/* Resource count badge */}
                        <div 
                          className="absolute right-0 -top-3 w-6 h-6 rounded-full bg-theme-accent-quaternary text-theme-on-primary text-xs flex items-center justify-center transition-colors transition-theme-normal"
                          title={`${module.submodules.length} resources`}
                        >
                          {module.submodules.length}
                        </div>
                      </div>
                      
                      {/* Expanded view when clicked */}
                      <div className="module-expanded-content overflow-hidden h-0 opacity-0">
                        <div className="mt-6 pt-4 border-t border-theme-accent-secondary/50 transition-colors transition-theme-normal">
                          {/* Module description */}
                          <div className="mb-4">
                            <h4 className="text-base font-bold mb-2 text-theme-primary-light transition-colors transition-theme-normal">About This Module:</h4>
                            <p className="text-theme-secondary/90 transition-colors transition-theme-normal">{module.description}</p>
                          </div>
                          
                          {/* Module metadata */}
                          <div className="flex flex-wrap gap-3 mb-4">
                            <div className="flex items-center bg-theme-bg-secondary/30 px-3 py-1.5 rounded">
                              <ChartBarIcon className="w-4 h-4 mr-1.5 text-theme-primary-light transition-colors transition-theme-normal" />
                              <span>{module.difficulty}</span>
                            </div>
                            <div className="flex items-center bg-theme-bg-secondary/30 px-3 py-1.5 rounded">
                              <ClockIcon className="w-4 h-4 mr-1.5 text-theme-primary-light transition-colors transition-theme-normal" />
                              <span>{module.durationHours} hours</span>
                            </div>
                          </div>
                          
                          {/* Submodules */}
                          <div className="mb-4">
                            <h4 className="text-base font-bold mb-2 text-theme-primary-light transition-colors transition-theme-normal">What You'll Learn:</h4>
                            <ul className="space-y-2.5 ml-1">
                              {module.submodules.map((submodule, idx) => (
                                <li key={idx} className="flex items-start">
                                  <div className="min-w-5 w-5 h-5 rounded-full bg-theme-accent-secondary flex items-center justify-center mr-3 mt-0.5 transition-colors transition-theme-normal">
                                    <span className="text-xs">{idx + 1}</span>
                                  </div>
                                  <div>
                                    <div className="font-medium">{submodule.title}</div>
                                    <div className="text-sm text-theme-secondary/70 transition-colors transition-theme-normal">{submodule.duration}</div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Resources */}
                          <div>
                            <h4 className="text-base font-bold mb-2 text-theme-primary-light transition-colors transition-theme-normal">Included Resources:</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {module.submodules.map((submodule, idx) => (
                                <div 
                                  key={idx}
                                  className="resource-full flex items-center p-2 rounded"
                                  style={{ backgroundColor: `${getResourceColor(submodule.resources[0].type)}30` }}
                                >
                                  {getResourceIcon(submodule.resources[0].type)}
                                  <span className="ml-2 text-sm">{submodule.resources[0].name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Overwhelming resource statistics */}
                <div className="bg-theme-bg-secondary/20 backdrop-blur-sm mt-10 p-5 rounded-lg border border-theme-primary/30 transition-colors transition-theme-normal">
                  <div className="text-xl font-bold mb-3 text-center text-theme-secondary transition-colors transition-theme-normal">WHAT YOU'RE GETTING</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { count: 178, label: "Modules", icon: <DocumentIcon className="w-5 h-5" /> },
                      { count: 42, label: "Workshops", icon: <BookOpenIcon className="w-5 h-5" /> },
                      { count: 89, label: "PDFs", icon: <DocumentIcon className="w-5 h-5" /> },
                      { count: 64, label: "Templates", icon: <DocumentIcon className="w-5 h-5" /> },
                      { count: 37, label: "Systems", icon: <CogIcon className="w-5 h-5" /> },
                      { count: 146, label: "Resources", icon: <CheckCircleIcon className="w-5 h-5" /> },
                    ].map((stat, i) => (
                      <div key={i} className="text-center p-3 bg-theme-bg-secondary/20 rounded">
                        <div className="flex justify-center mb-1">{stat.icon}</div>
                        <div 
                          className="stat-counter text-2xl font-bold text-theme-primary-light transition-colors transition-theme-normal" 
                          data-target={stat.count}
                        >
                          {stat.count}
                        </div>
                        <div className="text-sm uppercase tracking-wider mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Extra content metrics for overwhelming effect */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-3 bg-theme-bg-secondary/20 p-3 rounded">
                    <div className="w-10 h-10 rounded-full bg-theme-primary flex items-center justify-center transition-colors transition-theme-normal">
                      <DocumentIcon className="w-6 h-6 text-theme-on-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-theme-secondary/70 transition-colors transition-theme-normal">CONTENT LENGTH</div>
                      <div className="font-bold text-lg">1,000+ Hours</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-theme-bg-secondary/20 p-3 rounded">
                    <div className="w-10 h-10 rounded-full bg-theme-accent-secondary flex items-center justify-center transition-colors transition-theme-normal">
                      <BookOpenIcon className="w-6 h-6 text-theme-on-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-theme-secondary/70 transition-colors transition-theme-normal">EXPERIENCE LEVEL</div>
                      <div className="font-bold text-lg">Beginner to Expert</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-theme-bg-secondary/20 p-3 rounded">
                    <div className="w-10 h-10 rounded-full bg-theme-accent-tertiary flex items-center justify-center transition-colors transition-theme-normal">
                      <CogIcon className="w-6 h-6 text-theme-on-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-theme-secondary/70 transition-colors transition-theme-normal">UPDATES</div>
                      <div className="font-bold text-lg">Monthly New Content</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-theme-bg-secondary/20 p-3 rounded">
                    <div className="w-10 h-10 rounded-full bg-theme-accent-quaternary flex items-center justify-center transition-colors transition-theme-normal">
                      <CurrencyPoundIcon className="w-6 h-6 text-theme-on-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-theme-secondary/70 transition-colors transition-theme-normal">VALUE</div>
                      <div className="font-bold text-lg">£50,000+</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Content organization preview - to show structure amid overwhelm */}
              <div className="max-w-5xl mx-auto my-10 bg-theme-bg-primary/60 p-5 rounded-lg border border-theme-accent-secondary transition-all transition-theme-normal">
                <div className="text-center mb-5">
                  <div className="text-2xl font-bold text-theme-primary-light transition-colors transition-theme-normal">CONTENT ORGANIZATION</div>
                  <p className="text-base text-theme-secondary/80 transition-colors transition-theme-normal">All meticulously structured for your learning journey</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-theme-bg-secondary/20 rounded-lg">
                    <div className="text-lg text-theme-primary-light font-bold mb-3 transition-colors transition-theme-normal">FOUNDATIONS</div>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-theme-primary-light rounded-full mr-2 transition-colors transition-theme-normal"></span>
                        <span>Theory Basics (12 modules)</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-theme-primary-light rounded-full mr-2 transition-colors transition-theme-normal"></span>
                        <span>Platform Mechanics (9 modules)</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-theme-primary-light rounded-full mr-2 transition-colors transition-theme-normal"></span>
                        <span>Content Framework (15 modules)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-theme-bg-secondary/20 rounded-lg">
                    <div className="text-lg text-theme-accent-tertiary font-bold mb-3 transition-colors transition-theme-normal">PRODUCTION</div>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-theme-accent-tertiary rounded-full mr-2 transition-colors transition-theme-normal"></span>
                        <span>Filming & Editing (18 modules)</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-theme-accent-tertiary rounded-full mr-2 transition-colors transition-theme-normal"></span>
                        <span>Script Writing (14 modules)</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-theme-accent-tertiary rounded-full mr-2 transition-colors transition-theme-normal"></span>
                        <span>Production Value (11 modules)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-theme-bg-secondary/20 rounded-lg">
                    <div className="text-lg text-theme-accent-secondary font-bold mb-3 transition-colors transition-theme-normal">GROWTH</div>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-theme-accent-secondary rounded-full mr-2 transition-colors transition-theme-normal"></span>
                        <span>Algorithmic Strategy (16 modules)</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-theme-accent-secondary rounded-full mr-2 transition-colors transition-theme-normal"></span>
                        <span>Audience Building (13 modules)</span>
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-theme-accent-secondary rounded-full mr-2 transition-colors transition-theme-normal"></span>
                        <span>Monetization (15 modules)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-theme-bg-primary to-transparent transition-all transition-theme-normal" />
          )}
        </div>

        <div className="text-center mt-8">
          <Button
            onClick={toggleExpanded}
            variant="glow"
            className="gap-2 bg-theme-primary/10 border-theme-primary/30 text-theme-primary-light hover:bg-theme-primary/20 hover:border-theme-primary/50 hover:shadow-theme-glow hover:translate-y-[-6px] hover:scale-[1.04] transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-[-2px]" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-[2px]" />
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContentOverwhelmer;