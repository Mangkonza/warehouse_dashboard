'use client';

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { FaTimes } from 'react-icons/fa';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerSlot?: React.ReactNode;
  footerSlot?: React.ReactNode;
  children: React.ReactNode;
  width?: string;
  className?: string;
  bodyRef?: React.Ref<HTMLDivElement>;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  'aria-label'?: string;
}

/**
 * Global Drawer component with bidirectional slide transitions.
 * - Opening: slide in from right (translateX(100%) -> 0) over 300ms ease-out
 * - Closing: slide out to right (0 -> translateX(100%)) over 250ms ease-in
 * - Overlay fade in/out synchronized with drawer
 * - Waits for close animation to finish before unmounting
 * - Locks background scroll without layout shift (compensates scrollbar width)
 * - Supports prefers-reduced-motion
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  headerSlot,
  footerSlot,
  children,
  width = 'w-full sm:w-[560px]',
  className,
  bodyRef,
  closeOnEsc = true,
  closeOnBackdrop = true,
  'aria-label': ariaLabel = 'แผงรายละเอียด',
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let animFrame: number;
    let timer: NodeJS.Timeout;

    if (isOpen) {
      setIsRendered(true);
      // Wait for DOM paint then trigger slide-in
      animFrame = requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      // Trigger slide-out animation
      setIsVisible(false);
      // Wait for 250ms ease-in slide-out to finish before unmounting
      timer = setTimeout(() => {
        setIsRendered(false);
      }, 260);
    }

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Prevent background scroll without layout shift
  // html in globals.css has scrollbar-gutter: stable, so we do NOT add redundant paddingRight!
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';

      return () => {
        document.documentElement.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isRendered) return null;

  return (
    <>
      {/* Backdrop overlay with fade in/out transition */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity motion-reduce:transition-none",
          isVisible
            ? "opacity-100 pointer-events-auto duration-300 ease-out"
            : "opacity-0 pointer-events-none duration-250 ease-in"
        )}
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Slide panel with bidirectional transform translateX */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          "fixed inset-y-0 right-0 z-50 max-w-full bg-white shadow-2xl flex flex-col h-full transform transition-transform motion-reduce:transition-none",
          width,
          isVisible
            ? "translate-x-0 duration-300 ease-out"
            : "translate-x-full duration-250 ease-in",
          className
        )}
      >
        {/* Header Slot */}
        {headerSlot ? (
          headerSlot
        ) : (
          <div className="border-b border-slate-200 bg-white px-5 py-4 shrink-0 flex items-center justify-between gap-3">
            <div className="flex flex-col min-w-0">
              {title && (
                <h3 className="font-bold text-slate-800 text-base truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <div className="text-xs text-slate-500 mt-0.5 truncate">
                  {subtitle}
                </div>
              )}
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="ปิดแผง"
            >
              <FaTimes className="text-sm" />
            </button>
          </div>
        )}

        {/* Scrollable Body Slot */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto min-h-0">
          {children}
        </div>

        {/* Footer Slot */}
        {footerSlot && (
          <div className="border-t border-slate-200 bg-slate-50/80 px-5 py-3.5 shrink-0">
            {footerSlot}
          </div>
        )}
      </div>
    </>
  );
};
