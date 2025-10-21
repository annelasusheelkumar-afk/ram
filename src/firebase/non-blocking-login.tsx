
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { doc, setDoc, getFirestore } from 'firebase/firestore';

const handleNewUser = (user: User) => {
    // We need to get the firestore instance from the user's app instance.
    const firestore = getFirestore(user.app);
    // Create a reference to the user's document in the 'users' collection.
    const userRef = doc(firestore, 'users', user.uid);
    // Assign 'admin' role if the email matches, otherwise 'user'
    const role = user.email === 'ceo@example.com' ? 'admin' : 'user';

    // Create a profile object. For anonymous users, email will be null.
    const userProfile = {
      email: user.email,
      role: user.isAnonymous ? 'user' : role, // Anonymous users are always 'user'
    };

    // Use setDoc with merge:true to create the document if it doesn't exist,
    // or update it if it does. This handles both new sign-ups and first-time
    // logins for existing auth users who might not have a profile document.
    setDoc(userRef, userProfile, { merge: true }).catch(error => {
        // This is a background operation, but we should still log errors.
        console.error("Failed to create/update user profile:", error);
    });
}

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance)
    .then(userCredential => handleNewUser(userCredential.user))
    .catch(error => {
    console.error('Anonymous sign-in failed:', error);
    toast({
      variant: 'destructive',
      title: 'Sign-in failed',
      description: 'Could not sign in as guest. Please try again.',
    });
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(
  authInstance: Auth,
  email: string,
  password: string
): void {
  createUserWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => handleNewUser(userCredential.user))
    .catch(
    (error: any) => {
      console.error('Email sign-up failed:', error);
      let description = 'An unexpected error occurred.';
      if (error.code === 'auth/email-already-in-use') {
        description =
          'This email is already in use. Please try logging in instead.';
      } else if (error.code === 'auth/weak-password') {
        description = 'Password should be at least 6 characters.';
      }
      toast({
        variant: 'destructive',
        title: 'Sign-up failed',
        description,
      });
    }
  );
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(
  authInstance: Auth,
  email: string,
  password: string,
  onFailure?: () => void
): void {
  signInWithEmailAndPassword(authInstance, email, password)
    .then(userCredential => handleNewUser(userCredential.user)) // Also handle profile on sign-in
    .catch(error => {
      console.error('Email sign-in failed:', error);
      
      // Always call the onFailure callback if it exists, to handle UI changes like the sad bot.
      if (onFailure) {
        onFailure();
      }

      // Check for specific credential errors and show a toast, but only if there isn't an onFailure handler
      // that might be showing a different kind of feedback (like the sad bot).
      if (!onFailure) {
        let description = 'An unexpected error occurred.';
        if (
          error.code === 'auth/invalid-credential' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/user-not-found'
        ) {
          description = 'Invalid email or password. Please try again.';
        }
        toast({
            variant: 'destructive',
            title: 'Sign-in failed',
            description,
        });
      }
  });
}
