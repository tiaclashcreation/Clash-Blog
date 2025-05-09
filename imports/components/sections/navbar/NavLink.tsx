import React from 'react';

interface NavLinkProps {
  children: React.ReactNode;
  targetId: string;
  activeSection: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>, targetId: string) => void;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ children, targetId, activeSection, onClick, className }) => {
  return (
    <button
      onClick={(e) => onClick(e, targetId)}
      className={`px-3 lg:px-6 py-2 lg:py-3 rounded-theme-lg text-theme-primary border border-theme-accent hover:bg-theme-secondary/30 text-xs lg:text-sm font-medium transition-all duration-300 ${
        activeSection === targetId ? "bg-theme-secondary shadow-theme-btn" : ""
      } ${className || ''}`}
    >
      {children}
    </button>
  );
};

export default NavLink; 