"use client";

import * as React from "react";
import { Link } from "./link";

import { cn } from "../../lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./navigation-menu";
import LaunchUI from "../logos/launch-ui";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export default function Navigation() {
  React.useEffect(() => {
    // Initialize GSAP animations
    const animateNav = () => {
      if (typeof window !== "undefined" && window.gsap) {
        const gsap = window.gsap;
        
        // Animate navigation items
        gsap.fromTo(
          ".nav-item-animate",
          { 
            y: -15, 
            opacity: 0 
          },
          { 
            y: 0, 
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out",
            delay: 0.6 
          }
        );
      }
    };
    
    // Run animation after the component mounts
    animateNav();
    
    // Clean up function not needed for this simple animation
  }, []);

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem className="nav-item-animate">
          <NavigationMenuTrigger>Benefits</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full flex-col justify-end rounded-md bg-theme-gradient p-6 no-underline outline-hidden select-none focus:shadow-theme-md transition-all transition-theme-normal"
                    href="/"
                  >
                    <LaunchUI />
                    <div className="mt-4 mb-2 text-lg font-medium">
                      Launch UI
                    </div>
                    <p className="text-theme-secondary/70 text-sm leading-tight transition-colors transition-theme-normal">
                      Landing page template built with React, Shadcn/ui and
                      Tailwind that you can copy/paste into your project.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/" title="Introduction">
                Re-usable components built using Radix UI and Tailwind CSS.
              </ListItem>
              <ListItem href="/" title="Installation">
                How to install dependencies and structure your app.
              </ListItem>
              <ListItem href="/" title="Typography">
                Styles for headings, paragraphs, lists...etc
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="nav-item-animate">
          <NavigationMenuTrigger>Curriculum</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href="/"
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="nav-item-animate">
          <NavigationMenuTrigger>Success Stories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href="/"
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="nav-item-animate">
          <NavigationMenuTrigger>Pricing</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href="/"
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="nav-item-animate">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link href="/">
              Get Your Plan
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a"> & { title: string }) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          data-slot="list-item"
          className={cn(
            "hover:bg-theme-accent/10 hover:text-theme-accent focus:bg-theme-accent/10 focus:text-theme-accent block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-all duration-[var(--theme-transition-normal)] select-none",
            className,
          )}
          {...props}
        >
          <div className="text-sm leading-none font-medium text-theme-primary transition-colors transition-theme-normal">{title}</div>
          <p className="text-theme-secondary/70 line-clamp-2 text-sm leading-snug transition-colors transition-theme-normal">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
}
