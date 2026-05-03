import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';

export const useProgress = () => {
  const [lastRead, setLastRead] = useState<string | null>(null);
  const [readVerses, setReadVerses] = useState<string[]>([]);
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

  return {
    lastRead,
    readVerses,
    progressPercentage,
    toggleProgress,
    totalVerses: TOTAL_VERSES,
    readCount: readVerses.length
  };
};
