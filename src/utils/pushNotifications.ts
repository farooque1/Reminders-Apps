
export interface PushNotificationState {
  permission: NotificationPermission;
  isSupported: boolean;
}

export const checkPushNotificationSupport = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

export const getPushNotificationState = (): PushNotificationState => {
  const isSupported = checkPushNotificationSupport();
  const permission = isSupported ? Notification.permission : 'denied';
  
  return {
    permission,
    isSupported
  };
};

export const requestPushNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!checkPushNotificationSupport()) {
    console.warn('Push notifications are not supported in this browser');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Push notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting push notification permission:', error);
    return 'denied';
  }
};

export const sendTestNotification = (title: string, body?: string) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body: body || 'This is a test notification',
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });
  }
};
