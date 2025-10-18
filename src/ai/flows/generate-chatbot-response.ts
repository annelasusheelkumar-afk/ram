'use server';

/**
 * @fileOverview A simple chatbot flow that returns a response from an AI model.
 *
 * - generateChatbotResponse - Generates a response to a user's message.
 * - GenerateChatbotResponseInput - The input type for the generateChatbotResponse function.
 * - GenerateChatbotResponseOutput - The return type for the generateChatbotResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateChatbotResponseInputSchema = z.object({
  message: z.string().describe('The user message to the chatbot.'),
});
export type GenerateChatbotResponseInput = z.infer<
  typeof GenerateChatbotResponseInputSchema
>;

const GenerateChatbotResponseOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type GenerateChatbotResponseOutput = z.infer<
  typeof GenerateChatbotResponseOutputSchema
>;

export async function generateChatbotResponse(
  input: GenerateChatbotResponseInput
): Promise<GenerateChatbotResponseOutput> {
  return generateChatbotResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatbotResponsePrompt',
  input: {
    schema: GenerateChatbotResponseInputSchema,
  },
  output: {
    schema: GenerateChatbotResponseOutputSchema,
  },
  prompt: `You are a helpful AI assistant. Respond to the user's message.

User Message: {{{message}}}
`,
});

const generateChatbotResponseFlow = ai.defineFlow(
  {
    name: 'generateChatbotResponseFlow',
    inputSchema: GenerateChatbotResponseInputSchema,
    outputSchema: GenerateChatbotResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
