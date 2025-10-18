'use server';

import {
  initiateEmailSignUp,
  initiateEmailSignIn,
  initiateAnonymousSignIn,
} from '@/firebase/non-blocking-login';
import { getAuth, sendPasswordResetEmail, signOut as clientSignOut } from 'firebase/auth';

// Server actions for authentication
// Note: We use the non-blocking functions to initiate auth changes on the client.
// The actual state change is handled by the onAuthStateChanged listener in the FirebaseProvider.

export async function signUpWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // This action simply signals the client to attempt sign-up.
    // We are not actually performing the sign up on the server.
    // The client-side firebase SDK will handle it.
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  // This action simply signals the client to attempt sign-in.
  // We are not actually performing the sign in on the server.
  // The client-side firebase SDK will handle it.
  return { success: true };
}

export async function signInAnonymously(): Promise<{
  success: boolean;
  error?: string;
}> {
  // This action simply signals the client to attempt anonymous sign-in.
  return { success: true };
}

export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    // The actual sign-out is handled on the client-side by calling firebaseSignOut(getAuth()).
    // This server action is kept for consistency but doesn't perform the sign-out itself.
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendResetPasswordEmail(
    email: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // We can't use the client-side auth instance here, so we must initialize a temporary one
        // on the server to send the email. This is a safe operation.
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error: any) {
        console.error('Password reset email error:', error);
        // Don't leak information about whether the user exists or not.
        // Return success even if the email is not found.
        if (error.code === 'auth/user-not-found') {
            return { success: true };
        }
        return { success: false, error: 'Failed to send reset email.' };
    }
}
