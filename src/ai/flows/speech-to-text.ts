'use server';

/**
 * @fileOverview A flow for converting speech to text.
 *
 * - speechToText - Converts audio data to text.
 * - SpeechToTextInput - The input type for the speechToText function.
 * - SpeechToTextOutput - The return type for the speechToText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SpeechToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A chunk of audio, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SpeechToTextInput = z.infer<typeof SpeechToTextInputSchema>;

const SpeechToTextOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio.'),
});
export type SpeechToTextOutput = z.infer<typeof SpeechToTextOutputSchema>;

export async function speechToText(
  input: SpeechToTextInput
): Promise<SpeechToTextOutput> {
  return speechToTextFlow(input);
}

const speechToTextFlow = ai.defineFlow(
  {
    name: 'speechToTextFlow',
    inputSchema: SpeechToTextInputSchema,
    outputSchema: SpeechToTextOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview',
      prompt: [{ media: { url: input.audioDataUri } }],
    });
    return { text: text };
  }
);
