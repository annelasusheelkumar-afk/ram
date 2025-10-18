'use server';

import {
  addDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { generateResponseToCustomerInquiry } from '@/ai/flows/generate-response-to-customer-inquiry';
import { z } from 'zod';
import { collection, serverTimestamp, addDoc, getFirestore, doc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

// Server-side Firebase initialization
const getFirestoreInstance = () => {
    if (!getApps().length) {
        initializeApp(firebaseConfig);
    }
    return getFirestore(getApp());
};

const firestore = getFirestoreInstance();

const inquirySchema = z.object({
  customerInquiry: z.string().min(1, 'Message cannot be empty.'),
  inquiryId: z.string(),
  userId: z.string(),
});

export type FormState = {
  response?: string;
  sentiment?: string;
  error?: string;
};

export async function createInquiry(userId: string): Promise<string | null> {
    try {
        const inquiryRef = await addDoc(collection(firestore, 'inquiries'), {
            userId: userId,
            status: 'open',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            customerName: 'Guest',
            lastMessage: 'New inquiry started.'
        });
        return inquiryRef.id;
    } catch (error) {
        console.error("Error creating inquiry: ", error);
        return null;
    }
}


export async function getAiResponseAndSave(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = inquirySchema.safeParse({
    customerInquiry: formData.get('message'),
    inquiryId: formData.get('inquiryId'),
    userId: formData.get('userId'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.customerInquiry?.join(', '),
    };
  }

  const { customerInquiry, inquiryId, userId } = validatedFields.data;
  const inquiryRef = doc(firestore, 'inquiries', inquiryId);
  const messagesColRef = collection(inquiryRef, 'messages');
  
  // Save user message (non-blocking)
  addDocumentNonBlocking(messagesColRef, {
    role: 'user',
    content: customerInquiry,
    createdAt: serverTimestamp(),
  });
  
  // Update last message on inquiry (non-blocking)
  updateDocumentNonBlocking(inquiryRef, {
    lastMessage: customerInquiry,
    updatedAt: serverTimestamp(),
  });

  try {
    const aiResponse = await generateResponseToCustomerInquiry({ customerInquiry });
    
    // Save AI message (non-blocking)
    addDocumentNonBlocking(messagesColRef, {
        role: 'assistant',
        content: aiResponse.response,
        sentiment: aiResponse.sentiment,
        createdAt: serverTimestamp(),
    });
    
     // Update last message on inquiry with AI response (non-blocking)
    updateDocumentNonBlocking(inquiryRef, {
        lastMessage: aiResponse.response,
        updatedAt: serverTimestamp(),
    });

    return {
      response: aiResponse.response,
      sentiment: aiResponse.sentiment,
    };
  } catch (e) {
    console.error(e);
    const errorMessage = 'Failed to get a response from the AI. Please try again.';
    // Save error message to chat
     addDocumentNonBlocking(messagesColRef, {
        role: 'assistant',
        content: errorMessage,
        createdAt: serverTimestamp(),
    });
    return {
      error: errorMessage,
    };
  }
}
