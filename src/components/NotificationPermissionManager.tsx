'use client';

import { useEffect } from 'react';
import { requestPermissionAndGetToken } from '@/firebase/fcm';
import { useUser, useFirestore } from '@/firebase';
import { saveFCMToken } from '@/firebase/user-profile';
import { useToast } from '@/hooks/use-toast';

export default function NotificationPermissionManager() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (user && firestore) {
      // Check if permission has already been granted
      if ('Notification' in window && Notification.permission === 'granted') {
        requestPermissionAndGetToken()
          .then((token) => {
            if (token) {
              saveFCMToken(firestore, user.uid, token);
            }
          })
          .catch((err) => {
            console.error('An error occurred while retrieving token. ', err);
          });
      } else if ('Notification' in window && Notification.permission === 'default') {
        // We could show a toast or a small UI element to prompt the user
        // For simplicity, we'll request permission directly on load after a short delay
        const timer = setTimeout(() => {
            requestPermissionAndGetToken()
                .then((token) => {
                if (token) {
                    saveFCMToken(firestore, user.uid, token);
                    toast({
                        title: 'Notifications Enabled',
                        description: 'You will now receive updates for your inquiries.',
                    });
                }
            })
            .catch((err) => {
                console.error('An error occurred while requesting permission. ', err);
                toast({
                    variant: 'destructive',
                    title: 'Notification Error',
                    description: 'Could not enable notifications. Please check your browser settings.',
                });
            });
        }, 5000); // Wait 5 seconds before asking

        return () => clearTimeout(timer);
      }
    }
  }, [user, firestore, toast]);

  return null; // This component does not render anything
}
