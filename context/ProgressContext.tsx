import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/utils/storage';

interface ProgressContextType {
  readVerses: string[];
  lastRead: string | null;
  toggleProgress: (id: string) => Promise<void>;
  progressPercentage: number;
  totalVerses: number;
  readCount: number;
  clearProgress: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [readVerses, setReadVerses] = useState<string[]>([]);
  const [lastRead, setLastRead] = useState<string | null>(null);
  const TOTAL_VERSES = 701;

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const last = await storage.getLastRead();
    const history = await storage.getItem('readHistory');
    setLastRead(last);
    if (history) {
      setReadVerses(JSON.parse(history));
    }
  };

  const toggleProgress = async (verseId: string) => {
    let newHistory;
    if (readVerses.includes(verseId)) {
      newHistory = readVerses.filter(id => id !== verseId);
    } else {
      newHistory = [...new Set([...readVerses, verseId])];
      await storage.saveLastRead(verseId);
      setLastRead(verseId);
    }
    
    setReadVerses(newHistory);
    await storage.setItem('readHistory', JSON.stringify(newHistory));
  };

  const progressPercentage = (readVerses.length / TOTAL_VERSES) * 100;

  const clearProgress = async () => {
    setReadVerses([]);
    setLastRead(null);
    await storage.removeItem('readHistory');
    await storage.removeItem('last_read_verse');
  };

  return (
    <ProgressContext.Provider 
      value={{ 
        readVerses, 
        lastRead, 
        toggleProgress, 
        progressPercentage, 
        totalVerses: TOTAL_VERSES, 
        readCount: readVerses.length,
        clearProgress
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
};
