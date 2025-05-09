"use client";

import React from "react";
import { ButtonCollection } from "./ButtonCollection";

const AnimatedButtonsDemo: React.FC = () => {
  return (
    <main 
      className="flex flex-col items-center justify-center min-h-screen w-screen 
        bg-[var(--theme-bg-primary)] text-theme-primary dark:bg-[var(--theme-bg-primary)] dark:text-theme-secondary
        font-['Neue_Haas_Grotesk_Display_Pro'] p-8 transition-colors duration-500"
    >
      <button 
        data-theme-toggle
        className="fixed top-4 right-4 px-4 py-2 rounded-md 
          bg-[var(--theme-primary)] text-theme-on-primary-medium
          hover:bg-[var(--theme-primary-hover)] transition-colors"
      >
        <span data-theme-dark>Dark Mode</span>
        <span data-theme-light className="hidden">Light Mode</span>
      </button>

      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Marble Buttons Demo</h1>
        <p className="text-lg opacity-80 mb-8">
          These buttons feature subtle floating pattern animations, custom theme variables, 
          multiple saturation levels, size variations, and dark mode support.
        </p>
      </div>
      <ButtonCollection />
    </main>
  );
};

export default AnimatedButtonsDemo;
