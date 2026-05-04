import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STREAK_KEY = 'dharma_streak';
const LAST_OPEN_KEY = 'dharma_last_open';

export const useStreak = () => {
  const [streak, setStreak] = useState(0);
  const [isNewDay, setIsNewDay] = useState(false);

  useEffect(() => {
    updateStreak();
  }, []);

  const updateStreak = async () => {
    try {
      const today = new Date().toDateString();
      const lastOpen = await AsyncStorage.getItem(LAST_OPEN_KEY);
      const savedStreak = await AsyncStorage.getItem(STREAK_KEY);
      const currentStreak = savedStreak ? parseInt(savedStreak, 10) : 0;

      if (!lastOpen) {
        // First time user
        await AsyncStorage.setItem(LAST_OPEN_KEY, today);
        await AsyncStorage.setItem(STREAK_KEY, '1');
        setStreak(1);
        setIsNewDay(true);
        return;
      }

      const lastDate = new Date(lastOpen);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, no change
        setStreak(currentStreak);
      } else if (diffDays === 1) {
        // Consecutive day — increase streak
        const newStreak = currentStreak + 1;
        await AsyncStorage.setItem(STREAK_KEY, newStreak.toString());
        await AsyncStorage.setItem(LAST_OPEN_KEY, today);
        setStreak(newStreak);
        setIsNewDay(true);
      } else {
        // Streak broken
        await AsyncStorage.setItem(STREAK_KEY, '1');
        await AsyncStorage.setItem(LAST_OPEN_KEY, today);
        setStreak(1);
        setIsNewDay(true);
      }
    } catch (e) {
      setStreak(1);
    }
  };

  const getStreakEmoji = () => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⭐';
    return '🪷';
  };

  return { streak, isNewDay, getStreakEmoji };
};
