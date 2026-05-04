import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configure how notifications are displayed when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async (_notification: any) => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  } as any),
});

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'web') {
    return null;
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return null;
    }
    
    try {
      // Get the project ID from expo-constants
      const expoConfig = (Constants as any)?.expoConfig;
      const easConfig = (Constants as any)?.easConfig;
      
      const projectId = 
        expoConfig?.extra?.eas?.projectId ?? 
        easConfig?.projectId;

      if (!projectId) {
        console.log('Project ID not found in app.json. Push notifications might not work in development.');
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({ 
        ...(projectId ? { projectId } : {}) 
      } as any);
      token = tokenData.data;
    } catch (e) {
      console.log('Error getting push token:', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('daily-verses', {
      name: 'Daily Verses',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export async function scheduleDailyVerseNotification(verse: string, advice: string) {
  if (Platform.OS === 'web') return;

  try {
    // Cancel all existing notifications first to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule for 7:00 AM every day
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Krishna's Morning Wisdom 🪷",
        body: advice,
        data: { screen: 'explore' },
      },
      trigger: {
        hour: 7,
        minute: 0,
        repeats: true,
      } as Notifications.NotificationTriggerInput,
    });
    
    console.log('Daily notification scheduled for 7:00 AM');
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}
