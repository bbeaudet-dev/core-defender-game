import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
}

class NotificationManager {
  private static instance: NotificationManager;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Notification permissions not granted');
        return;
      }

      // Configure for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('puzzle-completion', {
          name: 'Puzzle Completion',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          sound: 'default',
        });
      }

      this.isInitialized = true;
      console.log('Notification manager initialized');
    } catch (error) {
      console.error('Failed to initialize notification manager:', error);
    }
  }

  async sendPuzzleCompletionNotification(puzzleName: string, moduleName: string): Promise<void> {
    await this.initialize();

    try {
      const notification: NotificationData = {
        title: '🎉 Puzzle Complete!',
        body: `${puzzleName} puzzle solved! Check the Home screen for new apps.`,
        data: {
          type: 'puzzle_completion',
          puzzleName,
          moduleName,
        },
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Send immediately
      });

      console.log('Puzzle completion notification sent');
    } catch (error) {
      console.error('Failed to send puzzle completion notification:', error);
    }
  }

  async sendFinalBossDefeatedNotification(): Promise<void> {
    await this.initialize();

    try {
      const notification: NotificationData = {
        title: '🏆 VICTORY!',
        body: 'Final boss defeated! All modules unlocked. System fully restored!',
        data: {
          type: 'final_boss_defeated',
        },
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Send immediately
      });

      console.log('Final boss defeated notification sent');
    } catch (error) {
      console.error('Failed to send final boss defeated notification:', error);
    }
  }

  async sendSystemCorruptedNotification(): Promise<void> {
    await this.initialize();

    try {
      const notification: NotificationData = {
        title: '⚠️ SYST3M CORRUPT3D',
        body: 'C0RE HA$ T@KEN CONTROL OF YOUR DEVICE',
        data: {
          type: 'system_corrupted',
        },
      };

      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null, // Send immediately
      });

      console.log('System corrupted notification sent');
    } catch (error) {
      console.error('Failed to send system corrupted notification:', error);
    }
  }

  // Get notification permissions status
  async getPermissionsStatus(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }

  // Request notification permissions
  async requestPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.requestPermissionsAsync();
  }
}

export default NotificationManager.getInstance(); 