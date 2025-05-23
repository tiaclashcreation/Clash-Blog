"use client";

import React, { useEffect, useState } from "react";

const COURSE_START = new Date("2025-06-29T23:00:00Z");

function getTimeRemaining(target: Date) {
  const now = new Date();
  const total = target.getTime() - now.getTime();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

export default function CountdownDate() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(COURSE_START));

  // Add these constants at the top of the component, after COURSE_START
  const totalSpots = 12;
  const spotsLeft = 7;
  const spotsFilled = totalSpots - spotsLeft;
  const percentFilled = (spotsFilled / totalSpots) * 100;

  useEffect(() => {
    if (timeLeft.total <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(COURSE_START));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft.total]);

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 shadow-lg flex flex-col items-center py-1 px-2 pr-8"
      style={{
        background: `linear-gradient(90deg, var(--theme-gradient-start, #fff) 0%, var(--accent-coral, #FF6B49) 30%, var(--accent-coral, #FF6B49) 80%, var(--theme-gradient-end, #fff) 100%)`,
        color: '#fff',
        opacity: 1,
      }}
    >
      <div className="flex items-center w-full gap-4">
        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="font-bold text-base tracking-tight mr-1">
            Cohort Starts in:
          </span>
          {timeLeft.total > 0 ? (
            <div className="flex gap-1 text-base md:text-lg">
              <span><span className="font-bold">{timeLeft.days}</span> days</span>
              <span><span className="font-bold">{timeLeft.hours}</span> hours</span>
              <span><span className="font-bold">{timeLeft.minutes}</span> min</span>
              <span><span className="font-bold">{timeLeft.seconds}</span> sec</span>
            </div>
          ) : (
            <div className="text-sm font-semibold ml-1">Course has started!</div>
          )}
        </div>
        <div className="hidden md:flex items-center gap-2 min-w-[120px]">
          <span
            className="text-sm font-semibold px-3 py-1 rounded transition-colors"
            style={{
              color: '#fff',
              background: 'transparent',
              opacity: 1,
            }}
          >
            Only {spotsLeft} spots left
          </span>
          <div className="relative w-16 h-1 rounded overflow-hidden" style={{ background: 'rgba(255,107,73,0.2)' }}>
            <div
              className="absolute left-0 top-0 h-1 rounded"
              style={{ width: `${percentFilled}%`, background: 'var(--accent-coral, #FF6B49)' }}
            />
          </div>
          <a
            href="https://www.verticalshortcut.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-1 font-bold rounded shadow transition-colors text-sm"
            style={{
              background: 'var(--accent-coral, #FF6B49)',
              color: '#fff',
              opacity: 0.9,
            }}
          >
            Apply now
          </a>
        </div>
      </div>
    </div>
  );
} 