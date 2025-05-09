import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { XCircle } from 'lucide-react';

interface VSModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

/**
 * VSModal - Base modal component following VS styling guidelines
 * 
 * Features:
 * - Light/dark mode aware styling
 * - Animated entrance/exit using GSAP
 * - Floating elements for visual interest
 * - Proper gradient backgrounds
 * - Close on ESC key press and overlay click (configurable)
 */
const VSModal: React.FC<VSModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  width = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Width classes mapping
  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  // Handle animation with GSAP
  useGSAP(() => {
    if (!isOpen || !modalRef.current || !overlayRef.current) return;

    // Get computed theme variables for animation
    const styles = getComputedStyle(document.documentElement);
    const animDistance = parseFloat(styles.getPropertyValue('--theme-anim-distance') || '-4px');
    const animDuration = parseFloat(styles.getPropertyValue('--theme-anim-duration') || '0.35');

    const ctx = gsap.context(() => {
      // Animate overlay
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      });

      // Animate modal - simplified animation that works better with scrolling
      gsap.fromTo(modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: animDuration + 0.05, ease: "back.out(1.2)" }
      );

      // Floating elements animation
      gsap.to(".modal-floating-element", {
        y: animDistance * 2.5,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true, 
        stagger: 0.4
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isOpen]);

  // Handle modal close animation
  const handleClose = () => {
    if (!modalRef.current || !overlayRef.current) {
      onClose();
      return;
    }

    // Animate overlay
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    });

    // Animate modal - simpler animation for closing that works better
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.2,
      ease: "power3.in",
      onComplete: onClose
    });
  };

  // Close on ESC key
  useEffect(() => {
    if (!closeOnEsc) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, closeOnEsc]);

  // Fix iOS scrolling issues
  useEffect(() => {
    if (isOpen) {
      // Save the current position
      const scrollY = window.scrollY;
      
      // Apply the position to the body
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restore the position
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Modal JSX content
  const modalContent = (
    <div ref={containerRef} className="fixed inset-0 z-[1000] overflow-y-auto">
      {/* Backdrop/Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-[2px] opacity-0 transition-opacity"
        onClick={closeOnOverlayClick ? handleClose : undefined}
        style={{ touchAction: 'manipulation' }}
      />

      {/* Modal Container - positioned in viewport */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-[1100] overflow-auto">
        <div
          ref={modalRef}
          className={`w-full ${widthClasses[width]} relative bg-theme-gradient rounded-lg shadow-theme-md overflow-hidden opacity-0 z-[1200] my-auto`}
          onClick={(e) => e.stopPropagation()}
          style={{ touchAction: 'manipulation' }}
        >
          {/* Floating elements for visual interest */}
          <div className="modal-floating-element absolute top-10 right-10 -z-10 w-20 h-20 rounded-[40%] rotate-12 opacity-[var(--theme-float-opacity)] bg-[var(--theme-float-bg-primary)]"></div>
          <div className="modal-floating-element absolute bottom-10 left-10 -z-10 w-24 h-24 rounded-[30%] -rotate-6 opacity-[var(--theme-float-opacity-secondary)] bg-[var(--theme-float-bg-secondary)]"></div>
          
          {/* Modal Content */}
          <div className="relative z-10">
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="p-5 md:p-6 border-b border-[var(--theme-border-light)] flex items-center justify-between">
                {title && (
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-theme-primary">{title}</h2>
                    {description && (
                      <p className="mt-1 text-theme-tertiary text-sm">{description}</p>
                    )}
                  </div>
                )}
                
                {showCloseButton && (
                  <button
                    onClick={handleClose}
                    className="text-theme-tertiary hover:text-theme-primary transition-colors hover-bubbly-sm p-1"
                    aria-label="Close modal"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                )}
              </div>
            )}
            
            {/* Body */}
            <div className="p-5 md:p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export { VSModal };