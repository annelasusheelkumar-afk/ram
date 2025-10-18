'use client';

import { doc, setDoc, Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Saves or updates the user's FCM token in their user profile document.
 * @param firestore The Firestore instance.
 * @param userId The ID of the user.
 * @param fcmToken The FCM token to save.
 */
export function saveFCMToken(firestore: Firestore, userId: string, fcmToken: string): void {
  const userDocRef = doc(firestore, 'users', userId);
  const data = { fcmToken };

  // Use a non-blocking setDoc with merge to create or update the user document
  setDoc(userDocRef, data, { merge: true })
    .catch((serverError) => {
      console.error('Failed to save FCM token:', serverError);
      // Emit a contextual error for debugging security rules
      const permissionError = new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update', // or 'create' if we could distinguish
        requestResourceData: data,
      });
      errorEmitter.emit('permission-error', permissionError);
    });
}
