import { useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BookmarksProvider } from '@/context/BookmarksContext';
import { ProgressProvider } from '@/context/ProgressContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { registerForPushNotificationsAsync, scheduleDailyVerseNotification } from '@/utils/notifications';
import { getDivineAdvice } from '@/utils/wisdom';
import gitaData from '@/assets/gita_full.json';

const ONBOARDING_KEY = 'dharma_onboarding_done';

function RootLayoutContent() {
  const { theme, colors } = useTheme();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function init() {
      // Check onboarding
      const done = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (!done) {
        router.replace('/onboarding');
      }
      setChecked(true);

      // Notifications
      if (Platform.OS === 'web') return;
      const token = await registerForPushNotificationsAsync();
      if (token) {
        const randomIndex = Math.floor(Math.random() * gitaData.length);
        const verse = gitaData[randomIndex];
        const advice = getDivineAdvice(verse as any);
        // Use Hindi advice for a more traditional morning feel
        await scheduleDailyVerseNotification(verse.shloka, advice.hindi);
      }
    }
    init();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.sacredSilk }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.white },
          headerTintColor: colors.royalBlue,
          headerTitleStyle: { fontWeight: 'bold' },
          contentStyle: { backgroundColor: colors.sacredSilk },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <BookmarksProvider>
        <ProgressProvider>
          <SettingsProvider>
            <RootLayoutContent />
          </SettingsProvider>
        </ProgressProvider>
      </BookmarksProvider>
    </ThemeProvider>
  );
}
