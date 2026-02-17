'use client';

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useTTSContext } from './tts-provider';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface TTSToggleProps {
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export const TTSToggle = ({
  className,
  variant = 'outline',
  size = 'icon',
  showLabel = false,
}: TTSToggleProps) => {
  const { isEnabled, toggleTTS } = useTTSContext();

  return (
    <Button
      onClick={toggleTTS}
      variant={variant}
      size={size}
      className={cn('relative', className)}
      aria-label={isEnabled ? 'Nonaktifkan Text-to-Speech' : 'Aktifkan Text-to-Speech'}
      title={isEnabled ? 'Nonaktifkan Text-to-Speech' : 'Aktifkan Text-to-Speech'}
    >
      {isEnabled ? (
        <>
          <Volume2 className="h-5 w-5" />
          {showLabel && <span className="ml-2">TTS Aktif</span>}
        </>
      ) : (
        <>
          <VolumeX className="h-5 w-5" />
          {showLabel && <span className="ml-2">TTS Nonaktif</span>}
        </>
      )}
    </Button>
  );
};
