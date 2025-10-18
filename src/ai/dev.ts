import { config } from 'dotenv';
config();

import '@/ai/flows/generate-response-to-customer-inquiry.ts';
import '@/ai/flows/analyze-customer-message-sentiment.ts';