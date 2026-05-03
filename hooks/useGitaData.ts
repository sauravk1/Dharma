import { useState, useEffect } from 'react';
import gitaData from '@/assets/gita_full.json';

export interface Verse {
  chapter: number;
  verse: number;
  shloka: string;
  translation: string;
  english: string;
  connection: string;
  mood: string;
}

export const useGitaData = () => {
  const [data, setData] = useState<Verse[]>(gitaData as Verse[]);
  const [randomVerse, setRandomVerse] = useState<Verse | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setRandomVerse(data[randomIndex]);
  }, []);

  const getVersesByMood = (mood: string) => {
    return data.filter(v => v.mood === mood);
  };

  const searchVerses = (query: string) => {
    if (!query) return data;
    const lowerQuery = query.toLowerCase();
    return data.filter(v => 
      v.translation.toLowerCase().includes(lowerQuery) || 
      v.shloka.toLowerCase().includes(lowerQuery) ||
      v.connection.toLowerCase().includes(lowerQuery)
    );
  };

  const findBestMatch = (input: string) => {
    if (!input) return null;
    const tokens = input.toLowerCase().split(/\s+/);
    let bestVerse = null;
    let maxScore = 0;

    // Simple keyword scoring
    for (const verse of data) {
      let score = 0;
      const combinedText = `${verse.translation} ${verse.connection} ${verse.mood}`.toLowerCase();
      
      for (const token of tokens) {
        if (token.length < 3) continue; // Skip small words
        if (combinedText.includes(token)) score++;
      }

      if (score > maxScore) {
        maxScore = score;
        bestVerse = verse;
      }
    }

    // If no good match, return a random one
    return bestVerse || data[Math.floor(Math.random() * data.length)];
  };

  return { data, randomVerse, getVersesByMood, searchVerses, findBestMatch };
};
