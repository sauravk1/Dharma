import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'hi' | 'both';

interface SettingsContextType {
  fontSize: number;
  language: Language;
  hapticsEnabled: boolean;
  remindersEnabled: boolean;
  updateFontSize: (size: number) => Promise<void>;
  updateLanguage: (lang: Language) => Promise<void>;
  toggleHaptics: () => Promise<void>;
  toggleReminders: () => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const FONT_SIZE_KEY = 'dharma_font_size';
const LANGUAGE_KEY = 'dharma_language';
const HAPTICS_KEY = 'dharma_haptics_enabled';
const REMINDERS_KEY = 'dharma_reminders_enabled';

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontSize, setFontSize] = useState(16);
  const [language, setLanguage] = useState<Language>('both');
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedSize, savedLang, savedHaptics, savedReminders] = await Promise.all([
        AsyncStorage.getItem(FONT_SIZE_KEY),
        AsyncStorage.getItem(LANGUAGE_KEY),
        AsyncStorage.getItem(HAPTICS_KEY),
        AsyncStorage.getItem(REMINDERS_KEY),
      ]);

      if (savedSize) setFontSize(parseInt(savedSize, 10));
      if (savedLang) setLanguage(savedLang as Language);
      if (savedHaptics !== null) setHapticsEnabled(savedHaptics === 'true');
      if (savedReminders !== null) setRemindersEnabled(savedReminders === 'true');
    } catch (e) {
      console.error('Error loading settings', e);
    }
  };

  const updateFontSize = async (size: number) => {
    setFontSize(size);
    await AsyncStorage.setItem(FONT_SIZE_KEY, size.toString());
  };

  const updateLanguage = async (lang: Language) => {
    setLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  };

  const toggleHaptics = async () => {
    const newValue = !hapticsEnabled;
    setHapticsEnabled(newValue);
    await AsyncStorage.setItem(HAPTICS_KEY, newValue.toString());
  };

  const toggleReminders = async () => {
    const newValue = !remindersEnabled;
    setRemindersEnabled(newValue);
    await AsyncStorage.setItem(REMINDERS_KEY, newValue.toString());
  };

  const resetSettings = async () => {
    setFontSize(16);
    setLanguage('both');
    setHapticsEnabled(true);
    setRemindersEnabled(true);
    await AsyncStorage.multiRemove([FONT_SIZE_KEY, LANGUAGE_KEY, HAPTICS_KEY, REMINDERS_KEY]);
  };

  return (
    <SettingsContext.Provider value={{ 
      fontSize, 
      language,
      hapticsEnabled, 
      remindersEnabled, 
      updateFontSize, 
      updateLanguage,
      toggleHaptics, 
      toggleReminders,
      resetSettings
    }}>
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
