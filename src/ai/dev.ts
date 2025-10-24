'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/generate-response-to-customer-inquiry.ts';
import '@/ai/flows/analyze-customer-message-sentiment.ts';
import '@/ai/flows/generate-chatbot-response.ts';
import '@/ai/flows/resolve-customer-inquiry.ts';
import '@/ai/flows/speech-to-text.ts';
import '@/ai/flows/detect-recurring-issues.ts';
