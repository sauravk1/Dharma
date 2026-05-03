import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

export const storage = {
  setItem: async (key: string, value: string) => {
    if (isWeb) {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  getItem: async (key: string) => {
    if (isWeb) {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  removeItem: async (key: string) => {
    if (isWeb) {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
  saveLastRead: async (verseId: string) => {
    if (isWeb) {
      localStorage.setItem('lastRead', verseId);
    } else {
      await AsyncStorage.setItem('lastRead', verseId);
    }
  },
  getLastRead: async () => {
    if (isWeb) {
      return localStorage.getItem('lastRead');
    } else {
      return await AsyncStorage.getItem('lastRead');
    }
  },
};
