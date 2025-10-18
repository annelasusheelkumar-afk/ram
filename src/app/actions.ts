'use server';

import { generateResponseToCustomerInquiry } from '@/ai/flows/generate-response-to-customer-inquiry';
import { z } from 'zod';

const inquirySchema = z.object({
  customerInquiry: z.string().min(1, 'Message cannot be empty.'),
});

export type FormState = {
  response?: string;
  sentiment?: string;
  error?: string;
};

export async function getAiResponse(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = inquirySchema.safeParse({
    customerInquiry: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.customerInquiry?.join(', '),
    };
  }
  
  try {
    const { customerInquiry } = validatedFields.data;
    // In a real app, you might pass conversation history to the AI.
    const aiResponse = await generateResponseToCustomerInquiry({ customerInquiry });
    
    // In a real app, you would save messages to a database here.
    
    return {
      response: aiResponse.response,
      sentiment: aiResponse.sentiment,
    };
  } catch (e) {
    console.error(e);
    return {
      error: 'Failed to get a response from the AI. Please try again.',
    };
  }
}
