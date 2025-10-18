'use server';

/**
 * @fileOverview Analyzes the sentiment of a customer message.
 *
 * - analyzeCustomerMessageSentiment - Analyzes customer message sentiment.
 * - AnalyzeCustomerMessageSentimentInput - The input type for the analyzeCustomerMessageSentiment function.
 * - AnalyzeCustomerMessageSentimentOutput - The return type for the analyzeCustomerMessageSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCustomerMessageSentimentInputSchema = z.object({
  message: z.string().describe('The customer message to analyze.'),
});
export type AnalyzeCustomerMessageSentimentInput = z.infer<typeof AnalyzeCustomerMessageSentimentInputSchema>;

const AnalyzeCustomerMessageSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the customer message (e.g., positive, negative, neutral).'
    ),
  score: z
    .number()
    .describe('A numerical score indicating the strength of the sentiment.'),
  reason: z.string().optional().describe('Explanation for the sentiment analysis result.'),
});
export type AnalyzeCustomerMessageSentimentOutput = z.infer<typeof AnalyzeCustomerMessageSentimentOutputSchema>;

export async function analyzeCustomerMessageSentiment(
  input: AnalyzeCustomerMessageSentimentInput
): Promise<AnalyzeCustomerMessageSentimentOutput> {
  return analyzeCustomerMessageSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCustomerMessageSentimentPrompt',
  input: {schema: AnalyzeCustomerMessageSentimentInputSchema},
  output: {schema: AnalyzeCustomerMessageSentimentOutputSchema},
  prompt: `You are a sentiment analysis expert. Analyze the sentiment of the following customer message and provide a sentiment label, a numerical score, and a short explanation.

Message: {{{message}}}

Respond in JSON format:
{
  "sentiment": "(positive, negative, or neutral)",
  "score": "(numerical score between -1 and 1, indicating sentiment strength)",
 "reason": "Explanation for the sentiment analysis result."
}
`,
});

const analyzeCustomerMessageSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeCustomerMessageSentimentFlow',
    inputSchema: AnalyzeCustomerMessageSentimentInputSchema,
    outputSchema: AnalyzeCustomerMessageSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
