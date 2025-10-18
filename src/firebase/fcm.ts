'use client';

import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getApp } from 'firebase/app';

// Get a messaging instance.
export const getFCM = () => getMessaging(getApp());

/**
 * Requests permission to send push notifications and returns the FCM token.
 * @returns The FCM token if permission is granted, otherwise null.
 */
export const requestPermissionAndGetToken = async () => {
  try {
    const messaging = getFCM();
    
    // Check if Notification API is supported
    if (!('Notification' in window)) {
        console.log('This browser does not support desktop notification');
        return null;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // Get the token.
      const fcmToken = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY_HERE', // TODO: Replace with your VAPID key
      });

      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        // TODO: Send this token to your server to store it.
        return fcmToken;
      } else {
        // Show permission request UI.
        console.log('No registration token available. Request permission to generate one.');
        return null;
      }
    } else {
      console.log('Unable to get permission to notify.');
      return null;
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
    return null;
  }
};

/**
 * Subscribes to foreground messages.
 * @param callback The callback to execute when a message is received.
 * @returns An unsubscribe function.
 */
export const onForegroundMessage = (callback: (payload: any) => void) => {
    const messaging = getFCM();
    return onMessage(messaging, callback);
}
