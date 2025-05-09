import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import MobileMenu from './MobileMenu';

interface MobileMenuPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavLinkClick: (e: React.MouseEvent<HTMLButtonElement>, targetId: string) => void;
  activeSection: string;
  onApplyClick: () => void;
}

const MobileMenuPortal: React.FC<MobileMenuPortalProps> = (props) => {
  const [mounted, setMounted] = useState(false);
  
  // Create a div element for the portal
  useEffect(() => {
    setMounted(true);
    
    return () => {
      setMounted(false);
    };
  }, []);
  
  // Only render the portal on the client, not during SSR
  if (!mounted) return null;
  
  // Find the root element or create one if it doesn't exist
  let portalRoot = document.getElementById('mobile-menu-portal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'mobile-menu-portal-root';
    document.body.appendChild(portalRoot);
  }

  // Use createPortal to render the MobileMenu at the portal root
  return createPortal(
    <MobileMenu {...props} />,
    portalRoot
  );
};

export default MobileMenuPortal; 