import React, { useEffect, useRef, useState } from "react";
import { Section } from "../ui/section";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { courseStats, tracks, sections } from "../../lib/course-utils";

// Helper function to safely access course data with proper null checks
const courseData = {
  totalModules: courseStats?.totalModules || 0,
  totalHours: courseStats?.totalHours || 0,
  trackNames: tracks?.map(track => track.name || '').filter(Boolean).join(", ") || "multiple specialized tracks",
  getSection: (id: string) => sections?.find(s => s.id === id)?.name || "specialized"
};

// Type definitions
type FAQItem = {
  question: string;
  answer: string[];
};

type FAQCategory = "General" | "Course Details" | "Results & Expectations";

type FAQItems = {
  [key in FAQCategory]: FAQItem[];
};

// FAQ data organized by categories
const FAQ_CATEGORIES: FAQCategory[] = ["General", "Course Details", "Results & Expectations"];

const FAQ_ITEMS: FAQItems = {
  "General": [
    {
      question: "Why is short form a good investment?",
      answer: [
        "Short form content has only really been around since 2020. But in that short space of time it has grown an insane amount. 62.6% of the global population is currently on social media, that's well over 5 billion people, and each of them spends around 2 and a half hours on there. Every single day. 5 billion people watching for 2 and a half hours.",
        "Short form is where the attention is and it's where people are buying. Studies show that 96% of all consumers prefer video over text when learning about a product or a service, and 73% of those consumers prefer to learn about it through short form video specifically.",
        "So if you have a product - and that product could be you - short form is the only reasonable place to start dominating. Especially if you're trying to target gen z. 70% of them watch short form videos every single day, this is the place to reach them."
      ]
    },
    {
      question: "Who is this course designed for?",
      answer: [
        "This course is for founders and creative team members who are ready to transform their approach to short form over an 8-week period. Our clients include agency founders, CMOs, MDs, experts and straight up growth hackers. So, if you want to understand how to get views on short form, this course is for you."
      ]
    }
  ],
  "Course Details": [
    {
      question: "How is the course structured?",
      answer: [
        "Well you *should* read the course structure. But here's the top line: 8 weeks of pre-recorded content, live sessions, workshops and PDFs. Lifetime access to all our resources, plus our founder community and our team of experts."
      ]
    },
    {
      question: "What topics does the course cover?",
      answer: [
        "Our course covers everything. And we mean everything. From the fundamentals of starting your account, to what makes a good video (and a bad one). And all the tools and theory you need to make videos that algorithms 'aka audiences' love. Plus how to get this all up and running with a content team that runs itself. And then make money and leads from it."
      ]
    },
    {
      question: "How much time should I commit weekly?",
      answer: [
        "We know how busy you are, so outside of the hour weekly sessions, the course is designed to be completely flexible. Ideally, you and/or your team dedicate 3-4 hours per week to maximise value from the weekly sessions.",
        "If you're a very time-strapped founder, please check out the founder and team tracks to know which modules you need to watch, and which ones to hand over to them."
      ]
    }
  ],
  "Results & Expectations": [
    {
      question: "How quickly will I see results?",
      answer: [
        "Despite our glowing results, short form is a tricky beast, and requires commitment. If you use the contact time right, apply yourself fully and trust the process, we'd expect you'll do great.",
        "Founders that work with us tend to see an initial warming up period, then a steady, consistent increase in views over the first 3 months."
      ]
    },
    {
      question: "What happens when I sign up?",
      answer: [
        "Once you've applied, and you're all signed off and ready to go, you'll be given immediate access to the first week of content (we don't want to overwhelm you) plus a group chat directly in contact with us, and the other lucky founders in your cohort."
      ]
    }
  ]
};

const Question = ({
  question,
  answer,
}: {
  question: string;
  answer: string[];
}) => {
  const [ref, { height }] = useMeasure();
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      animate={open ? "open" : "closed"}
      className="rounded-xl border-[1px] border-theme-accent/20 px-4 transition-colors"
    >
      <button
        onClick={() => setOpen((pv) => !pv)}
        className="flex w-full items-center justify-between gap-4 py-4 hover:bg-theme-accent/5 transition-colors duration-200"
      >
        <motion.span
          variants={{
            open: {
              color: "var(--theme-accent-secondary)",
            },
            closed: {
              color: "var(--theme-text-primary)",
            },
          }}
          className={`text-left text-base sm:text-lg font-medium ${open ? 'text-theme-accent' : 'text-theme-primary'}`}
        >
          {question}
        </motion.span>
        <motion.span
          variants={{
            open: {
              rotate: "180deg",
              color: "var(--theme-accent-secondary)",
            },
            closed: {
              rotate: "0deg",
              color: "var(--theme-text-primary)",
            },
          }}
        >
          <FiChevronDown className="text-2xl" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: open ? height : "0px",
          marginBottom: open ? "24px" : "0px",
        }}
        className="overflow-hidden text-theme-secondary"
      >
        <div ref={ref} className="px-4">
          {answer.map((paragraph, pIndex) => (
            <p 
              key={pIndex} 
              className={`text-theme-secondary max-w-[520px] mx-auto text-balance ${pIndex < answer.length - 1 ? 'mb-2' : 'mb-0'}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const Tabs = ({
  selected,
  setSelected,
}: {
  selected: FAQCategory;
  setSelected: React.Dispatch<React.SetStateAction<FAQCategory>>;
}) => {
  return (
    <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
      {FAQ_CATEGORIES.map((tab) => (
        <button
          onClick={() => setSelected(tab)}
          className={`relative overflow-hidden whitespace-nowrap rounded-md border-[1px] px-3 py-1.5 text-sm font-medium transition-colors duration-500 ${
            selected === tab
              ? "border-theme-accent text-theme-primary"
              : "border-theme-accent/20 bg-transparent text-theme-secondary"
          }`}
          key={tab}
        >
          <span className="relative z-10">{tab}</span>
          <AnimatePresence>
            {selected === tab && (
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{
                  duration: 0.5,
                  ease: "backIn",
                }}
                className="absolute inset-0 z-0 bg-theme-accent/10"
              />
            )}
          </AnimatePresence>
        </button>
      ))}
    </div>
  );
};

export default function FAQUpdated() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const eyeballRef = useRef<SVGSVGElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory>(FAQ_CATEGORIES[0]);
  
  // Initialize GSAP animations
  useGSAP(() => {
    // Entrance animation for the eyeball
    gsap.fromTo("#faqEyeballSvg", 
      { 
        y: 100,
        opacity: 0,
        rotation: -2
      }, 
      { 
        y: -20,
        opacity: 1,
        rotation: 0,
        duration: 1.2, 
        delay: 0.15,
        ease: "power2.out"
      }
    );
    
    // Add mouse movement effect to eyeball
    const handleMouseMove = (e: MouseEvent) => {
      const eyeball = document.getElementById('faqEyeballSvg');
      if (!eyeball) return;
      
      const windowWidth = document.documentElement.clientWidth;
      const windowHeight = window.innerHeight;
      const mouseXPercent = (e.clientX / windowWidth - 0.5) * 2;
      const mouseYPercent = (e.clientY / windowHeight - 0.5) * 2;
      
      gsap.to(eyeball, {
        rotation: mouseXPercent * 3,
        rotationY: mouseYPercent * 2,
        duration: 1.2,
        ease: "power1.out"
      });
    };
    
    // Add event listener for mouse movement
    window.addEventListener('mousemove', handleMouseMove);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <Section ref={sectionRef} className="relative overflow-hidden pt-6 sm:pt-8 md:pt-12">
      <div className="mx-auto flex flex-col items-center gap-6 relative max-w-[1000px] px-8 sm:px-16 md:px-24 lg:px-36">
        <svg
          width="679"
          height="600"
          viewBox="0 0 679 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          id="faqEyeballSvg"
          ref={eyeballRef}
          className="
            w-[140px] h-auto
            sm:w-[170px] md:w-[205px] lg:w-[235px]
            absolute top-[-20px] left-[-65px]
            sm:top-[-25px] sm:left-[-85px]
            md:top-[-30px] md:left-[-105px]
            lg:top-[-35px] lg:left-[-125px]
            opacity-0
            transition-all duration-500
            animate-float-gentle
            z-100
          "
          aria-hidden="true"
        >
          <circle
            cx="331.484"
            cy="347.484"
            r="231.656"
            transform="rotate(-90 331.484 347.484)"
            fill="var(--theme-eyeball-outer)"
          />
          <ellipse
            cx="387.704"
            cy="307.815"
            rx="143.553"
            ry="143.168"
            transform="rotate(-90 387.704 307.815)"
            fill="var(--theme-eyeball-iris)"
          />
          <path
            d="M324.537 240.611C337.361 218.609 357.976 202.262 382.267 194.834C406.558 187.406 432.737 189.444 455.577 200.541C478.417 211.637 496.239 230.976 505.483 254.697C514.727 278.417 514.714 304.773 505.446 328.503C496.178 352.233 478.337 371.59 455.485 382.711C432.634 393.832 406.453 395.897 382.169 388.495C357.886 381.092 337.287 364.767 324.486 342.778C311.684 320.789 307.622 294.755 313.109 269.872L411.566 291.649L324.537 240.611Z"
            fill="var(--theme-eyeball-pupil)"
          />
        </svg>
        <h2 className="text-center text-4xl md:text-5xl font-bold text-theme-primary mb-2 -mt-2">
          FAQs
        </h2>
        <p className="text-center text-xs md:text-sm text-theme-accent/70 italic mb-4 -mt-1">
          And frequently given answers
        </p>
        
        <Tabs selected={selectedCategory} setSelected={setSelectedCategory} />
        
        <div className="w-full max-w-[650px] mx-auto mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{
                duration: 0.5,
                ease: "backIn",
              }}
              className="space-y-4"
            >
              {FAQ_ITEMS[selectedCategory].map((item, index) => (
                <Question key={index} question={item.question} answer={item.answer} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}