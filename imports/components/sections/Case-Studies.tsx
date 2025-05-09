import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Section } from "../ui/section";
import { AnimatedButton } from "../marble-buttons/AnimatedButton";

// Import creator case study data from the database via course-utils
import courseUtils, { Creator } from "../../lib/course-utils";
import { avatarImages } from "@/utils/importImages";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Set ScrollTrigger defaults for better performance
ScrollTrigger.config({
  ignoreMobileResize: true, // Reduces updates during mobile resize events
  fastScrollEnd: true // Improves performance on fast scrolling
});

// Define viewport breakpoints for responsive design
const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
};

// Extend Creator interface to support our image mapping system
interface EnhancedCreator extends Creator {
  // Original property might be a string path
  avatarSrc?: string;
}

// Custom CSS class to be added for hiding scrollbars
// We'll use this with a regular div instead of a styled component
const SCROLLBAR_HIDE_CLASS = "scrollbar-hide";

// Define component p rops interface
interface CaseStudiesProps {
  onCtaClick?: () => void;
}

// Type for ScrollTrigger instance
type ScrollTriggerInstance = ReturnType<typeof ScrollTrigger.create>;

// Helper to resolve avatar path using image mapper
const resolveAvatar = (path: string): string => {
  // Try full path match first
  if (avatarImages[path as keyof typeof avatarImages]) {
    return avatarImages[path as keyof typeof avatarImages] as string;
  }
  // Fallback to filename (without extension) match
  const fileName = path.split("/").pop()?.replace(/\.[^/.]+$/, "");
  if (fileName) {
    // Try exact filename
    if (avatarImages[fileName as keyof typeof avatarImages]) {
      return avatarImages[fileName as keyof typeof avatarImages] as string;
    }
    // Try replacing underscores with dashes
    const dashed = fileName.replace(/_/g, "-");
    if (avatarImages[dashed as keyof typeof avatarImages]) {
      return avatarImages[dashed as keyof typeof avatarImages] as string;
    }
  }
  // Default to original path if no match found
  return path;
};

// Get creators data from the database with a fallback for UI display
const creators: EnhancedCreator[] =
  courseUtils.getCreators().length > 0
    ? courseUtils.getCreators().map((creator) => ({
        ...creator,
        // Ensure avatar paths are correct and mapped via image mapper
        avatar: resolveAvatar(
          creator.avatar.startsWith("/")
            ? creator.avatar
            : `src/assets/main/Clients-webp-300px/${creator.avatar}`,
        ),
      }))
    : [
        {
          id: 1,
          name: "Chris Donnelly",
          avatar: "src/assets/main/Clients-webp-300px/Chris_Donnelly.avif",
          description:
            "Chris Donnelly is the founder of luxury digital marketing agency Verb, the cofounder of Lottie, a tech startup for social care, plus an investor, author, speaker and creator. He is now the founder of the creator accelerator, and host of the Wake Up podcast.\nWe started working with Chris in 2022, and grew his TikTok and Instagram accounts from 1k to 1m followers, in just under 2 years, amassing over 250 million views. His account focusses on business, management, leadership and investment.",
          data: [
            { month: "Mar", views: 5500, followers: 2253, interactions: 840 },
            {
              month: "Apr",
              views: 4779726,
              followers: 14679,
              interactions: 294209,
            },
            {
              month: "Jun",
              views: 21365179,
              followers: 72955,
              interactions: 1215532,
            },
            {
              month: "Jul",
              views: 30939528,
              followers: 112591,
              interactions: 1777674,
            },
            {
              month: "Nov",
              views: 60280586,
              followers: 270903,
              interactions: 3510967,
            },
            {
              month: "Feb",
              views: 136764121,
              followers: 673444,
              interactions: 3510967,
            },
          ],
          totals: {
            views: 168427385 + 102432554,
            followers: 509736 + 397154,
            interactions: 7746523,
          },
        },
        {
          id: 2,
          name: "Charlotte Mair",
          avatar: "src/assets/main/Clients-webp-300px/Charlotte_mair.avif",
          description:
            "Charlotte Mair is the Founder and Managing Director of award winning culture and communications agency, The Fitting Room, a cultural forecaster, speaker, and brand strategist.\nWe started working with Charlotte in October of 2024, and in just 6 months she's built 170k followers across her TikTok and YouTube, and amassed 28 million views. Her account focusses on all things marketing, pop culture and business.",
          data: [
            { month: "Oct", views: 30800, followers: 594, interactions: 347 },
            {
              month: "Nov",
              views: 2504982,
              followers: 6400 + 11390,
              interactions: 63745,
            },
            {
              month: "Dec",
              views: 17493045,
              followers: 69983 + 19796,
              interactions: 1267938,
            },
            {
              month: "Jan",
              views: 21878423,
              followers: 94881 + 28300,
              interactions: 1629321,
            },
            {
              month: "Feb",
              views: 26359144,
              followers: 109125 + 41105,
              interactions: 2077460,
            },
            {
              month: "Mar",
              views: 34698532,
              followers: 178638,
              interactions: 2906438,
            },
          ],
          totals: { views: 34698532, followers: 178638, interactions: 2906438 },
        },
        {
          id: 3,
          name: "James Watt",
          avatar: "src/assets/main/Clients-webp-300px/James_Watt.avif",
          description:
            "James Watt is the co-founder and captain of BrewDog the biggest independent beer company on the planet. He's also a best-selling author, investor, North Atlantic captain and the founder of Social Tip, the platform that makes 'anyone an influencer'. \nWe started working with James at the end of 2024 and together grew an audience of 15k followers and 20 million views in just 2 months on TikTok alone. His account focusses on business, beer and lobster fishing (of course).",
          data: [
            { month: "Oct", views: 0, followers: 0, interactions: 0 },
            {
              month: "Nov",
              views: 7123640,
              followers: 7649,
              interactions: 232779,
            },
            {
              month: "Dec",
              views: 9456943,
              followers: 11265,
              interactions: 291559,
            },
            {
              month: "Jan",
              views: 9880702,
              followers: 11611,
              interactions: 304054,
            },
          ],
          totals: { views: 9880702, followers: 11611, interactions: 304054 },
        },
        {
          id: 4,
          name: "Ben Askins",
          avatar: "src/assets/main/Clients-webp-300px/Ben_Askins.avif",
          description:
            "Ben Askins is the co-founder of Gaia, a green tech company that helps businesses hit environmental targets efficiently. He alsoo co-founded Verb Brands alongside Chris Donnelly.\nWe started working with Ben in 2022, and grew his audience to 1 million followers across TikTok and Instagram, hitting an insane 387 million views in under 7 months. His account focusses on business, management and genZ.",
          data: [
            { month: "Feb", views: 7263, followers: 104, interactions: 197 },
            {
              month: "Mar",
              views: 420099,
              followers: 1248,
              interactions: 42877,
            },
            {
              month: "Apr",
              views: 4669887,
              followers: 1913,
              interactions: 300616,
            },
            {
              month: "May",
              views: 19004595,
              followers: 52343,
              interactions: 1576752,
            },
            {
              month: "Jun",
              views: 40342874,
              followers: 167153,
              interactions: 3145698,
            },
            {
              month: "Jul",
              views: 57794777,
              followers: 264207,
              interactions: 4458406,
            },
            {
              month: "Aug",
              views: 68410279,
              followers: 287704,
              interactions: 5196815,
            },
            {
              month: "Sep",
              views: 83934226,
              followers: 346018,
              interactions: 6476592,
            },
            {
              month: "Nov",
              views: 124724682,
              followers: 450644,
              interactions: 9287518,
            },
            {
              month: "Jan",
              views: 209465478,
              followers: 655586,
              interactions: 14918792,
            },
          ],
          totals: {
            views: 387228032,
            followers: 1017913,
            interactions: 22529225,
          },
        },
        {
          id: 5,
          name: "Joden Clash",
          avatar: "src/assets/main/Clients-webp-300px/Joden_Clash.avif",
          description:
            "Joden Newman is the Founder and Creative Director of Clash Creation. In early 2024 he decided to apply the vertical shortcut techniques to his own content, and grew himself 110 million views and 1 million followers across all platforms in just 3 months. His account focusses on current events, true crime and film.",
          data: [
            {
              month: "Feb",
              views: 90000,
              followers: 8322,
              interactions: 12678,
            },
            {
              month: "Mar",
              views: 8830000,
              followers: 69630,
              interactions: 725790,
            },
            {
              month: "Apr",
              views: 46300000,
              followers: 407360,
              interactions: 4950000,
            },
            {
              month: "May",
              views: 62080000,
              followers: 680950,
              interactions: 6450000,
            },
            {
              month: "Jun",
              views: 69720000,
              followers: 809000,
              interactions: 7510000,
            },
            {
              month: "Jul",
              views: 89630000,
              followers: 936760,
              interactions: 9360000,
            },
            {
              month: "Aug",
              views: 89630000,
              followers: 936760,
              interactions: 9360000,
            },
          ],
          totals: {
            views: 109630000,
            followers: 936760 + 126212,
            interactions: 9360000,
          },
        },
        {
          id: 6,
          name: "Jordan Schwarz",
          avatar: "src/assets/main/Clients-webp-300px/Jordan2.avif",
          description:
            "Jordan Schwarzenberger is the co-founder Arcade Media, author, creative and the manager of The Sidemen: the UK's biggest creator empire. \nWe started working with Jordan towards the end of 2024 and together grew his TikTok and Instagram to 39 million views and 15k followers in just 3 months. His account focusses on GenZ, the creator economy, and pop culture.",
          data: [
            {
              month: "Oct",
              views: 0,
              followers: 14562 + 5344,
              interactions: 0,
            },
            {
              month: "Nov",
              views: 3348513,
              followers: 16896 + 16900,
              interactions: 231295,
            },
            {
              month: "Dec",
              views: 5518878,
              followers: 21057 + 18279,
              interactions: 323166,
            },
            {
              month: "Jan",
              views: 9215739 + 145782 + 1598500,
              followers: 22255 + 21710,
              interactions: 566426,
            },
          ],
          totals: {
            views: 9215739 + 145782 + 1598500,
            followers: 22255 + 21710,
            interactions: 566426,
          },
        },
      ];

// Update avatar fields using image mapper for fallback data as well
creators.forEach((creator) => {
  const mappedAvatar = resolveAvatar(creator.avatar);
  creator.avatar = mappedAvatar;
  creator.avatarSrc = mappedAvatar;
});

// Define the CaseStudies component with proper typing
const CaseStudies: React.ForwardRefRenderFunction<HTMLElement, CaseStudiesProps> = (props, ref) => {
  const sectionRef = useRef<HTMLElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  
  // State for responsive rendering
  const [windowWidth, setWindowWidth] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [activeCreator, setActiveCreator] = useState(0);
  const [activeMetric, setActiveMetric] = useState("all");
  const [animateGraph, setAnimateGraph] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const growthResultsRef = useRef<HTMLDivElement>(null);
  const bioContentRef = useRef<HTMLParagraphElement>(null);
  const [growthResultsHeight, setGrowthResultsHeight] = useState(0);
  const [bioFullHeight, setBioFullHeight] = useState(0);
  const [showFullBioDesktop, setShowFullBioDesktop] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  
  // Initialize client-side state and window width
  useEffect(() => {
    // Safely check if we're in a browser environment
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      console.log("Client-side initialization triggered");
      setIsClient(true);
      setWindowWidth(document.documentElement.clientWidth);
      
      // Add resize listener for responsive behavior
      const handleResize = () => {
        setWindowWidth(document.documentElement.clientWidth);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  // Helper functions for responsive rendering
  const isMobile = isClient && windowWidth < BREAKPOINTS.sm;
  const isTablet = isClient && windowWidth >= BREAKPOINTS.sm && windowWidth < BREAKPOINTS.lg;


  useEffect(() => {
    if (growthResultsRef.current) {
      setGrowthResultsHeight(growthResultsRef.current.offsetHeight);
    }
    if (bioContentRef.current) {
      setBioFullHeight(bioContentRef.current.scrollHeight);
    }
  }, [activeCreator, windowWidth]);  // recalc when you switch creators or resize
  
  // Add inline styles to head to handle the scrollbar hiding
  // Also add component-level ScrollTrigger cleanup
  useEffect(() => {
    // Create style element if it doesn't exist already
    const styleId = "scrollbar-hide-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .${SCROLLBAR_HIDE_CLASS} {
          overflow-x: auto;
          scroll-behavior: smooth;
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .${SCROLLBAR_HIDE_CLASS}::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `;
      document.head.appendChild(style);
    }
    
    // Comprehensive cleanup function for component unmount
    return () => {
      // Clean up style element
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
      
      // Ensure all ScrollTrigger instances associated with this component are killed
      try {
        // Get all ScrollTrigger instances
        const allTriggers = ScrollTrigger.getAll();
        
        // Kill any triggers related to this component
        allTriggers.forEach(trigger => {
          if (
            trigger.vars.id === "case-study-elements" || 
            trigger.vars.id === "stats-boxes" ||
            trigger.vars.id === "chris-counter-trigger" ||
            (trigger.trigger && sectionRef.current && 
             sectionRef.current.contains(trigger.trigger as HTMLElement))
          ) {
            trigger.kill();
          }
        });
        
        // Clear any pending refresh calls
        if (debouncedRefresh.current) {
          clearTimeout(debouncedRefresh.current);
        }
      } catch (error) {
        console.error("Error cleaning up ScrollTrigger on unmount:", error);
      }
    };
  }, []);
  
  // Create a debounced version of ScrollTrigger.refresh
  const debouncedRefresh = useRef<NodeJS.Timeout | null>(null);
  
  const debounceScrollTriggerRefresh = () => {
    if (debouncedRefresh.current) {
      clearTimeout(debouncedRefresh.current);
    }
    
    debouncedRefresh.current = setTimeout(() => {
      try {
        ScrollTrigger.refresh();
      } catch (error) {
        console.error("Error refreshing ScrollTrigger:", error);
      }
    }, 200); // 200ms delay before refreshing
  };
  
  // Function to scroll the carousel
  const scrollCarousel = (direction: 'left' | 'right', isMobileView: boolean = false) => {
    const container = isMobileView ? mobileCarouselRef.current : carouselRef.current;
    if (!container) {
      console.error("Carousel container ref is null");
      return;
    }
    
    // Calculate the scroll amount based on the visible width
    const scrollAmount = container.offsetWidth * 0.7; // Scroll by 70% of visible width
    
    // Calculate new position based on current scroll position
    const currentScrollPosition = container.scrollLeft;
    const newPosition = direction === 'right' 
      ? currentScrollPosition + scrollAmount 
      : currentScrollPosition - scrollAmount;
    
    // Clamp the scroll position between 0 and max scroll
    const maxScroll = container.scrollWidth - container.offsetWidth;
    const clampedPosition = Math.max(0, Math.min(newPosition, maxScroll));
    
    // Log scrolling details for debugging
    console.log(`Scrolling ${direction}: current=${currentScrollPosition}, new=${clampedPosition}, max=${maxScroll}`);
    
    // Scroll the container
    container.scrollTo({
      left: clampedPosition,
      behavior: 'smooth'
    });
    
    // Update state with the new position
    setScrollPosition(clampedPosition);
    
    // Use debounced refresh instead of immediate refresh
    debounceScrollTriggerRefresh();
  };
  
  // Use the current creator data with a fallback empty object if not found
  const currentCreator = creators?.[activeCreator] || {
    name: 'Sample Creator',
    description: 'Example creator profile. No creators found in data.',
    avatar: 'src/assets/main/Logo@2x.webp',
    data: [],
    totals: { views: 0, followers: 0, interactions: 0 },
    id: 0
  };

  // Format numbers with comma separators
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
  // Format large numbers with abbreviations for top stats display
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };
  
  // Calculate growth duration in months for each creator
  const getGrowthDuration = (creator: Creator): number => {
    if (!creator?.data || creator?.data?.length < 2) return 0;
    
    // Find months with actual data (excluding zero values)
    const monthsWithData = creator?.data?.filter(item => 
      item?.views > 0 || item?.followers > 0 || item?.interactions > 0
    ) || [];
    
    return (monthsWithData?.length || 0) - 1;
  };

  // Reset animation and other state when changing creators or metrics
  useEffect(() => {
    setAnimateGraph(false);
    setShowFullBio(false); // Reset bio expansion when changing creators
    
    const timer = setTimeout(() => {
      setAnimateGraph(true);
    }, 25); // Reduced from 100ms to 25ms for faster transitions
    
    return () => clearTimeout(timer);
  }, [activeCreator, activeMetric]);
  
  // Initialize counters when scrolled into view
  useEffect(() => {
    if (!sectionRef.current || typeof ScrollTrigger === 'undefined') return;
    
    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 70%",
      onEnter: () => {
        // Initialize counters for current creator
        const counters = document.querySelectorAll('.animate-count-up');
        
        counters.forEach(el => {
          if (!el.getAttribute('data-initialized')) {
            el.setAttribute('data-initialized', 'true');
            const value = parseInt(el.getAttribute('data-value') || '0', 10);
            const duration = parseInt(el.getAttribute('data-duration') || '1500', 10);
            
            let startTimestamp: number | null = null;
            const step = (timestamp: number) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const progress = Math.min((timestamp - startTimestamp) / duration, 1);
              const currentValue = Math.floor(progress * value);
              el.textContent = formatLargeNumber(currentValue);
              
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                el.textContent = formatLargeNumber(value);
              }
            };
            
            window.requestAnimationFrame(step);
          }
        });
      },
      id: "counter-trigger"
    });
    
    // Cleanup
    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill();
      }
    };
  }, [activeCreator]); // Add activeCreator to dependencies to reinitialize when creator changes

  // Reset counters when switching creators
  useEffect(() => {
    const counters = document.querySelectorAll('.animate-count-up');
    counters.forEach(el => {
      el.removeAttribute('data-initialized');
      el.textContent = '0';
    });
  }, [activeCreator]);

  // Measure heights after layout and content changes
  useLayoutEffect(() => {
    const grEl = growthResultsRef.current;
    const bioEl = bioContentRef.current;
    
    // Force a reflow to ensure accurate measurements
    if (grEl) {
      const height = grEl.offsetHeight;
      setGrowthResultsHeight(height);
    }
    
    if (bioEl) {
      const height = bioEl.scrollHeight;
      setBioFullHeight(height);
    }
  }, [activeCreator, windowWidth, currentCreator?.description]); // Add description dependency

  // Fallback clamp = 4 lines
  const fallbackClampHeight = (() => {
    const el = bioContentRef.current;
    if (!el) return 0;
    const lineH = parseFloat(getComputedStyle(el).lineHeight);
    return lineH * 4;
  })();

  const clampHeight = growthResultsHeight > 0 ? growthResultsHeight : fallbackClampHeight;

  // Calculate Y-axis domain based on active metric
  const getYAxisDomain = () => {
    if (activeMetric === "views") {
      const maxViews = Math.max(
        ...(currentCreator?.data?.map((item) => item?.views) || [])
      );
      return [0, Math.ceil(maxViews * 1.1)] as [number, number]; // Add 10% padding and type assertion
    } else if (activeMetric === "followers") {
      const maxFollowers = Math.max(
        ...(currentCreator?.data?.map((item) => item?.followers) || [])
      );
      return [0, Math.ceil(maxFollowers * 1.1)] as [number, number];
    } else if (activeMetric === "interactions") {
      const maxInteractions = Math.max(
        ...(currentCreator?.data?.map((item) => item?.interactions) || [])
      );
      return [0, Math.ceil(maxInteractions * 1.1)] as [number, number];
    }
    // For 'all', let Recharts handle it
    return undefined;
  };

  // GSAP animations with enhanced cleanup
  useGSAP(() => {
    // Store ScrollTrigger instances for explicit cleanup
    const scrollTriggers: ScrollTriggerInstance[] = [];
    
    const ctx = gsap.context(() => {
      try {
        // Direct DOM manipulation without requestAnimationFrame to avoid timing issues
        // Create ScrollTrigger animation for main elements
        const caseStudyElements = document.querySelectorAll(".case-study-element");
        if (caseStudyElements.length > 0 && sectionRef.current) {
          const mainElementsAnimation = gsap.from(caseStudyElements, {
            y: 20, // Reduced movement for smoother animation
            opacity: 0,
            stagger: 0.05, // Reduced stagger time for quicker animation
            duration: 0.6, // Shorter duration for better performance
            ease: "power2.out", // Simpler easing function
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "bottom bottom",
              toggleActions: "play none none none", // Changed to avoid reverse animation issues
              once: false, // Don't keep the animation state in memory
              id: "case-study-elements"
            }
          });
        
          if (mainElementsAnimation.scrollTrigger) {
            scrollTriggers.push(mainElementsAnimation.scrollTrigger);
          }
        }

        // Special animation for the stats row with staggered entry
        const statsBoxes = document.querySelectorAll(".stats-box");
        if (statsBoxes.length > 0 && statsRowRef.current) {
          // Immediately set all statsBoxes to be visible first
        gsap.set(statsBoxes, { opacity: 1 });
        
        const statsAnimation = gsap.from(statsBoxes, {
            y: 5, // Minimal movement
            opacity: 0.7, // Start more visible
            stagger: 0.02, // Faster stagger
            duration: 0.3, // Shorter duration
            ease: "power1.out", // Simpler easing
            scrollTrigger: {
              trigger: statsRowRef.current,
              start: "top 85%",
              toggleActions: "play none none none", // Changed to avoid reverse issues
              once: false,
              id: "stats-boxes"
            }
          });
          
          if (statsAnimation.scrollTrigger) {
            scrollTriggers.push(statsAnimation.scrollTrigger);
          }
        }
      } catch (error) {
        console.error("Error setting up GSAP animations:", error);
      }
    }, sectionRef);

    // Return comprehensive cleanup function with enhanced error handling
    return () => {
      try {
        // First kill all ScrollTrigger instances explicitly
        scrollTriggers.forEach(trigger => {
          if (trigger && typeof trigger.kill === 'function') {
            trigger.kill();
          }
        });
        
        // Kill all ScrollTrigger instances to ensure thorough cleanup
        const allTriggers = ScrollTrigger.getAll();
        allTriggers.forEach(trigger => {
          if (trigger.vars.id === "case-study-elements" || 
              trigger.vars.id === "stats-boxes" || 
              trigger.vars.id === "chris-counter-trigger") {
            trigger.kill();
          }
        });
        
        // Then revert the GSAP context
        ctx.revert();
      } catch (error) {
        console.error("Error cleaning up GSAP animations:", error);
      }
    };
  }, []);

  // Custom tooltip component for the chart
  const CustomTooltip = ({ 
    active, 
    payload, 
    label 
  }: { 
    active?: boolean; 
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>; 
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-theme-gradient-card
                      p-2.5 rounded-md shadow-theme-sm
                      border border-theme-border-light">
          <p className="font-medium text-sm text-theme-primary mb-1.5">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex justify-between items-center my-0.5 text-xs">
              <span className="mr-4" style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-medium" style={{ color: entry.color }}>{formatNumber(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Section
      ref={(el) => mergeRefs(sectionRef, ref)(el)}
      className="bg-transparent flex flex-col justify-start pt-2 sm:pt-6 md:pt-0 pb-0 mb-0 relative overflow-visible z-10"
    >
    {/* Background patterns - properly themed */}
    <div className="absolute inset-0 dot-bg pointer-events-none dark:opacity-20"></div>
    
    {/* Theme-aware floating elements - hidden on mobile */}
    <div className="absolute top-40 left-[10%] w-40 h-40 rounded-[40%] rotate-12 
                  opacity-[var(--theme-float-opacity)]
                  bg-[var(--theme-float-bg-primary)]
                  animate-float-slow hidden md:block"></div>
    <div className="absolute bottom-60 right-[15%] w-40 h-40 rounded-[30%] -rotate-6 
                  opacity-[var(--theme-float-opacity)]
                  bg-[var(--theme-float-bg-secondary)]
                  animate-float-medium hidden md:block"></div>

    <div className="container-mobile px-2 xs:px-3 sm:px-4 md:px-6 mx-auto relative z-20 flex flex-col">
      {/* Section header - responsive and properly positioned */}
      <div className="relative z-30">
        <div className="text-center mb-4 md:mb-10">
          <h2 className="text-black dark:text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
              The numbers speak for themselves:
          </h2>
        </div>
        <div className="overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {/* Marquee content */}
          </div>
        </div>
      </div>

      {/* Stats carousel optimized for mobile with HUD-like appearance */}
      <div ref={statsRowRef} className="mb-4 sm:mb-6 case-study-element relative z-20">
        {/* Mobile view: Creator carousel */}
        <div className="md:hidden">
          
          {/* Mobile carousel with navigation */}
          <div className="relative py-2">
            {/* Left scroll button - Mobile */}
            <button 
              onClick={() => scrollCarousel('left', true)}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-30 bg-theme-gradient-primary p-2 rounded-full shadow-sm text-white border border-white/20 cursor-pointer touch-action-manipulation hover:scale-110 active:scale-95 transition-transform"
              aria-label="Scroll left"
              style={{ minWidth: '32px', minHeight: '32px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            {/* Carousel content - Mobile */}
            <div 
              ref={mobileCarouselRef} 
              className={`${SCROLLBAR_HIDE_CLASS} flex gap-3 px-8 py-3 snap-x overflow-x-auto`}
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            >
              {creators.map((creator, index) => (
                <button
                  key={creator.id}
                  onClick={() => setActiveCreator(index)}
                  className={`stats-box bg-theme-gradient-card 
                            rounded-lg p-3 sm:p-2.5
                            border border-theme-border-light
                            shadow-sm 
                            transition-all duration-300
                            flex-shrink-0 w-[calc(70%-0.5rem)] xs:w-[calc(50%-0.75rem)]
                            snap-start
                            ${activeCreator === index 
                              ? 'translate-y-[-2px] scale-[1.02] shadow-theme-sm ring-1 ring-[var(--theme-primary)]/70' 
                              : 'hover:translate-y-[-2px] hover:shadow-sm active:translate-y-[0px]'}
                            flex flex-col items-center text-center
                            cursor-pointer
                            z-20 relative`}
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden 
                              ring-1 ring-white mb-1.5
                              transition-all duration-300 mx-auto relative">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-theme-secondary/80 text-[9px] uppercase tracking-wider font-medium">
                    Views
                  </div>
                  <div className="text-theme-accent-primary font-bold text-lg leading-none my-0.5">
                    {formatLargeNumber(creator?.totals?.views || 0)}
                  </div>
                  <h4 className="text-theme-primary/80 font-normal text-[10px] truncate w-full mt-1 mb-0.5">
                    {creator.name}
                  </h4>
                </button>
              ))}
            </div>
            
            {/* Right scroll button - Mobile */}
            <button 
              onClick={() => scrollCarousel('right', true)}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-30 bg-theme-gradient-primary p-2 rounded-full shadow-sm text-white border border-white/20 cursor-pointer touch-action-manipulation hover:scale-110 active:scale-95 transition-transform"
              aria-label="Scroll right"
              style={{ minWidth: '32px', minHeight: '32px' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Desktop view: Carousel with navigation */}
        <div className="hidden md:block">
          {/* Left scroll button */}
          <button 
            onClick={() => scrollCarousel('left')}
            className="absolute left-[-24px] top-1/2 -translate-y-1/2 z-30 bg-theme-gradient-primary p-3 rounded-full shadow-theme-md text-white hover:scale-110 active:scale-95 transition-transform duration-300 border border-white/20 cursor-pointer"
            aria-label="Scroll left"
            style={{ minWidth: '40px', minHeight: '40px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          
          {/* Carousel content */}
          <div 
            ref={carouselRef}
            className={`${SCROLLBAR_HIDE_CLASS} flex gap-2 px-8 py-2 snap-x hidden md:flex`}
            style={{ scrollBehavior: 'smooth' }}
          >
            {creators.map((creator, index) => (
              <button
                key={creator.id}
                onClick={() => setActiveCreator(index)}
                className={`stats-box bg-theme-gradient-card 
                          rounded-lg p-3
                          border border-theme-border-light
                          shadow-theme-sm 
                          transition-all duration-300
                          flex-shrink-0 w-[calc(25%-0.75rem)]
                          snap-start
                          ${activeCreator === index 
                            ? 'translate-y-[-2px] scale-[1.02] shadow-theme-md ring-2 ring-[var(--theme-primary)]/70' 
                            : index === 0
                              ? 'hover:translate-y-[-2px] hover:shadow-theme-md active:translate-y-[0px] translate-y-[2px]' 
                              : 'hover:translate-y-[-2px] hover:shadow-theme-md active:translate-y-[0px]'}
                          flex flex-col items-center text-center
                          cursor-pointer
                          z-20 relative`}
              >
                <div className="w-11 h-11 rounded-full overflow-hidden 
                            ring-2 ring-white mb-2
                            transition-all duration-300 mx-auto relative">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-theme-secondary/80 text-[10px] uppercase tracking-wider font-medium">
                  Views
                </div>
                <div className="text-theme-accent-primary font-bold text-3xl lg:text-4xl leading-none">
                  {formatLargeNumber(creator?.totals?.views || 0)}
                </div>
                <div className="text-theme-secondary/90 text-[10px] mt-0.5">
                  in {getGrowthDuration(creator)} months
                </div>
                <h4 className="text-theme-primary/60 font-normal text-[9px] truncate w-full opacity-60">
                  {creator.name}
                </h4>
              </button>
            ))}
          </div>
          
          {/* Right scroll button */}
          <button 
            onClick={() => scrollCarousel('right')}
            className="absolute right-[-24px] top-1/2 -translate-y-1/2 z-30 bg-theme-gradient-primary p-3 rounded-full shadow-theme-md text-white hover:scale-110 active:scale-95 transition-transform duration-300 border border-white/20 cursor-pointer"
            aria-label="Scroll right"
            style={{ minWidth: '40px', minHeight: '40px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>


      {/* Creator Profile Hub - Prominent top section */}
      <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-6 w-full max-w-full sm:max-w-[98%] sm:mx-auto case-study-element">
        {/* Active Creator Dashboard - Always visible at top */}
        <div className="bg-theme-gradient-card rounded-xl border border-theme-border-light shadow-theme-lg overflow-hidden transition-all duration-300 transform">
          {/* Creator Header with Navigation */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between p-2.5 sm:p-4 border-b border-theme-border-light/50 bg-transparent relative">
            {/* Creator Info */}
            <div className="flex items-center w-full sm:w-auto">
              <div className="relative w-12 h-12 sm:w-16 md:w-20 sm:h-16 md:h-20 rounded-full overflow-hidden flex-shrink-0
                        ring-2 ring-[var(--theme-primary)] mr-2.5 sm:mr-4 relative z-50 shadow-lg">
                <img
                  src={currentCreator?.avatar || '/src/assets/main/Logo@2x.webp'}
                  alt={currentCreator?.name || 'Creator'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 mb-0.5">
                  <h2 className="text-theme-primary text-sm sm:text-lg md:text-xl font-semibold leading-tight">
                    {currentCreator?.name || 'Creator'}
                  </h2>
                  <div className="bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                    Case Study
                  </div>
                </div>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-theme-secondary">
                  <div className="text-[10px] sm:text-xs">
                    <span className="text-theme-secondary/80">Growth: </span>
                    <span className="font-medium">{getGrowthDuration(currentCreator)} months</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Stats Pills */}
            <div className="hidden sm:flex items-center gap-2 mt-2 sm:mt-0">
              <div className="bg-[var(--theme-primary)]/10 text-[var(--theme-primary)] px-3 py-1.5 rounded-lg text-sm font-semibold">
                {formatLargeNumber(currentCreator?.totals?.views || 0)} Views
              </div>
              <div className="bg-[var(--theme-accent-secondary)]/10 text-[var(--theme-accent-secondary)] px-3 py-1.5 rounded-lg text-sm font-semibold">
                {formatLargeNumber(currentCreator?.totals?.followers || 0)} Followers
              </div>
            </div>
          </div>
          
          {/* Bio and Quick Stats */}
          <div className="p-2 sm:p-4 md:p-5 grid md:grid-cols-[1fr_auto] gap-2 sm:gap-4">
            {/* Bio Section - No border - Improved mobile expandable text */}
            <div className="bg-theme-surface/20 rounded-lg p-2 sm:p-4">
              <div className="relative">
                {/* Mobile Expandable Bio */}
                <div className="md:hidden relative pb-6">
                  <p 
                    ref={bioContentRef}
                    className="text-theme-secondary text-[15px] leading-tight mb-3"
                    style={{ 
                      fontSize: '15px', 
                      lineHeight: 1.3,
                      maxHeight: showFullBio ? 'none' : '4.5em',
                      overflow: 'hidden'
                    }}
                  >
                    {currentCreator?.description || 'No description available.'}
                  </p>
                  
                  {/* Fade gradient at bottom when collapsed */}
                  {!showFullBio && (
                    <div className="absolute bottom-6 left-0 right-0 h-6 bg-gradient-to-t from-theme-surface/20 to-transparent"></div>
                  )}
                  
                  <button 
                    className="text-xs font-medium text-theme-accent-primary px-2 py-1 hover:underline absolute bottom-0 right-0"
                    onClick={() => setShowFullBio(!showFullBio)}
                    style={{ fontSize: '12px', fontWeight: 500 }}
                  >
                    {showFullBio ? 'Show less' : 'Read more'}
                  </button>
                </div>
                
                {/* Desktop Bio - Clamped to growth results height */}
                <div className="hidden md:block relative">
                  <div
                    className="overflow-hidden transition-[max-height] duration-300 relative"
                    style={{
                      maxHeight: showFullBioDesktop ? `${bioFullHeight}px` : `${clampHeight}px`,
                    }}
                  >
                    <p
                      ref={bioContentRef}
                      className="text-theme-secondary sm:text-sm sm:leading-relaxed"
                    >
                      {currentCreator?.description || 'No description available.'}
                    </p>

                    {/* Fade gradient at bottom when clamped */}
                    {!showFullBioDesktop && (
                      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-theme-surface/20 to-transparent" />
                    )}
                  </div>

                  <button
                    onClick={() => setShowFullBioDesktop(!showFullBioDesktop)}
                    className="mt-2 text-xs font-medium text-theme-accent-primary hover:underline"
                  >
                    {showFullBioDesktop ? "Show less" : "Read more"}
                  </button>
                </div>
              </div>
            </div>

            {/* Growth Results Section - Positioned top right */}
            <div ref={growthResultsRef} className="hidden md:block bg-theme-surface/20 rounded-lg p-3 relative">
              <h3 className="text-theme-primary text-sm font-medium mb-3">Growth Results</h3>
              <div className="flex flex-col gap-3">
                {/* Views Counter */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-12 bg-[var(--theme-primary)]/70 rounded-full"></div>
                  <div>
                    <div className="text-[var(--theme-primary)] text-2xl font-bold">
                      <span className="animate-count-up" 
                            data-value={currentCreator?.totals?.views || 0} 
                            data-duration="1500"
                            key={`views-${activeCreator}`}>
                        0
                      </span> Views
                    </div>
                  </div>
                </div>
                
                {/* Followers Counter */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-12 bg-[var(--theme-accent-secondary)]/70 rounded-full"></div>
                  <div>
                    <div className="text-[var(--theme-accent-secondary)] text-2xl font-bold">
                      <span className="animate-count-up" 
                            data-value={currentCreator?.totals?.followers || 0} 
                            data-duration="1200"
                            key={`followers-${activeCreator}`}>
                        0
                      </span> Followers
                    </div>
                  </div>
                </div>
                
                {/* Interactions Counter */}
                <div className="flex items-center gap-3">
                  <div className="w-2 h-12 bg-[var(--theme-accent-tertiary)]/70 rounded-full"></div>
                  <div>
                    <div className="text-[var(--theme-accent-tertiary)] text-2xl font-bold">
                      <span className="animate-count-up" 
                            data-value={currentCreator?.totals?.interactions || 0} 
                            data-duration="1300"
                            key={`interactions-${activeCreator}`}>
                        0
                      </span> Interactions
                    </div>
                  </div>
                </div>
              </div>
              <span className="absolute bottom-3 right-3 text-theme-secondary text-xs italic">
                in just <span className="font-semibold">{getGrowthDuration(currentCreator)}</span> months
              </span>
            </div>
          </div>

          {/* Mobile Stats Boxes - Only visible on mobile */}
          <div className="md:hidden grid grid-cols-3 gap-1.5 mt-2 case-study-element">
            {/* Views Box */}
            <div className="bg-theme-gradient-card rounded-lg p-1.5 border border-theme-border-light shadow-sm">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-[var(--theme-primary)]/70 rounded-full mr-1.5"></div>
                <div>
                  <div className="text-theme-secondary/80 text-[8px] uppercase tracking-wider font-medium">
                    Views
                  </div>
                  <div className="text-[var(--theme-primary)] font-bold text-base leading-none mt-0.5">
                    {formatLargeNumber(currentCreator?.totals?.views || 0)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Followers Box */}
            <div className="bg-theme-gradient-card rounded-lg p-1.5 border border-theme-border-light shadow-sm">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-[var(--theme-accent-secondary)]/70 rounded-full mr-1.5"></div>
                <div>
                  <div className="text-theme-secondary/80 text-[8px] uppercase tracking-wider font-medium">
                    Followers
                  </div>
                  <div className="text-[var(--theme-accent-secondary)] font-bold text-base leading-none mt-0.5">
                    {formatLargeNumber(currentCreator?.totals?.followers || 0)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Interactions Box */}
            <div className="bg-theme-gradient-card rounded-lg p-1.5 border border-theme-border-light shadow-sm">
              <div className="flex items-center">
                <div className="w-1 h-6 bg-[var(--theme-accent-tertiary)]/70 rounded-full mr-1.5"></div>
                <div>
                  <div className="text-theme-secondary/80 text-[8px] uppercase tracking-wider font-medium">
                    Interactions
                  </div>
                  <div className="text-[var(--theme-accent-tertiary)] font-bold text-base leading-none mt-0.5">
                    {formatLargeNumber(currentCreator?.totals?.interactions || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Creator Growth Data */}
          <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
            
            {/* Detailed Stats Cards - Hidden on mobile, visible on tablets/desktop */}
            <div className="col-span-3 hidden sm:grid grid-cols-3 gap-2 sm:gap-3 case-study-element">
              {/* Views Stats Card - No border */}
              <div className="bg-theme-gradient-card rounded-xl shadow-theme-sm p-2 sm:p-3 overflow-hidden">
                <div className="flex items-center">
                  <div className="w-1 h-10 sm:h-12 bg-[var(--theme-primary)]/70 rounded-full mr-1.5 sm:mr-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[var(--theme-primary)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                      </svg>
                      <div className="text-theme-secondary text-xs uppercase tracking-wider font-medium">Views</div>
                    </div>
                    <div className="text-[var(--theme-primary)] text-lg sm:text-xl font-bold mt-0.5 sm:mt-1">
                      {formatNumber(currentCreator?.totals?.views || 0)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Followers Stats Card - No border */}
              <div className="bg-theme-gradient-card rounded-xl shadow-theme-sm p-2 sm:p-3 overflow-hidden">
                <div className="flex items-center">
                  <div className="w-1 h-10 sm:h-12 bg-[var(--theme-accent-secondary)]/70 rounded-full mr-1.5 sm:mr-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[var(--theme-accent-secondary)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 7C16 9.21 14.21 11 12 11C9.79 11 8 9.21 8 7C8 4.79 9.79 3 12 3C14.21 3 16 4.79 16 7ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13Z" fill="currentColor"/>
                      </svg>
                      <div className="text-theme-secondary text-xs uppercase tracking-wider font-medium">Followers</div>
                    </div>
                    <div className="text-[var(--theme-accent-secondary)] text-lg sm:text-xl font-bold mt-0.5 sm:mt-1">
                      {formatNumber(currentCreator?.totals?.followers || 0)}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Interactions Stats Card - No border */}
              <div className="bg-theme-gradient-card rounded-xl shadow-theme-sm p-2 sm:p-3 overflow-hidden">
                <div className="flex items-center">
                  <div className="w-1 h-10 sm:h-12 bg-[var(--theme-accent-tertiary)]/70 rounded-full mr-1.5 sm:mr-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-[var(--theme-accent-tertiary)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                      <div className="text-theme-secondary text-xs uppercase tracking-wider font-medium">Interactions</div>
                    </div>
                    <div className="text-[var(--theme-accent-tertiary)] text-lg sm:text-xl font-bold mt-0.5 sm:mt-1">
                      {formatNumber(currentCreator?.totals?.interactions || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Graph component - No border */}
            <div ref={chartRef} className="col-span-3 bg-theme-gradient-card p-2 sm:p-4 rounded-xl
                      shadow-theme-sm case-study-element">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3 gap-1 sm:gap-2">
                <div className="text-theme-secondary text-xs sm:text-sm">
                  <span className="font-medium hidden sm:inline">Growth Chart</span>
                </div>
                
                {/* Chart Filter Controls */}
                <div className="flex gap-1 rounded-lg bg-theme-surface/30 p-0.5 mx-auto sm:mx-0">
                  {[
                    { id: "all", label: "All", color: "bg-theme-gradient-primary", textColor: "text-white" },
                    { id: "views", label: "Views", color: "bg-[var(--theme-primary)]", textColor: "text-white" },
                    { id: "followers", label: "Followers", color: "bg-[var(--theme-accent-secondary)]", textColor: "text-white" },
                    { id: "interactions", label: "Interactions", color: "bg-[var(--theme-accent-tertiary)]", textColor: "text-white" },
                  ].map((metric) => (
                    <button
                      key={metric.id}
                      onClick={() => setActiveMetric(metric.id)}
                      className={`px-1.5 sm:px-2 py-1 rounded-md text-[10px] sm:text-xs transition-all
                                ${activeMetric === metric.id 
                                  ? `${metric.color} ${metric.textColor} shadow-sm` 
                                  : "bg-transparent hover:bg-theme-surface/50 text-theme-secondary"}`}
                    >
                      {metric.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-[200px] sm:h-[280px] md:h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={currentCreator?.data || []}
                    margin={{ 
                      top: 5, 
                      right: isMobile ? 5 : 15, 
                      left: isMobile ? 0 : 15, 
                      bottom: 5 
                    }}
                  >
                    <defs>
                      {/* Simplified glow effect */}
                      <filter id="simpleGlow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Simplified grid */}
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke="var(--theme-border-light)" 
                      opacity={0.4}
                      vertical={false}
                      horizontalPoints={isMobile ? [40, 80, 120, 160] : undefined}
                    />
                    
                    {/* X-axis */}
                    <XAxis 
                      dataKey="month" 
                      className="text-theme-secondary"
                      stroke="var(--theme-border-light)"
                      tick={{ 
                        fontSize: isMobile ? 10 : 12,
                        fill: 'var(--theme-text-primary)'
                      }}
                      tickLine={false}
                      axisLine={true}
                      interval={isMobile ? 1 : 0}
                    />
                    
                    {/* Y-axis */}
                    <YAxis
                      className="text-theme-secondary"
                      stroke="var(--theme-border-light)"
                      domain={getYAxisDomain()}
                      tick={{ 
                        fontSize: isMobile ? 10 : 12,
                        fill: 'var(--theme-primary)',
                        fontWeight: 'bold'
                      }}
                      tickLine={true}
                      axisLine={true}
                      width={isMobile ? 35 : 50}
                      tickCount={isMobile ? 4 : 5}
                      tickFormatter={(value) => {
                        // Format numbers to be more readable (e.g., 1M instead of 1000000)
                        if (value >= 1000000) {
                          return `${(value / 1000000).toFixed(0)}M`;
                        } else if (value >= 1000) {
                          return `${(value / 1000).toFixed(0)}K`;
                        }
                        return value;
                      }}
                    />
                    
                    {/* Tooltip */}
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Legend */}
                    <Legend 
                      iconSize={isMobile ? 6 : 8}
                      wrapperStyle={{ 
                        fontSize: isMobile ? '9px' : '10px', 
                        paddingTop: '5px'
                      }}
                      verticalAlign="bottom"
                    />
                    
                    {/* Views line */}
                    {(activeMetric === "all" || activeMetric === "views") && (
                      <Line
                        type="monotone"
                        dataKey="views"
                        name="Views"
                        stroke="var(--theme-primary)"
                        strokeWidth={isMobile ? 1.5 : 2}
                        activeDot={{ 
                          r: isMobile ? 2.5 : 3, 
                          strokeWidth: isMobile ? 1.5 : 2,
                          fill: "var(--theme-primary)",
                          filter: "url(#simpleGlow)"
                        }}
                        isAnimationActive={false}
                      />
                    )}
                    
                    {/* Followers line */}
                    {(activeMetric === "all" || activeMetric === "followers") && (
                      <Line
                        type="monotone"
                        dataKey="followers"
                        name="Followers"
                        stroke="var(--theme-accent-secondary)"
                        strokeWidth={isMobile ? 1 : 1.5}
                        activeDot={{ 
                          r: isMobile ? 2.5 : 3, 
                          strokeWidth: isMobile ? 1.5 : 2,
                          fill: "var(--theme-accent-secondary)",
                          filter: "url(#simpleGlow)"
                        }}
                        isAnimationActive={false}
                      />
                    )}
                    
                    {/* Interactions line */}
                    {(activeMetric === "all" || activeMetric === "interactions") && (
                      <Line
                        type="monotone"
                        dataKey="interactions"
                        name="Interactions"
                        stroke="var(--theme-accent-tertiary)"
                        strokeWidth={isMobile ? 1 : 1.5}
                        activeDot={{ 
                          r: isMobile ? 2.5 : 3, 
                          strokeWidth: isMobile ? 1.5 : 2,
                          fill: "var(--theme-accent-tertiary)",
                          filter: "url(#simpleGlow)"
                        }}
                        isAnimationActive={false}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* No bottom spacing or decorative effects */}
    </Section>
  );
};

// Add display name for debugging
CaseStudies.displayName = 'CaseStudies';

// Helper function to merge refs
function mergeRefs<T>(...refs: (React.RefObject<T> | React.MutableRefObject<T> | React.ForwardedRef<T> | ((instance: T | null) => void) | null)[]) {
  return (value: T | null): void => {
    refs.forEach((ref) => {
      if (!ref) return;
      
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export default CaseStudies;