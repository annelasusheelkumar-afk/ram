
'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { doc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const handleNewUser = (user: User) => {
    const firestore = getFirestore(user.app);
    const userRef = doc(firestore, 'users', user.uid);
    // Assign 'admin' role if the email matches, otherwise 'user'
    const role = user.email === 'ceo@example.com' ? 'admin' : 'user';
    setDoc(userRef, { email: user.email, role: role }, { merge: true });
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
    error => {
      console.error('Email sign-up failed:', error);
      let description = 'An unexpected error occurred.';
      if (error.code === 'auth/email-already-in-use') {
        description =
          'This email is already in use. Please try logging in instead.';
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
  signInWithEmailAndPassword(authInstance, email, password).catch(error => {
    console.error('Email sign-in failed:', error);
    let description = 'An unexpected error occurred.';
    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/wrong-password' ||
      error.code === 'auth/user-not-found'
    ) {
      description = 'Invalid email or password. Please try again.';
    }

    if (onFailure) {
      onFailure();
    } else {
        toast({
            variant: 'destructive',
            title: 'Sign-in failed',
            description,
        });
    }
  });
}
