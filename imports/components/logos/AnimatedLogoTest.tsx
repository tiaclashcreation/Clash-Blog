import React, { useState } from 'react';
import AnimatedLogo from './AnimatedLogo';
import AnimatedLogoMotion from './AnimatedLogoMotion';

/**
 * Component for comparing GSAP and Motion implementations of the animated logo
 */
const AnimatedLogoTest: React.FC = () => {
  const [useMotion, setUseMotion] = useState(true);
  const [skipAnimation, setSkipAnimation] = useState(false);
  
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <div className="mb-4 flex space-x-4">
        <button 
          className={`px-4 py-2 rounded ${useMotion ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setUseMotion(true)}
        >
          Use Motion Implementation
        </button>
        <button 
          className={`px-4 py-2 rounded ${!useMotion ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setUseMotion(false)}
        >
          Use GSAP Implementation
        </button>
        <button 
          className={`px-4 py-2 rounded ${skipAnimation ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setSkipAnimation(!skipAnimation)}
        >
          {skipAnimation ? 'With Animation' : 'Skip Animation'}
        </button>
      </div>
      
      <div className="w-[400px] h-[400px] border border-gray-200 rounded-lg flex items-center justify-center">
        {useMotion ? (
          <AnimatedLogoMotion 
            className="w-full h-full p-4" 
            skipAnimation={skipAnimation}
            onAnimationComplete={handleAnimationComplete}
          />
        ) : (
          <AnimatedLogo 
            className="w-full h-full p-4" 
            skipAnimation={skipAnimation}
            onAnimationComplete={handleAnimationComplete}
          />
        )}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        <p>Current implementation: <span className="font-bold">{useMotion ? 'Motion' : 'GSAP'}</span></p>
        <p>Animation: <span className="font-bold">{skipAnimation ? 'Skipped' : 'Enabled'}</span></p>
      </div>
    </div>
  );
};

export default AnimatedLogoTest;