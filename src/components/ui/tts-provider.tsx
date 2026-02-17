'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TTSContextType {
  isEnabled: boolean;
  toggleTTS: () => void;
  setTTSEnabled: (enabled: boolean) => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export const useTTSContext = () => {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTSContext must be used within TTSProvider');
  }
  return context;
};

export const TTSProvider = ({ children }: { children: ReactNode }) => {
  const [isEnabled, setIsEnabled] = useState(true); // Enabled by default

  const toggleTTS = () => setIsEnabled(prev => !prev);
  const setTTSEnabled = (enabled: boolean) => setIsEnabled(enabled);

  return (
    <TTSContext.Provider value={{ isEnabled, toggleTTS, setTTSEnabled }}>
      {children}
    </TTSContext.Provider>
  );
};
