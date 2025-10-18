'use server';

import { getApp } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { initializeFirebase } from '@/firebase';
import { 
  initiateEmailSignUp, 
  initiateEmailSignIn,
  initiateAnonymousSignIn
} from '@/firebase/non-blocking-login';
import { getAuth, signOut as clientSignOut } from 'firebase/auth';

const app = getApp();
const adminAuth = getAdminAuth(app);

// Server actions for authentication
// Note: We use the non-blocking functions to initiate auth changes on the client.
// The actual state change is handled by the onAuthStateChanged listener in the FirebaseProvider.

export async function signUpWithEmail(email: string, password: string): Promise<{ success: boolean, error?: string }> {
  try {
    // We can use the admin SDK to create the user, which is more secure
    await adminAuth.createUser({ email, password });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<{ success: boolean, error?: string }> {
    // This action simply signals the client to attempt sign-in.
    // We are not actually performing the sign in on the server.
    // The client-side firebase SDK will handle it.
  return { success: true };
}

export async function signInAnonymously(): Promise<{ success: boolean, error?: string }> {
    // This action simply signals the client to attempt anonymous sign-in.
  return { success: true };
}


export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    // This needs to be called on the client. We're just orchestrating
    // but the actual sign out will be on the client in the component
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
