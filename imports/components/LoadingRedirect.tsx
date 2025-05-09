import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Import the TIA loading animation
import TiaLoadingAnimation from '../Qualification_components/tia-loading-animation';

const LoadingRedirect: React.FC = () => {
  const navigate = useNavigate();
  const targetPath = '/verticalshortcut/homepage';
  const delay = 2000; // 2 seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(targetPath);
    }, delay);

    // Cleanup timer if the component unmounts before redirecting
    return () => clearTimeout(timer);
  }, [navigate]); // Dependency array ensures effect runs once on mount

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)]">
      {/* Replace the text with the TIA loading animation */}
      <TiaLoadingAnimation 
        message="Loading Clash Creation..." 
        duration={0} // Duration managed by useEffect timer above
        onComplete={() => {}} // onComplete managed by useEffect timer above
      />
    </div>
  );
};

export default LoadingRedirect; 