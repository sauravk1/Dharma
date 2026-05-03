import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { BookmarksProvider } from '@/context/BookmarksContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

function RootLayoutContent() {
  const { theme, colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.sacredSilk }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.royalBlue,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: colors.sacredSilk,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
        <RootLayoutContent />
      </BookmarksProvider>
    </ThemeProvider>
  );
}
