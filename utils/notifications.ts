import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are displayed when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
} as any);

export async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'web') return null;

  if (Device?.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return null;
    }

    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        console.warn('No Project ID found for push notifications');
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      return token;
    } catch (e) {
      console.error('Push Token Error:', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-wisdom', {
      name: 'Daily Wisdom',
      importance: (Notifications as any).AndroidImportance?.HIGH ?? 4,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF9800',
    } as any);
  }

  return null;
}

export async function scheduleDailyVerseNotification(verse: string, advice: string) {
  if (Platform.OS === 'web') return;

  try {
    // 1. Cancel existing to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // 2. Schedule for 7:00 AM every day
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Krishna's Morning Wisdom 🪷",
        body: advice,
        sound: 'default',
        android: {
          channelId: 'daily-wisdom',
        },
      },
      trigger: {
        hour: 7,
        minute: 0,
        repeats: true,
      },
    } as any);
    console.log('Notification scheduled for 7:00 AM');
  } catch (error) {
    console.error('Error scheduling daily notification:', error);
  }
}
