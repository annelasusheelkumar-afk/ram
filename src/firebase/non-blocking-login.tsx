'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch(error => {
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
  createUserWithEmailAndPassword(authInstance, email, password).catch(
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
  password: string
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
    toast({
      variant: 'destructive',
      title: 'Sign-in failed',
      description,
    });
  });
}
