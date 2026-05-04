import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsContextType {
  fontSize: number;
  updateFontSize: (size: number) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const FONT_SIZE_KEY = 'dharma_font_size';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const savedSize = await AsyncStorage.getItem(FONT_SIZE_KEY);
    if (savedSize) {
      setFontSize(parseInt(savedSize, 10));
    }
  };

  const updateFontSize = async (size: number) => {
    setFontSize(size);
    await AsyncStorage.setItem(FONT_SIZE_KEY, size.toString());
  };

  return (
    <SettingsContext.Provider value={{ fontSize, updateFontSize }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
