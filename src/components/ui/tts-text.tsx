'use client';

import React, { ReactNode, useRef, ElementType } from 'react';
import { useTTS } from '@/hooks/use-tts';
import { useTTSContext } from './tts-provider';
import { cn } from '@/lib/utils';

interface TTSTextProps {
  children: ReactNode;
  text?: string; // Override text to speak (useful for complex children)
  className?: string;
  as?: ElementType;
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  disabled?: boolean;
  hoverEffect?: boolean; // Add hover effect to indicate TTS is available
}

export const TTSText = ({
  children,
  text,
  className,
  as: Component = 'span',
  lang = 'id-ID',
  rate = 1.0,
  pitch = 1.0,
  volume = 1.0,
  disabled = false,
  hoverEffect = true,
}: TTSTextProps) => {
  const { isEnabled } = useTTSContext();
  const { speak, stop, isSupported } = useTTS();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getTextContent = (node: ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') {
      return String(node);
    }
    if (Array.isArray(node)) {
      return node.map(getTextContent).join(' ');
    }
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: ReactNode }>;
      if (element.props.children) {
        return getTextContent(element.props.children);
      }
    }
    return '';
  };

  const handleMouseEnter = () => {
    if (!isEnabled || !isSupported || disabled) return;

    // Small delay before speaking to avoid accidental triggers
    timeoutRef.current = setTimeout(() => {
      const textToSpeak = text || getTextContent(children);
      if (textToSpeak) {
        speak(textToSpeak, { lang, rate, pitch, volume });
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    stop();
  };

  if (!isSupported || !isEnabled || disabled) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <Component
      className={cn(
        hoverEffect && 'cursor-help transition-colors hover:text-blue-600',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Component>
  );
};
