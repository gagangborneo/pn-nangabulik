'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
import { useTTS } from '@/hooks/use-tts';
import { useTTSContext } from './tts-provider';

interface AutoTTSWrapperProps {
  children: ReactNode;
  className?: string;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  excludeSelector?: string; // CSS selector for elements to exclude
}

/**
 * Auto TTS Wrapper - Automatically enables TTS on hover for all text elements within its scope
 * This component adds hover listeners to text elements and speaks their content
 */
export const AutoTTSWrapper = ({
  children,
  className,
  lang = 'id-ID',
  rate = 1.0,
  pitch = 1.0,
  volume = 1.0,
  excludeSelector = 'button, a, input, textarea, select',
}: AutoTTSWrapperProps) => {
  const { isEnabled } = useTTSContext();
  const { speak, stop, isSupported } = useTTS();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isSupported || !isEnabled || !wrapperRef.current) return;

    const wrapper = wrapperRef.current;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Skip if same element
      if (target === currentElementRef.current) return;
      
      // Skip if it's excluded or if it's a link/button (they have their own interaction)
      if (excludeSelector && target.matches(excludeSelector)) return;
      
      // Skip if it's the wrapper itself
      if (target === wrapper) return;

      // Check if the element has direct text content (not just from children)
      const textContent = getDirectTextContent(target);
      if (!textContent || textContent.trim().length < 3) return;

      currentElementRef.current = target;
      
      // Add visual feedback
      target.style.transition = 'color 0.2s ease';
      const originalColor = target.style.color;
      target.style.color = '#2563eb'; // blue-600

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Delay before speaking to avoid accidental triggers
      timeoutRef.current = setTimeout(() => {
        speak(textContent, { lang, rate, pitch, volume });
      }, 300);

      // Store original color for restoration
      target.dataset.originalColor = originalColor;
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target === currentElementRef.current) {
        currentElementRef.current = null;
        
        // Restore original color
        const originalColor = target.dataset.originalColor || '';
        target.style.color = originalColor;
        delete target.dataset.originalColor;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      stop();
    };

    wrapper.addEventListener('mouseover', handleMouseOver);
    wrapper.addEventListener('mouseout', handleMouseOut);

    return () => {
      wrapper.removeEventListener('mouseover', handleMouseOver);
      wrapper.removeEventListener('mouseout', handleMouseOut);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      stop();
    };
  }, [isEnabled, isSupported, speak, stop, lang, rate, pitch, volume, excludeSelector]);

  // Helper function to get direct text content (not from deep children)
  const getDirectTextContent = (element: HTMLElement): string => {
    let text = '';
    
    // For headings, paragraphs, spans, divs with direct text
    const allowedTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'DIV', 'LI', 'TD', 'TH', 'LABEL'];
    
    if (allowedTags.includes(element.tagName)) {
      // Get only direct text nodes
      for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE && node.textContent) {
          text += node.textContent;
        }
      }
      
      // If no direct text, get all text content
      if (!text.trim()) {
        text = element.textContent || '';
      }
    }
    
    return text.trim();
  };

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
};
